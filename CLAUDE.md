# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Pokédex web application built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS v4**. It consumes the [PokéAPI](https://pokeapi.co/docs/v2) (external REST API) to display Pokémon data, stats, evolution chains, and region maps.

## Commands

```bash
npm run dev        # Start dev server (Next.js dev mode)
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Run ESLint
```

No test framework is configured.

## Architecture

### Tech Stack
- **Framework**: Next.js 16 (App Router) with React Server Components
- **Styling**: Tailwind CSS v4 with `postcss.config.mjs`
- **State Management**: TanStack Query (`@tanstack/react-query`) for client-side data fetching
- **Charts**: Recharts for Pokémon stats visualization
- **Icons**: Heroicons
- **External API**: PokéAPI (`https://pokeapi.co/api/v2`) — no backend database

### Directory Structure

```
src/
├── api/pokemon.ts              # API layer: fetch functions + data transformation
├── data/maps.ts                # Static region map data (Kanto, Johto, Hoenn, Sinnoh, Unova)
├── types/                      # TypeScript interfaces
│   ├── pokemon.ts              # Pokémon, types, locations, evolution chain types
│   └── auth.ts                 # Auth-related types
├── utils/                      # Utility functions
│   ├── auth.ts                 # Cookie-based auth (demo users, no DB)
│   └── constants.ts            # Type colors, stat labels, pagination config
├── components/                 # React components
│   ├── stats/                  # PokemonStatsChart, PokemonStatsTable
│   ├── map/                    # RegionMap, LocationSidebar
│   └── (root)                  # PokemonGrid, PokemonCard, TypeFilter, Pagination, etc.
└── app/                        # Next.js App Router
    ├── layout.tsx              # Root layout (font, Providers, background)
    ├── providers.tsx           # TanStack Query client provider
    ├── (home)/                 # Route group: main Pokédex listing
    │   ├── layout.tsx          # Header + TypeFilter
    │   ├── page.tsx            # Home page with Suspense + searchParams
    │   └── containers/         # PokemonListContainer (server component)
    ├── (auth)/                 # Route group: authentication
    │   ├── layout.tsx          # Plain layout wrapper
    │   └── login/page.tsx      # Login form (client component)
    ├── pokemon/[id]/page.tsx   # Pokémon detail page (client component)
    ├── maps/page.tsx           # Region maps page (client component)
    └── api/auth/               # Auth API routes
        ├── login/route.ts      # POST: validate + set cookie
        └── logout/route.ts     # POST: clear cookie
```

### Key Patterns

**Server vs Client Components:**
- Route-level pages that do data fetching are **server components** (`(home)/page.tsx`, `PokemonListContainer`)
- Pages that need interactivity/hooks are **client components** (`pokemon/[id]/page.tsx`, `maps/page.tsx`, `login/page.tsx`)
- `useQuery` from TanStack Query is used in client components for interactive data fetching

**Data Fetching:**
- Server components use `fetch()` with `next: { revalidate: N }` for ISR caching
- Client components use `useQuery` from TanStack Query for caching + loading states
- All PokéAPI calls go through `src/api/pokemon.ts` — this is the single source of truth for external API calls

**Authentication:**
- Cookie-based session auth with demo users (hardcoded in `src/utils/auth.ts`)
- No database — sessions stored in encrypted cookies only
- Two demo accounts: `admin@pokemon.com`/`admin123` and `user@pokemon.com`/`user123`
- Auth routes are in `src/app/api/auth/`

**Routing:**
- Route groups `(home)` and `(auth)` separate layouts without URL path segments
- URL params: `?page=N&type=fire,water` for filtering/pagination on home
- Dynamic route: `/pokemon/[id]` for detail pages

**Type Colors & Constants:**
- All type-specific colors defined in `src/utils/constants.ts` (`TYPE_COLORS`, `TYPE_GRADIENTS`, `STAT_COLORS`)
- Reference these instead of hardcoding color values

### Important Notes
- The app has **no test suite** — verify changes manually by running the dev server
- TypeScript strict mode is enabled (`strict: true` in `tsconfig.json`)
- Path alias `@/*` maps to `./src/*`
- The `maps` page uses static SVG map data — city positions are hardcoded percentages in `src/data/maps.ts`
- Type filtering uses API intersection (fetches all Pokémon of each type, then intersects) — can be slow with multiple types
