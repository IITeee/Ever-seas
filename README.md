# Ever Seas

Presentation site for **Ever Seas**, an endless-ocean game coming to PC.

The site is static HTML, CSS, and JavaScript in [`site/`](site/). GitHub Actions (`.github/workflows/pages.yml`) publishes that folder to GitHub Pages, with the custom domain `everseas.app` (`site/CNAME`).

In-game screenshots are stored as Base64 text in `site/assets/*.b64` and decoded during the Pages deploy. To preview the site locally, run `python3 site/decode-assets.py` first, then open `site/index.html` in a browser.
