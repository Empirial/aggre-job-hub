import { describe, it, expect, vi, afterEach } from "vitest";
import { friendlyError, fetchWithTimeout } from "./api";

describe("friendlyError", () => {
  it("surfaces a string detail message from the backend", async () => {
    const res = new Response(JSON.stringify({ detail: "Job not found" }), { status: 404 });
    expect(await friendlyError(res)).toBe("Job not found");
  });

  it("never surfaces a raw FastAPI validation-error array", async () => {
    // This is the exact shape of a 422 from FastAPI's default validation error —
    // the whole point of this function is that this never reaches a toast.
    const res = new Response(
      JSON.stringify({ detail: [{ loc: ["body", "title"], msg: "field required", type: "missing" }] }),
      { status: 422 }
    );
    const message = await friendlyError(res);
    expect(message).not.toContain("loc");
    expect(message).not.toContain("msg");
    expect(message.toLowerCase()).toContain("valid");
  });

  it("falls back to a status-based message for a 401 with no JSON body", async () => {
    const res = new Response("Unauthorized", { status: 401 });
    expect(await friendlyError(res)).toBe("Please sign in again.");
  });

  it("falls back to a status-based message for a 429", async () => {
    const res = new Response("", { status: 429 });
    expect(await friendlyError(res)).toMatch(/too fast/i);
  });

  it("never surfaces a raw 500 stack trace", async () => {
    const res = new Response("Traceback (most recent call last): ...", { status: 500 });
    const message = await friendlyError(res);
    expect(message).not.toContain("Traceback");
  });
});

describe("fetchWithTimeout", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    vi.useRealTimers();
  });

  it("resolves normally when the request completes before the timeout", async () => {
    const fakeResponse = new Response("ok", { status: 200 });
    global.fetch = vi.fn().mockResolvedValue(fakeResponse) as unknown as typeof fetch;

    const res = await fetchWithTimeout("https://example.test/fast", {}, 1000);
    expect(res).toBe(fakeResponse);
  });

  it("aborts and throws a friendly message when the request hangs past the timeout", async () => {
    vi.useFakeTimers();
    global.fetch = vi.fn((_url: string, options?: RequestInit) => {
      return new Promise((_resolve, reject) => {
        options?.signal?.addEventListener("abort", () => {
          reject(new DOMException("Aborted", "AbortError"));
        });
      });
    }) as unknown as typeof fetch;

    const promise = fetchWithTimeout("https://example.test/slow", {}, 50);
    const assertion = expect(promise).rejects.toThrow(/too long to respond/i);
    await vi.advanceTimersByTimeAsync(50);
    await assertion;
  });

  it("throws a friendly message on a genuine network failure", async () => {
    global.fetch = vi.fn().mockRejectedValue(new TypeError("Failed to fetch")) as unknown as typeof fetch;

    await expect(fetchWithTimeout("https://example.test/down")).rejects.toThrow(/couldn't reach the server/i);
  });
});
