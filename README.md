# eleventy-plugin-i18n-gettext

[Eleventy](https://www.11ty.dev/) plugin which adds i18n support with Gettext string translation and moment.js date and times localization.

Gettext is commonly used in Linux C and WordPress worlds. It comes with a few handy features:
- Can extract translation keys from source code. _[Poedit configuration for translations extraction](docs/Manage-translations-with-Poedit.md)_.
- Supports pluralization.
- Translation keys are their own translation fallback value. It means that if you don't have a translation file or didn't translate some keys, the value of the key itself is used as the translated value.
- PO files editors exists, like [Poedit](https://poedit.net).

In addition to Gettext features, this plugin:
- Integrates [`printf()`](https://www.npmjs.com/package/printf) for enhanced string formatting capabilities
- Integrates [`moment.js`](https://momentjs.com) for date and time localization


## Table of content
- [Install](#install)
- [Demo](#demo)
- [Get Started](#get-started)
  - [Define language site directories](#define-language-site-directories)
  - [Create messages.po files](#create-messagespo-files)
  - [Create xx.11tydata.js files](#create-xx11tydatajs-files)
- [Configuration](#configuration)
  - [`localesDirectory`](#localesDirectory)
  - [`parserMode`](#parserMode)
  - [`javascriptMessages`](#javascriptMessages)
  - [`tokenFilePatterns`](#tokenFilePatterns)
- [API](#api)
  - [`i18n.enhance11tydata(obj, locale, dir?)`](#i18nenhance11tydataobj-locale-dir)
  - [`i18n._(locale, key, ...args)`](#i18n_locale-key-args)
  - [`i18n._n(locale, singular, plural, count, ...args)`](#i18n_nlocale-singular-plural-count-args)
  - [`i18n._d(locale, format, date)`](#i18n_dlocale-format-date)
  - [`i18n._p(locale, basePath)`](#i18n_plocale-basePath)
- [API Usage](#api-usage)
  - [In templates](#in-templates)
  - [In filters, shortcodes](#in-filters-shortcodes)
- [Shortcode](#shortcode)
  - [`relocalizePath targetedLocale, pagePath`](#relocalizePath-targetedLocale-pagePath)
- [Sources](#sources)
- [Credits](#credits)

## Install

Available on [npm](https://www.npmjs.com/package/eleventy-plugin-i18n-gettext).

```
npm install eleventy-plugin-i18n-gettext --save
```

## Demo

- [Demo site](https://eleventy-plugin-i18n-gettext.gissinger.net)
- [Source](https://github.com/sgissinger/eleventy-plugin-i18n-gettext-demo)


## Get Started

### Define language site directories

Create directories at the site root you can use either a simple language code (e.g. `en`) or language code with country code suffix (e.g. `en-us`).

Locale folder casing must be exactly the same in `locales` and `src`. In this example I choose lowercase in order to stick to Eleventy slugification configuration.

```
├─ locales
   └─ fr-fr
       ├─ messages.mo
       └─ messages.po
   └─ pt
       ├─ messages.mo
       └─ messages.po
├─ src
   └─ fr-fr
       └─ fr-fr.11tydata.js
   └─ pt
       └─ pt.11tydata.js
   └─ en
       └─ en.11tydata.js
```

### Create messages.po files

The simpliest manner to create `messages.po` files, is to copy them from the [demo code source](https://github.com/sgissinger/eleventy-plugin-i18n-gettext-demo/tree/master/locales).

- `messages.po` files store translations in plain text.
- `messages.mo` files are compiled from `messages.po`. _Poedit handle the creation of these files automatically, pushing them into your code repository is recommended_.

### Create xx.11tydata.js files

In these files we enhance the Eleventy [directory data object](https://www.11ty.dev/docs/data-template-dir/) with [`i18n.enhance11tydata(obj, locale, dir?)`](#i18nenhance11tydataobj-locale-dir).

```js
// xx.11tydata.js
const i18n = require('eleventy-plugin-i18n-gettext')

module.exports = () => {
    return i18n.enhance11tydata({}, __dirname)
}
```


## Configuration

Open up your Eleventy config file (probably `.eleventy.js`), import the plugin and use `addPlugin`.

```js
// .eleventy.js
const i18n = require('eleventy-plugin-i18n-gettext')

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(i18n, {
    localesDirectory: 'locales',
    parserMode: 'po',
    javascriptMessages: 'messages.js',
    tokenFilePatterns: [
      'src/**/*.njk',
      'src/**/*.js'
    ]
  })
}
```

On activation, the plugin:
- load custom options
- attaches to `beforeBuild` and `beforeWatch` [Eleventy events](https://www.11ty.dev/docs/events)

When `beforeBuild` and `beforeWatch` events are raised, the plugin:
- browses every folders of the `localesDirectory`
- loads/reloads translations from `messages.po` files (or `messages.mo`)
- finds files depending on `tokenFilePatterns`
- searches in these files for translations keys
- creates or update the `javascriptMessages` file with these translation keys


### `localesDirectory`
Type: `string` | Default: `locales`

Name of the directory where `messages.po`, `messages.mo` and `messages.js` files are located.

It's relative to the Node process current working directory, usually the directory where is located `package.json` and from where `npm run` commands are executed.

### `parserMode`
Type: `string` | Default: `po` | AllowedValues: `po`, `mo`

By default, `gettext-parser` is configured to parse `messages.po` text files. For large translations it may be more efficient to parse `messages.mo` binary files.

### `javascriptMessages`
Type: `string` | Default: `messages.js`

Name of the file where this plugin stores translation keys found in code source files.

### `tokenFilePatterns`
Type: `string[]` | Default: `['src/**/*.njk', 'src/**/*.js']`

Glob patterns used to know which code source files to search for translation keys.

It's relative to the Node process current working directory, usually the directory where is located `package.json` and from where `npm run` commands are executed.


## API

### `i18n.enhance11tydata(obj, locale, dir?)`
Returns: `object`

Attaches additional properties and methods to `obj` and returns it:

| Type     | Name
|-|-|
| Property | `lang`
| Property | `langDir`
| Property | `locale`
| Method   | `_(key, ...args)`
| Method   | `_n(singular, plural, count, ...args)`
| Method   | `_d(format, date)`
| Method   | `_p(basePath)`

`lang` and `langDir` properties are meant to be used in the `<html>` tag.

`locale` property is meant to be used in custom filters and shortcodes.


In the context of template, `locale` parameter is not needed because it's set by [`i18n.enhance11tydata(obj, locale, dir?)`](#i18nenhance11tydataobj-locale-dir) in [`xx.11tydata.js`](#create-xx11tydatajs-files) data directory files.

#### obj
Type: `object`

Contains the custom data you want to use in your templates.

#### locale
Type: `string`

The locale as a simple language code (e.g. `en`) or language code with country code suffix (e.g. `en-us`).

#### dir
Type: `string` | Default: `ltr` | AllowedValues: `ltr`, `rtl`

The locale direction, left-to-right or right-to-left.


### `i18n._(locale, key, ...args)`
Returns: `string`

Retrieve a gettext translated string then apply [`printf()`](https://www.npmjs.com/package/printf) on it.


#### locale
Type: `string`

The locale as a simple language code (e.g. `en`) or language code with country code suffix (e.g. `en-us`).

#### key
Type: `string`

The Gettext translation key to translate.

#### args
Type: `string[]`

Arguments sent to [`printf()`](https://www.npmjs.com/package/printf).


### `i18n._n(locale, singular, plural, count, ...args)`
Returns: `string`

Retrieve a gettext translated string then apply [`printf()`](https://www.npmjs.com/package/printf) on it.

#### locale
Type: `string`

The locale as a simple language code (e.g. `en`) or language code with country code suffix (e.g. `en-us`).


### `i18n._d(locale, format, date)`
Returns: `string`

#### locale
Type: `string`

The locale as a simple language code (e.g. `en`) or language code with country code suffix (e.g. `en-us`).


### `i18n._p(locale, basePath)`
Returns: `string`

#### locale
Type: `string`

The locale as a simple language code (e.g. `en`) or language code with country code suffix (e.g. `en-us`).

## API Usage

### In templates

In templates context, `locale` parameter is not needed because it's set by [`i18n.enhance11tydata(obj, locale, dir?)`](#i18nenhance11tydataobj-locale-dir) in [`xx.11tydata.js`](#create-xx11tydatajs-files) data directory files.

```html
<!-- index.njk -->
<html lang="{{ lang }}" dir="{{ langDir }}">
  <body>
    <div>{{ _('I like Gettext') }}</div>
    <div>{{ _('%s and I like Gettext as much as %s', 'Bob', 'John') }}</div>
    <div>{{ _n('I like Gettext', 'They like Gettext', peopleCount) }}</div>
    <div>{{ _n('I like Gettext as much as %s', 'They like Gettext as much as %s', peopleCount, 'John') }}</div>
    <div>{{ _d('LL', page.date) }}</div>
    <div>{{ _p('/') | url }}</div>
  </body>
</html>
```

### In filters, shortcodes

In filters and shortcodes context, `locale` parameter has to be passed as a parameter.

```javascript
// .eleventy.js
const i18n = require('eleventy-plugin-i18n-gettext')

module.exports = eleventyConfig => {
  eleventyConfig.addShortcode("custom_shortcode", (locale, fruit) => {
    return i18n._(locale, fruit.name)
  })
  ...
}
```

When [`i18n.enhance11tydata(obj, locale, dir?)`](#i18nenhance11tydataobj-locale-dir) is used in [`xx.11tydata.js`](#create-xx11tydatajs-files) data directory files, it adds a property named `locale` which can be used in templates and passed to filters and shortcodes.

```html
<!-- index.njk -->
<div>{%- custom_shortcode locale, fruit -%}</div>
```

## Shortcode

### `relocalizePath targetedLocale, pagePath`
Returns: `string`

The intent of this shortcode is to construct language selectors. It replaces the locale part of the current url with the targeted locale.

```json
// _data/locales.json
[
    { "path": "fr-fr", "name": "Français"   },
    { "path": "nl-nl", "name": "Nederlands" },
    { "path": "pt-pt", "name": "Português"  },
    { "path": "en-us", "name": "English"    },
    { "path": "ar",    "name": "عربى"       }
]
```

```html
<!-- _includes/layout.njk -->
{%- for locale in locales -%}
  <a href="{%- relocalizePath locale.path, page.url -%}">{{ locale.name }}</a>
{%- endfor -%}
```

#### targetedLocale
Type: `string`

The target locale as a simple language code (e.g. `en`) or language code with country code suffix (e.g. `en-us`).

#### pagePath
Type: `string`

The path on which the current locale will be replaced with `targetedLocale`.


## Sources

- [The Format of PO Files](https://www.gnu.org/software/gettext/manual/html_node/PO-Files.html)
- [Language-COUNTRY codes](http://www.lingoes.net/en/translator/langcode.htm)
- [ISO 639-1 Language codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)
- [ISO 3166-1 Country codes](https://en.wikipedia.org/wiki/ISO_3166-1)


## Credits

Inspired by adamduncan work on [eleventy-plugin-i18n](https://github.com/adamduncan/eleventy-plugin-i18n)