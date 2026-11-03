#!/usr/bin/env python3
"""Validate latest-five bilingual Morning Scoop archive, stdlib only."""
import json
import sys
from pathlib import Path
from urllib.parse import urlparse

path = Path(sys.argv[1] if len(sys.argv)>1 else "data/editions.json")
data = json.loads(path.read_text(encoding="utf-8"))
items = data.get("editions", [])
assert isinstance(items, list) and 0 < len(items) <= 5, "Archive must contain 1–5 editions"
dates = [e["date"] for e in items]
assert dates == sorted(set(dates), reverse=True), "Dates must be unique and newest first"
for e in items:
    fr = e.get("translations", {}).get("fr")
    assert isinstance(fr, dict), f"Missing French edition: {e['date']}"
    assert e.get("translation", {}).get("provider") == "quebec-french-translator", "Missing translation provider"
    assert e.get("translation", {}).get("translatedAt"), "Missing translatedAt"
    for k in ("id","date","coverageStart","coverageEnd","generatedAt"):
        assert e.get(k)==fr.get(k), f"{e['date']}: {k} differs"
    for k in ("headline","deck","question","editorialNote"):
        assert isinstance(e.get(k),str) and e[k].strip(), f"Missing English {k}"
        assert isinstance(fr.get(k),str) and fr[k].strip(), f"Missing French {k}"
    for sec in ("bigPicture","reads","radar","signals"):
        assert len(e.get(sec,[]))==len(fr.get(sec,[])), f"{e['date']}: {sec} count differs"
    for sec in ("reads","radar"):
        for original,translated in zip(e.get(sec,[]),fr.get(sec,[])):
            for field in ("url","published","updated","verifiedAt","priority"):
                assert original.get(field)==translated.get(field), f"{e['date']}: {sec} {field} differs"
            assert urlparse(original["url"]).scheme == "https", "Source URL must be HTTPS"
            for field in ("title","source"):
                assert original.get(field) and translated.get(field), f"Missing {field}"
            content_fields=("what","why","takeaway") if sec=="reads" else ("detail",)
            for field in content_fields:
                assert original.get(field) and translated.get(field), f"Missing translated {field}"
    if e.get("deepRead"):
        assert fr.get("deepRead"), "Missing translated deeper read"
        for key in ("url","published","verifiedAt"):
            assert e["deepRead"].get(key)==fr["deepRead"].get(key), f"Deep read {key} differs"
        assert urlparse(e["deepRead"]["url"]).scheme=="https", "Deep read URL must be HTTPS"
print("Validated",len(items),"bilingual editions:",", ".join(dates))
