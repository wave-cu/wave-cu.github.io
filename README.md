# Bioinformatic Fridays Docs

This repository contains the Bioinformatic Fridays training documentation website, organized as module-based lessons and published on GitHub Pages.

Site URL: `https://wave-cu.github.io`

## 🚀 Project Structure

Inside this project, you’ll see the following folders and files:

```
.
├── public/
├── src/
│   ├── assets/
│   ├── content/
│   │   └── docs/
│   └── content.config.ts
├── .github/
│   └── workflows/
│       └── deploy.yml
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

Content pages live in `src/content/docs/` and are mapped to routes by file path.

Images can be added to `src/assets/` and embedded in Markdown with a relative link.

Static assets, like favicons, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Deployment

GitHub Pages deployment is automated with GitHub Actions using `.github/workflows/deploy.yml`.
Pushes to `main` trigger a build and deploy.

## Credits

This documentation site is built with [Astro](https://astro.build/).
