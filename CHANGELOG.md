# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

⚠️: Was not SemVer up to version 1.1.3, but is being SemVer from version 1.2.0.

## [1.3.2] - 2020-08-03
### Fixed
- Shortcodes and javascript are now parsed correctly to create messages.js file

## [1.3.1] - 2020-08-02
### Fixed
- Bugfix when using custom localeRegex

## [1.3.0] - 2020-08-02
### Added
- Timezone support parameter for dates
### Changed
- Locale parsing handled in a single method
### Fixed
- Potential bugfix when using custom localeRegex

## [1.2.0] - 2020-08-02
### Added
- Unit tests
- Integration tests
### Removed
- Doc folder from npm package
### Fixed
- Handle pathPrefix more consistently
- Exceptions are thrown explicitly instead of log error messages

## [1.1.3] - 2020-07-31
### Added
- String interpolation support
- Shortcodes for localization methods

## [1.1.2] - 2020-07-31
### Fixed
- pathPrefix supported

## [1.1.1] - 2020-07-31
### Added
- localeRegex configuration parameter

## [1.1.0] - 2020-07-30
### Added
- RelocalizePath as shortcode
### Removed
- RelocalizePath as function in 11tydata

## [1.0.0] – 2020-07-27
### Added
- First release