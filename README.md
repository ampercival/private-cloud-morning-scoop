# Sovereign & Private Cloud | Morning Scoop

A public-source executive intelligence publication for Government of Canada sovereign and private cloud services. The website supports English and French (fr-CA), light and dark appearance, direct edition links, searchable articles, priority filters and the latest five verified bilingual editions.

**Research, writing, translation and publication are automated using AI.** Verify consequential information against original linked sources. The publication is independent and carries no official Government of Canada endorsement.

## Website

Designed for GitHub Pages, with no server-side runtime, API key or build dependencies.

**GitHub Pages setup (one-time):**
1. Repository **Settings > Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Choose branch **main**, folder **/(root)**, then **Save**.
4. The public project site should become available at **https://ampercival.github.io/private-cloud-morning-scoop/** once Pages reports a successful deployment.

All paths in HTML are relative, so the project path works without a custom domain.

## Publishing one edition

The canonical archive is `data/editions.json`. It is a JSON object with an `editions` array of the five latest editions, newest first. Each contains the full verified English source edition, `translations.fr` with all the same fields, and `translation` metadata.

For each new briefing:
1. Run the existing Morning Scoop research once and prepare a fully verified English edition.
2. Translate the complete edition using the existing Quebec French Translator instructions.
3. Validate language parity, dates, URLs, section lengths, priority codes, translation provider and timestamp.
4. Upsert the edition by `date`, descending sort, retain the latest **five**, and commit the complete JSON to `main` using the connected GitHub service. Never commit credentials or internal government information.
5. Verify the committed JSON and the deployed GitHub Pages result before claiming publication.

GitHub Pages rebuilds on commits to the configured publishing branch. No browser-side write endpoint or publishing credential is required.

## Migration

The initial archive was exported from the existing ChatGPT Site at https://private-cloud-morning-scoop.am-percival.chatgpt.site and retains all five published bilingual editions as at November 3, 2026.

**Cutover safety:** Keep the existing Site and its morning publishing workflow operating until GitHub Pages is explicitly enabled and the GitHub publishing path is proven. The old Site can then be decommissioned deliberately; changing the scheduled task prematurely risks losing daily editions.

This repository is **public**, and GitHub Pages is publicly accessible. All committed editions must use public-source material only.
