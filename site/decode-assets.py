#!/usr/bin/env python3
"""Decode site/assets/*.b64 into the screenshot files used by the site."""
from __future__ import annotations

import base64
from pathlib import Path


def main() -> None:
    assets = Path(__file__).resolve().parent / "assets"
    files = sorted(assets.glob("*.b64"))
    if not files:
        raise SystemExit(f"No .b64 screenshot files found in {assets}")
    for src in files:
        dest = src.with_name(src.name[: -len(".b64")])
        dest.write_bytes(base64.b64decode(src.read_text(encoding="ascii")))
        print(f"wrote {dest.name}")


if __name__ == "__main__":
    main()
