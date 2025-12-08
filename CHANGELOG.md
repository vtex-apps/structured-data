# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- Fixed formatting for the gtinValue coming back from getAppSettings, if this value is itemId it should not format

## [0.16.0] - 2025-07-18

## [0.15.0] - 2025-04-28

### Added
- Add new setting in app settings
- Use this new setting value in Product JS

## [0.14.0] - 2025-03-11

- Creation of new appSettings (false by default) `useImagesArray` - used to consider an array of images for the product, instead using only the first one

## [0.13.1] - 2025-03-06

### Added

- (CI) Add permissions for Danger to comment on PRs

## [0.13.0] - 2025-02-19

### Added

- Creation of a new appSettings (false by default) disableAggregateOffer - used to change the aggregateOffer in Offer

## [0.12.3] - 2025-02-18

### Changed

- Updated GitHub Actions configuration to use `actions/cache@v4` to avoid issues with deprecated versions (`v1` and `v2`), which will be retired on March 1st, 2025.

## [0.12.2] - 2024-10-16

### Changed

- **Product Schema** for **Reference Number**, `mpn` now uses item reference identification.

### Added

- `GTIN` when `EAN` is available

## [0.12.1] - 2024-06-17

### Fixed

- Fixed breadcrumb structured data issue in PLP where this field is missing `itemsListElement`.

## [0.12.0] - 2023-05-10

### Added

- Adds `useSellerDefault` to the app settings

## [0.11.0] - 2023-04-17

### Added

- Add new `settingsSchema` option `disableOffers` to fill `offers` as null when enabled

## [0.10.0] - 2023-02-15

### Changed

- Uses `publicSettingsForApp` endpoint to retrieve app settings

## [0.9.2] - 2023-01-13

### Changed

- Use `getAppSettings` to retrieve app settings

## [0.9.1] - 2022-07-08

### Fixed

- Handle `null` seller in `parseSKUToOffer()`

## [0.9.0] - 2022-07-08

### Changed

- Add full details of each product in `ProductList` component
- Fall back to `product.description` if `product.metaTagDescription` is not present

## [0.8.1] - 2022-01-11

### Changed

- Use product's URI as @id on `Product` schema.

## [0.8.0] - 2022-01-04

### Added

- Added search parameter `?map=ft` to SearchAction's `potentialAction`

## [0.7.3] - 2022-01-03

### Fixed

- brand type

## [0.7.2] - 2021-12-21

### Fixed

- brand typo

## [0.7.1] - 2021-10-18

### Fixed

- add the /p parameter to the productList structured data URL

## [0.7.0] - 2021-08-05

### Added

- `settingsSchema` to allow stores to send `pricesWithTax` and specify the number of `decimals`

## [0.6.2] - 2021-03-11

### Added

- `@id` property to Product structured data so that multiple tags for the same product can be consolidated

## [0.6.1] - 2020-12-18

### Fixed

- Remove `dangerouslySetInnerHTML`.

## [0.6.0] - 2020-10-22

### Added

- `ProductList` component to render a product list structured data.

## [0.5.0] - 2020-08-04

### Added

- `ProductBreadcrumb` component to render a product's breadcrumb structured data.
- `SearchBreadcrumb` component to render a search's breadcrumb structured data.

## [0.4.0] - 2020-07-01

### Added

- Use spot price as lowPrice.

## [0.3.2] - 2020-03-06

### Fixed

- Product Structured Data being duplicated.

## [0.3.1] - 2020-03-06

### Fixed

- Wrap Product's structured data into `react-helmet`.

## [0.3.0] - 2020-02-28

### Changed

- Use prop `searchTermPath` to set the path of SearchAction.

## [0.2.1] - 2019-12-27

### Fixed

- Use docs builder.

## [0.2.0] - 2019-10-22

### Added

- Move code of Product Structured Data from `vtex.store` to this app.

### Fixed

- Remove markup if the product is unavailable. We used to fill the price with zero, providing Google the wrong information.

## [0.1.2] - 2019-09-05

### Fixed

- Fix url format, add `:` after the protocol.

## [0.1.1] - 2019-09-02

### Fixed

- URLs with rootPath.

## [0.1.0] - 2019-09-02

### Changed

- Name of the component to `SearchAction` to be more generic.

### Fixed

- `potentialAction.target`.
- Protocol in SSR.
- Minify JSON.

## [0.0.2] - 2019-08-30

### Added

- Add Component With Google Search Box Script.
