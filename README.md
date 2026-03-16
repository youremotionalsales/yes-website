# YES Website

Official static marketing website for **Your Emotional Sales (YES)**.

This repository contains the public-facing YES website built as a **static multi-page site** with a lightweight front-end toolchain based on **Gulp**, **Bootstrap 5**, **Font Awesome**, and **vanilla JavaScript**.

The project is designed to generate an optimized `dist/` directory and publish it through **GitHub Pages**.

## Overview

The website presents the YES positioning, solutions, company profile, legal pages, and contact entry points.

Current content is structured around:

- **Home** (`index.html`)
- **About** (`chi-siamo.html`)
- **Solutions** (`soluzioni.html`)
- **Future Lab** (`future-lab.html`)
- **Contacts** (`contatti.html`)
- **Privacy Policy** (`privacy-policy.html`)
- **Cookie Policy** (`cookie-policy.html`)

The source content is currently written in **Italian**, while the codebase and build flow are language-agnostic.

## Tech Stack

- **Node.js** based front-end workflow
- **Gulp 4** as build orchestrator
- **Bootstrap 5.3** for layout and UI primitives
- **Font Awesome 6** for icons and webfonts
- **jQuery** and **Bootstrap JS** bundled into a vendor file
- **Vanilla JavaScript** for site interactions
- **gulp-file-include** for reusable HTML partials
- **GitHub Actions + GitHub Pages** for deployment

## How the Project Works

The repository is organized as a source-to-distribution pipeline:

- `src/` contains pages, styles, scripts, images, favicon, and reusable partials.
- `gulpfile.js` compiles and assembles the final website.
- `dist/` is generated during the build and is the only folder deployed.

### Build pipeline

The build process performs the following tasks:

1. Cleans the existing `dist/` folder.
2. Compiles HTML pages with partial inclusion via `gulp-file-include`.
3. Bundles vendor CSS and app CSS into `dist/css/main.css`.
4. Bundles vendor JavaScript into `dist/js/vendors.js`.
5. Bundles project JavaScript into `dist/js/main.js`.
6. Copies Font Awesome webfonts into `dist/webfonts/`.
7. Copies static assets such as images and favicon into `dist/`.
8. Generates sourcemaps for CSS and JavaScript bundles.

## Main Functional Characteristics

### Static multi-page architecture

The website is not based on a framework such as React, Vue, or Next.js. It is a classic static multi-page site, which makes it simple to host, fast to deploy, and easy to maintain.

### Reusable HTML partials

Shared layout fragments are stored under `src/partials/` and injected into pages during the build.

This currently includes reusable sections such as:

- document `<head>`
- header / navigation
- footer
- shared script includes

### Single CSS bundle

All vendor and custom styles are merged into one minified output file:

- `dist/css/main.css`

This includes Bootstrap, Font Awesome CSS, and the YES custom design system defined in `src/main.css`.

### JavaScript behavior

The custom front-end behavior is intentionally lightweight. Current interactions include:

- dynamic footer year
- smooth scrolling for internal anchors
- mobile navbar collapse handling
- contact form handling
- `mailto:` fallback generation with prefilled subject and message body

### Contact flow

The website does **not** currently integrate with a backend form handler or API.

The contact form on `contatti.html` uses a client-side `mailto:` strategy:

- validates fields in the browser
- builds a prefilled email
- opens the user’s default mail client

This is important for anyone maintaining or extending the project: form submissions are **not stored server-side** and are **not sent through an application endpoint**.

## Repository Structure

```text
.
├── .github/
│   └── workflows/
│       └── pages.yml
├── src/
│   ├── partials/
│   ├── index.html
│   ├── chi-siamo.html
│   ├── soluzioni.html
│   ├── future-lab.html
│   ├── contatti.html
│   ├── privacy-policy.html
│   ├── cookie-policy.html
│   ├── main.css
│   ├── main.js
│   └── static assets
├── gulpfile.js
├── package.json
└── README.md
```

## Prerequisites

- **Node.js 20+** recommended
- **npm**

Node 20 is consistent with the GitHub Actions workflow currently used for deployment.

## Installation

Install project dependencies:

```bash
npm install
```

## Available Build Flows

This repository does not define npm scripts in `package.json`, so the Gulp tasks are executed directly with `npx`.

### Run a production build

```bash
npx gulp build
```

or:

```bash
npx gulp dist
```

### Run in local development mode

```bash
npx gulp
```

This starts the default Gulp task, which:

- builds the project
- starts a local BrowserSync server on port `3000`
- watches source files for changes

Equivalent explicit command:

```bash
npx gulp dev
```

### Clean generated files

```bash
npx gulp clean
```

## Deployment

Deployment is automated through GitHub Actions using `.github/workflows/pages.yml`.

On every push to the `main` branch, the workflow:

1. checks out the repository
2. installs dependencies with `npm install`
3. builds the project with `npx gulp dist`
4. uploads the generated `dist/` folder
5. deploys it to **GitHub Pages**

## Hosting Assumptions

The project currently uses **root-relative URLs** such as:

- `/css/main.css`
- `/js/main.js`
- `/privacy-policy.html`
- `/contatti.html`

This means the site is intended to be served from the **domain root**, for example:

- `https://youremotionalsales.com/`

If you publish it under a subpath such as `https://username.github.io/repository-name/`, links and assets may break unless the templates are adapted.

## SEO / Metadata Notes

The shared head partial already includes:

- page title handling
- page description handling
- robots meta tag
- theme color
- canonical URL pattern
- favicon reference

The `gulp-file-include` context currently injects:

- `siteName: Your Emotional Sales (YES)`
- `domain: youremotionalsales.com`

## Suggested Maintenance Conventions

When updating the project, keep the following rules in mind:

- add new pages under `src/`
- reuse `src/partials/` instead of duplicating layout fragments
- keep static assets inside `src/`
- run a fresh build before publishing
- verify that root-relative URLs still match the hosting strategy
- keep legal content aligned with the actual YES privacy and cookie policies

## Notes for Future Evolution

This repository is a solid base for a lightweight corporate website. Depending on future needs, typical next steps could include:

- replacing the `mailto:` contact flow with a real backend endpoint
- adding environment-aware canonical and domain handling
- introducing npm scripts for a more standard developer experience
- adding image optimization and cache-busting
- integrating analytics / consent management if required
- adding multilingual support if the site needs both Italian and English content

## License

This repository appears to be a private project for YES. Add an explicit license only if redistribution terms need to be formalized.
