# Copilot Instructions for structured-data

## Project Overview

This is a **VTEX IO app** that generates [JSON-LD structured data](https://schema.org/) for SEO purposes. It injects schema.org markup into VTEX storefront pages for products, breadcrumbs, search actions, and product lists.

## Architecture

### VTEX IO App Structure
- **`manifest.json`**: App configuration including dependencies (`vtex.render-runtime`, `vtex.apps-graphql`) and `settingsSchema` for admin-configurable options
- **`react/`**: React components that render JSON-LD `<script>` tags
- **`messages/`**: Internationalization files
- **`docs/`**: VTEX documentation

### Key Components

| Component | Purpose | Schema Type |
|-----------|---------|-------------|
| `Product.js` | Product page structured data | `Product`, `AggregateOffer` |
| `ProductList.tsx` | Product list/shelf structured data | `ItemList` |
| `ProductBreadcrumb.tsx` | Product page breadcrumb | `BreadcrumbList` |
| `SearchBreadcrumb.tsx` | Search/category page breadcrumb | `BreadcrumbList` |
| `SearchAction.tsx` | Site-wide search capability | `WebSite`, `SearchAction` |

### Data Flow
1. Components receive product/navigation data as props from VTEX runtime
2. `useAppSettings` hook fetches admin settings via GraphQL (`queries/getSettings.graphql`)
3. Pure functions (e.g., `parseToJsonLD`, `getProductBreadcrumb`) transform data to schema.org format
4. `react-schemaorg` library renders JSON-LD script tags

## Developer Workflow

### Commands
```bash
# Run tests (from root or react/)
yarn test

# Lint
yarn lint

# Format code
yarn format
```

### Testing Pattern
- Tests live in `react/__tests__/`
- Use `@vtex/test-tools` (wraps Jest + React Testing Library)
- Mock VTEX runtime with `react/__mocks__/vtex.render-runtime.js`
- Product fixtures in `react/__fixtures__/` - use `createProduct()` and `createItem()` helpers
- Export pure parsing functions (e.g., `parseToJsonLD`) for direct unit testing

### VTEX-Specific Patterns
- **Dual environment rendering**: `modules/baseUrl.tsx` handles SSR (`global.__hostname__`) vs client (`window.location`)
- **Settings via GraphQL**: App settings defined in `manifest.json#settingsSchema` are fetched via `publicSettingsForApp` query
- **VTEX dependencies**: Use `http://vtex.vtexassets.com/_v/public/typings/...` URLs for VTEX package types in `devDependencies`

## Code Conventions

### Pricing Logic
- Always handle `spotPrice` (discounted) vs `Price` (list price)
- Tax calculations use `pricesWithTax` setting: `price + getTax(value)`
- Unavailable products (quantity=0, price=0) return `null` offers to avoid showing as "free"

### Schema.org Compliance
- GTIN values must be 8, 12, 13, or 14 digits (see `formatGTIN()` in `Product.js`)
- Availability uses `http://schema.org/InStock` or `http://schema.org/OutOfStock`
- Product `@id` must be the canonical product URL: `${baseUrl}/${linkText}/p`

### TypeScript
- Use TypeScript for new components (`.tsx`)
- `Product.js` is legacy JavaScript with `Product.d.ts` type declarations
- Types from `schema-dts` package for schema.org types
