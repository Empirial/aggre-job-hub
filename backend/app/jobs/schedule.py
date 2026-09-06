"""
CareerGate — daily job scraper
Runs as the 'scraper' process on Fly.io, scheduled via cron at 04:00 UTC (06:00 SAST).
"""

import os
import sys
import json
import urllib.request
import urllib.error
from datetime import datetime, timezone

BASE_URL = os.environ.get("API_BASE_URL", "http://localhost:8000")
ENDPOINT = f"{BASE_URL}/jobs/scrape"

PAYLOAD = {
    "keywords": ["software engineer", "developer", "data analyst"],
    "location": "South Africa",
    "max_per_source": 10,
}


def run() -> None:
    now = datetime.now(timezone.utc).isoformat()
    print(f"[{now}] CareerGate scraper starting — POST {ENDPOINT}")

    body = json.dumps(PAYLOAD).encode("utf-8")
    req = urllib.request.Request(
        ENDPOINT,
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            raw = resp.read().decode("utf-8")
            data = json.loads(raw)
            total = data.get("total", data.get("count", "?"))
            print(f"[{now}] Scrape complete — {total} jobs returned.")
            print(f"[{now}] Response: {json.dumps(data, indent=2)[:500]}")
    except urllib.error.HTTPError as exc:
        body_text = exc.read().decode("utf-8", errors="replace")
        print(f"[{now}] HTTP {exc.code} error: {body_text[:300]}", file=sys.stderr)
        sys.exit(1)
    except urllib.error.URLError as exc:
        print(f"[{now}] Connection error: {exc.reason}", file=sys.stderr)
        sys.exit(1)
    except Exception as exc:  # noqa: BLE001
        print(f"[{now}] Unexpected error: {exc}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    run()
