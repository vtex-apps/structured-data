# Structured Data
<!-- DOCS-IGNORE:start -->
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
<!-- DOCS-IGNORE:end -->

> Implements Structured Data schemas.

This app renders [JSON-LD](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data) for the Product Details Page (`Product`, `BreadcrumbList`), product lists (`ItemList`), search pages (`BreadcrumbList`) and the store's search box (`WebSite` with `SearchAction`). It is a dependency of `vtex.store`, so it runs in every Store Framework store.

## Configuration

The settings are only editable when the app is installed in the account. If it is only a dependency of `vtex.store`, install it first:

```sh
vtex install vtex.structured-data@0.x
```

Then open **Apps > My apps > Structured Data** in the Admin, or use `vtex settings set vtex.structured-data <setting> <value>`.

| Setting | Type | Default | Description |
| --- | --- | --- | --- |
| `disableProductStructuredData` | `boolean` | `false` | Removes the `Product` JSON-LD from the PDP. |
| `disableOffers` | `boolean` | `false` | Publishes the `Product` without `offers`. The `Product` is kept even when the product is unavailable. |
| `decimals` | `number` | `2` | Number of decimals used to round prices, with or without taxes. `0` is allowed. |
| `pricesWithTax` | `boolean` | `false` | Adds the SKU `Tax` to the published prices. Use it in countries where the price shown to shoppers includes taxes. |
| `useSellerDefault` | `boolean` | `false` | Uses the default seller's offer for each SKU. If a SKU has no default seller, the cheapest seller is used. |
| `useImagesArray` | `boolean` | `false` | Publishes all SKU images in `image` instead of only the first one. |
| `disableAggregateOffer` | `boolean` | `false` | Publishes a list of `Offer` instead of an `AggregateOffer`. |
| `gtinValue` | `ean` \| `itemId` | `ean` | SKU field used as the product GTIN. See below. |

All settings also apply to the `ItemList` rendered on product lists.

### GTIN and SKU

- `gtin` is only published when the value is a valid GTIN-8, 12, 13 or 14, including the GS1 check digit. Shorter values are left-padded with zeros only when the padded value is still a valid GTIN (for example, an 11-digit UPC).
- With `gtinValue: ean` (default), the SKU EAN registered in the catalog is used. If the EAN is missing or invalid, `gtin` is omitted.
- With `gtinValue: itemId`, the SKU ID is only published as `gtin` if it happens to be a valid GTIN. Internal SKU IDs are not padded into fake GTINs.
- `sku` (in `Product` and in each `Offer`) is the published GTIN when there is one, and the SKU ID otherwise.

<!-- DOCS-IGNORE:start -->
## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/MatheusR42"><img src="https://avatars0.githubusercontent.com/u/16908590?v=4" width="100px;" alt=""/><br /><sub><b>Matheus Araujo</b></sub></a><br /><a href="https://github.com/vtex-apps/structured-data/commits?author=MatheusR42" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind are welcome!
<!-- DOCS-IGNORE:end -->