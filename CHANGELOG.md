# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
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
