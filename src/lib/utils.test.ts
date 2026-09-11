import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("joins plain class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("drops falsy values", () => {
    expect(cn("a", false, undefined, null, "b")).toBe("a b");
  });

  it("resolves conflicting Tailwind classes, keeping the last one", () => {
    // This is the whole reason to use tailwind-merge over a plain clsx join —
    // "px-2 px-4" would otherwise emit both classes and let CSS source order
    // decide, which is exactly the kind of bug this utility exists to prevent.
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("supports the conditional-object form", () => {
    expect(cn("base", { active: true, hidden: false })).toBe("base active");
  });
});
