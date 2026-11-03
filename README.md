# Sovereign & Private Cloud | Morning Scoop

A public-source executive intelligence publication for Government of Canada sovereign and private cloud services. The website supports English and French (fr-CA), light and dark appearance, direct edition links, searchable articles, priority filters and the latest five verified bilingual editions.

**Research, writing, translation and publication are automated using AI.** Verify consequential information against original linked sources. The publication is independent and carries no official Government of Canada endorsement.

## GitHub Pages

**Live site after Pages activation:** https://ampercival.github.io/private-cloud-morning-scoop/

Open [Settings > Pages](https://github.com/ampercival/private-cloud-morning-scoop/settings/pages), select **GitHub Actions** as the publishing source, and use the existing deployment workflow. See [publishing and operations](docs/PUBLISHING.md) for steps and validation.

## Daily publication

The existing daily ChatGPT automation updates the validated bilingual archive at `data/editions.json` via the connected GitHub integration. Each commit triggers GitHub Actions to validate and publish the latest five editions. The archive and frontend are publicly readable; publishing requires GitHub write permissions.

## History and safety

The first five bilingual editions were exported from the earlier ChatGPT Site on November 3, 2026. That Site remains unchanged until GitHub Pages and a scheduled update have been verified. No access credentials or government-internal content are stored in this repository.
