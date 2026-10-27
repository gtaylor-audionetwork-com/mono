# mono

A pnpm + Turborepo monorepo for a Next.js (App Router) site. One host app owns routing and mounts
the shared shell once. Feature pages live in domain packages, which can also run on their own inside
a small dev harness that wraps them in the real shell.

## Getting started

Requires Node 20+ and pnpm 9 (`corepack enable` will pick up the version in `package.json`).

```bash
pnpm install
pnpm dev                          # host on http://localhost:9000
pnpm --filter @web/home dev       # home page in its harness on :3001
pnpm --filter @web/album dev      # album page in its harness on :3002
pnpm build | pnpm lint | pnpm typecheck
pnpm cypress:open                 # E2E in Cypress (host must be on :9000)
pnpm cypress:run                  # headless E2E against a running host
pnpm e2e:ci                       # build, start host, run Cypress
pnpm e2e:affected                 # list Cypress specs for this branch vs main
pnpm e2e:affected:run             # run only those specs (host must be on :9000)
```

Routes: `/` (home), `/albums`, `/album/[id]`, and `/projects/[id]`.

### End-to-end tests

Cypress **runs from** `apps/host` (port 9000) but **specs live next to the code they cover**:

- `packages/domains/*/e2e/` — domain flows
- `packages/shell/e2e/` — navigation, modals, player
- `tooling/cypress/` — page objects, support, and the affected-spec selector

GitHub Actions (`.github/workflows/ci.yml`) runs lint/typecheck on every PR, then **only the Cypress
specs mapped from changed paths** — not the full suite. Locally:

```bash
pnpm e2e:affected                 # e.g. packages/domains/home/ → home + navigation
pnpm dev                          # terminal 1
pnpm e2e:affected:run             # terminal 2
pnpm cypress:run                  # full suite
```

Catalogue specs need `MUSIC_API_URL` and `MUSIC_API_KEY` (local: `apps/host/.env.local`; CI: repo
secrets with the same names). Project and featured-track specs use in-memory Zustand state only.

## Layout

```
apps/host                    Next.js app, the only deployable. Routes re-export domain pages.
packages/domains/home        HomePage + dev/ harness
packages/domains/album       AlbumPage + dev/ harness
packages/domains/projects    ProjectPage + dev/ harness
packages/shell               AppShell: providers, Layout, ModalHost (mounted once)
packages/composites/track-list  TrackList, TrackRow
packages/actions             DownloadOptionsButton, DownloadOptionsModal
packages/data                Track type, ModalProvider, TanStack Query hooks
packages/api/download        Download API client (plain fetch, no React)
packages/foundations/ui      Button, RadioGroup, Card, design tokens (styles.css)
tooling/tsconfig             Shared TypeScript presets
tooling/eslint-config        Shared ESLint config, including the layer rules
tooling/cypress              Shared Cypress page objects, support, affected-spec pipeline
```

## Layer rules

Each layer may import only from the layers listed. `pnpm lint` fails on a violation.

| From | May import |
| --- | --- |
| host | shell, domains |
| dev harness | shell, its own domain |
| domains | composites, actions, data, ui |
| shell | actions, data, ui |
| composites | actions, data, ui |
| actions | data, ui |
| data | api |
| api | nothing in the workspace; no React or Next.js |
| ui | nothing in the workspace |

Domain packages never import the shell. The `DownloadOptionsModal` is rendered only by the shell's
`ModalHost`. Buttons open it through `useDownloadOptionsModal().open(track)`, so a long track list
never mounts more than one modal.

React, Next.js and `@tanstack/react-query` are peer dependencies of the library packages, so only
the host's (or harness's) single copy runs. Library packages are consumed as TypeScript source via
`transpilePackages`; they have no build step.

## Placeholders to replace

- **Download API.** `packages/api/download/src/client.ts` uses invented endpoints
  (`GET /tracks/:id/download-options`, `POST /downloads`). With `NEXT_PUBLIC_DOWNLOAD_API_URL`
  unset, it returns stub data. See `apps/host/.env.example`.
- **Track and album data.** Hardcoded in each domain package (`sampleTracks.ts`, `sampleAlbums.ts`)
  until a Music API is in scope.
- **Package scope** `@web/*` and the brand name in `packages/shell/src/layout/Layout.tsx`.

E2E: Cypress in `apps/host`. Unit tests are not included yet.
