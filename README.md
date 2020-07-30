# eleventy-plugin-i18n-gettext

[Eleventy](https://www.11ty.dev/) plugin which adds i18n with gettext and moment.js support.

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
  - [`i18n.relocalizePath(locale, pagePath)`](#i18nrelocalizePathlocale-pagePath)
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

You can download PO files editors, like [Poedit](https://poedit.net). Also, Poedit can be [configured](docs/Manage-translations-with-Poedit) to extract translation keys from source code.

- `messages.po` files store translations in plain text.
- `messages.mo` files are compiled from `messages.po`. _Poedit handle the creation of these files automatically, pushing them into your code repository is recommended_.

### Create xx.11tydata.js files

In these files we will enhance the [directory data object](https://www.11ty.dev/docs/data-template-dir/) passed to Eleventy templates thanks to [`i18n.enhance11tydata(obj, locale, dir?)`](#i18nenhance11tydataobj-locale-dir).

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

Name of the file where this plugin will store translation keys found in code source files.

### `tokenFilePatterns`
Type: `string[]` | Default: `['src/**/*.njk', 'src/**/*.js']`

Glob patterns used to know which code source files to search for translation keys.

It's relative to the Node process current working directory, usually the directory where is located `package.json` and from where `npm run` commands are executed.


## API

### `i18n.enhance11tydata(obj, locale, dir?)`
Returns: `any`

```
<html lang="{{ lang }}" dir="{{ langDir }}">
```

#### obj
Type: `any`

[Demo code source](https://github.com/sgissinger/eleventy-plugin-i18n-gettext-demo/blob/master/src/fr-fr/fr-fr.11tydata.js) has an example which uses a custom data object.

#### locale
Type: `string`

The locale as a simple language code (e.g. `en`) or language code with country code suffix (e.g. `en-us`).

#### dir
Type: `string` | Default: `ltr` | AllowedValues: `ltr`, `rtl`


### `i18n._(locale, key, ...args)`
Returns: `string`

#### locale
Type: `string`

The locale as a simple language code (e.g. `en`) or language code with country code suffix (e.g. `en-us`).


### `i18n._n(locale, singular, plural, count, ...args)`
Returns: `string`

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


### `i18n.relocalizePath(locale, pagePath)`
Returns: `string`

#### locale
Type: `string`

The locale as a simple language code (e.g. `en`) or language code with country code suffix (e.g. `en-us`).


## Sources

- [The Format of PO Files](https://www.gnu.org/software/gettext/manual/html_node/PO-Files.html)
- [Language-COUNTRY codes](http://www.lingoes.net/en/translator/langcode.htm)
- [ISO 639-1 Language codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)
- [ISO 3166-1 Country codes](https://en.wikipedia.org/wiki/ISO_3166-1)

## Credits

Inspired by adamduncan work on [eleventy-plugin-i18n](https://github.com/adamduncan/eleventy-plugin-i18n)