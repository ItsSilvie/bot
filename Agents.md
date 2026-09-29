# Silvie bot and data pipeline

This TypeScript/Node.js repository contains the `@Silvie` Discord bot plus the data pipeline shared by the other Silvie repositories. `src/api-scrape.ts` downloads Grand Archive API options, sets, cards, and card images. Generator scripts then produce data for the deck builder, collection tracker, blog, stocklists, and related tools.

## Important paths

- `src/api-data/` is the local API-data snapshot used by commands and generators.
- `src/blog/` generates blog card-list includes and missing set pages/index rows in the sibling `blog.silvie.org` checkout.
- `src/collection-tracker/` generates CDN tracker JSON/types and set metadata.
- `src/deck-builder/` generates deck-builder data for the monorepo.
- `src/api-scrape.ts` also downloads API card images and featured-set logos into sibling `img.silvie.org`.

Run commands from this directory. The normal sequence is `yarn scrape` (after compiling), followed by `yarn parse` or the narrower generator command needed. `yarn build-local` compiles TypeScript and copies API data. Relative paths in generators intentionally assume the current directory is `bot`; do not run compiled generators from another working directory without checking their path assumptions.

Set metadata has explicit overrides for known exceptions. The API's release date, featured-set membership, and logo image are used for safe fallbacks; gameplay classifications should remain explicit when the API does not establish them.
