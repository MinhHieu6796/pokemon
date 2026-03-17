# 🔴 Pokédex — Next.js

A modern Pokédex web application built with **Next.js 15+**, **TypeScript**, and **Tailwind CSS**. Browse all Pokémon, filter by multiple types, and navigate through pages — all powered by the [PokéAPI](https://pokeapi.co/).

![Next.js](https://img.shields.io/badge/Next.js-15+-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)

---

## ✨ Features

- **Pokémon List** — Displays 20 Pokémon per page with official artwork, names, type badges, and base stat bars.
- **Multi-Type Filtering** — Filter Pokémon by any combination of types. The app finds the intersection (Pokémon that have ALL selected types).
- **Pagination** — Smart pagination with ellipsis for large page ranges and a total items count.

---

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Install & Run

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at **http://localhost:3000**.

### Build for Production

```bash
# Check package.json for specific deployment scripts if needed
npm run build
npm start
```

## 🧰 Tech Stack

- **[Next.js 15+](https://nextjs.org/)** — App Router & React Server Components
- **[TypeScript](https://www.typescriptlang.org/)** — Strict typing
- **[Tailwind CSS 4](https://tailwindcss.com/)** — Modern utility-first styling
- **[PokéAPI](https://pokeapi.co/)** — Pokémon data source
