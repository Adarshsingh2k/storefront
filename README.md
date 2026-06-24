## Setup

```bash
git clone <repo-url>
cd storefront
npm install
npm run dev      # http://localhost:5173
npm run build    # TypeScript check + Vite build
npm run preview  # preview the production build locally
```

---

## Features

| Feature | Detail |
|---|---|
| Product listing | Responsive grid from Fake Store API with category filter + sort |
| Product detail | Two-column layout, image gallery with 3 views, variant selector |
| Variants | Colour swatches + size buttons with in-stock / low-stock / sold-out states |
| Quick Add | On product card hover — adds first available variant to cart |
| Cart drawer | Slides in from right, persists across refreshes (localStorage) |
| Deep-linking | `/product/:id?color=Midnight&size=M` — variant state in URL |
| Loading states | Skeleton cards|
| Responsive | true|

---

## Project structure

```
src/
  components/        Reusable UI (Navbar, ProductCard, CartDrawer, CartItem, VariantSelector, QuantityPicker, Skeleton)
  pages/             Home, ProductDetail
  stores/            CartContext.tsx — cart state with Context API
  hooks/             useProducts.ts, useProduct.ts
  data/              mockVariants.ts — variant generator
  styles/            _mixins.scss, global.scss
  utils/             index.ts — toINR, getSelectedColor, getSelectedSize
  types/             index.ts
```

---

## Design decisions

See **DECISIONS.md** for the full writeup.

- Context API for cart state — shared across components without prop drilling
- Custom fetch hooks so API calls are reusable and components stay clean
- CSS variables in global.scss for colors and fonts — one place to change, reflects everywhere
- Mock variants generated from product id so they stay consistent across renders
- Cart persisted to localStorage — survives page refresh
- Selected color and size stored in URL params — survives refresh and is shareable

---

## Known trade-offs

- No retry on API failure — shows error immediately if fetch fails
- Cart in two tabs are not synced
---

