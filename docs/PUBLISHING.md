# Publishing and operations

## Architecture

- **Hosting:** GitHub Pages, deployed by `.github/workflows/deploy-pages.yml` when `main` changes.
- **Storage:** `data/editions.json`, a version-controlled JSON archive, newest first, maximum five complete editions.
- **Research:** Existing ChatGPT automation `6ae3e9ffcfd08191873d3e52c77d1106` at 06:00 America/Moncton, using the existing private Sovereign Cloud Morning Scoop research plugin when available.
- **Translation:** The selected Quebec French Translator skill when available, or the same embedded skill instructions in the existing automation. Both languages are published together.
- **No server or browser write endpoint.** Only the owner-connected GitHub integration can commit an edition. GitHub Actions validates the commit, then deploys static files.

## First-time GitHub Pages activation

The connected GitHub tools used for migration cannot change repository Pages settings. In the repository:

1. Go to [Settings > Pages](https://github.com/ampercival/private-cloud-morning-scoop/settings/pages).
2. Set **Build and deployment > Source** to **GitHub Actions**.
3. Save. The deployment workflow is already present.
4. Go to [Actions > Deploy Morning Scoop to GitHub Pages](https://github.com/ampercival/private-cloud-morning-scoop/actions/workflows/deploy-pages.yml) and use **Run workflow** if an initial deployment did not start automatically.
5. Confirm a successful workflow and visit https://ampercival.github.io/private-cloud-morning-scoop/ .
6. Verify the visible date, English and French article text and the source links.

The site contains only public-source reporting. GitHub Pages publishes it publicly.

## Scheduled publishing algorithm

1. Read the current committed `data/editions.json` using GitHub's `fetch_file` and retain its **blob SHA**.
2. Research English and French primary sources using the existing research skill. Deduplicate against the five latest editions and verify original dates and source links.
3. Prepare an English edition following the fields and structure of the latest committed edition.
4. Translate all English content into professional fr-CA using the selected translator's instructions; translate names and editorial notes while preserving dates, identifiers, article links, priorities and metadata.
5. Add `translations.fr` and `translation: {provider: 'quebec-french-translator', translatedAt: <actual ISO time>}`. Disclose in `editorialNote` whether the selected skill was loaded directly or its embedded instructions used.
6. Validate that English and French have identical source identifiers, counts, priorities, dates, timestamps, and links. Reject partial translations.
7. Upsert the complete edition by `date`, sort descending, retain exactly the latest five **available** dates, and serialize to `{ "editions": [ ... ] }`.
8. Use GitHub `update_file` on `data/editions.json` with the previously fetched blob SHA. When the commit is rejected due to a conflict, fetch the latest file and reconcile **before** retrying. Never overwrite concurrent editions.
9. Use `fetch_file` again and verify the persisted English headline, full French headline, the two bodies, publication metadata and archive dates. The commit is the publication source of truth.
10. GitHub Actions validates and deploys the static site. The pipeline must pass before the updated edition appears on GitHub Pages. Confirm the Pages public JSON at `https://ampercival.github.io/private-cloud-morning-scoop/data/editions.json` when network access permits.
11. Deliver the same briefing in ChatGPT, reporting **committed**, **deployed and verified**, or **blocked** accurately. A commit alone is not proof of live Pages deployment.

On failure, leave the committed archive unchanged. Report the cause and preserve previous editions. Do not fall back to the prior ChatGPT Site for publishing after cutover.

## Automation schedule

The existing daily automation remains enabled, with an `America/Moncton` timezone and local 06:00 daily cadence, including daylight saving adjustments. No additional automation or secret token is required.

## Smoke test

- GitHub `main` contains `index.html`, `styles.css`, `app.js`, `favicon.svg` and the five bilingual records.
- `python scripts/validate_archive.py` succeeds.
- `.github/workflows/deploy-pages.yml` reports a successful deployment.
- GitHub Pages serves `index.html`, the JavaScript/CSS, and `data/editions.json`.
- The latest edition shows in both languages; previous editions open; filtering, search, light/dark mode and direct URLs work.
- A subsequent scheduled edition is committed with a valid blob SHA and appears on GitHub Pages without manual action.

## Rollback

The old ChatGPT Site was deliberately left untouched during migration, so it can be used as a reference until this pipeline is proven. Do not delete that Site before successful GitHub Pages deployment and verification of an automated daily update.

If an invalid data commit is ever made, restore the last known-good `data/editions.json` revision and confirm GitHub Pages redeployment. Git version history provides the audit trail.
