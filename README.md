# eleventy-plugin-i18n-gettext

[Eleventy](https://www.11ty.dev/) plugin which adds i18n with gettext and moment.js support.

- [Install](#install)
- [Demo](#demo)
- [Configuration](#configuration)
  - [Define language site directories](#define-language-site-directories)
  - [Create messages.po files](#create-messagespo-files)
  - [Create xx.11tydata.js files](#create-xx11tydatajs-files)
- [API](#api)
  - [`i18n.enhance11tydata(obj, locale, dir?)`](#i18nenhance11tydataobj-locale-dir)
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


## Configuration

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

In these files we will enhance the [directory data object](https://www.11ty.dev/docs/data-template-dir/) passed to Eleventy templates.

```
const i18n = require('eleventy-plugin-i18n-gettext')

module.exports = () => {
    return i18n.enhance11tydata({}, __dirname)
}
```


## Eleventy configuration

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
- loads/reloads translations from `PO` or `MO` files
- finds files depending on `tokenFilePatterns`
- searches in these files for translations keys
- creates the `javascriptMessages` file


### `localesDirectory`
Type: `string` | Default: `locales`

Name of the directory where `PO`, `MO` and `messages.js` files are located.

It's relative to the Node process current working directory, usually the directory where is located `package.json` and from where `npm run` commands are executed.

### `parserMode`
Type: `string` | Default: `po` | AllowedValues: `po`, `mo`

By default, `gettext-parser` is configured to parse `PO` text files. For large translations it may be more efficient to parse `MO` binary files.

### `javascriptMessages`
Type: `string` | Default: `messages.js`

Name of the file where this plugin will store translation keys found in code source files.

### `tokenFilePatterns`
Type: `string[]` | Default: `['src/**/*.njk', 'src/**/*.js']`

Glob patterns used to know which files to search for translation keys.

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

#### dir
Type: `string` | Default: `ltr` | AllowedValues: `ltr`, `rtl`


## Sources

- [The Format of PO Files](https://www.gnu.org/software/gettext/manual/html_node/PO-Files.html)
- [Language-COUNTRY codes](http://www.lingoes.net/en/translator/langcode.htm)
- [ISO 639-1 Language codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)
- [ISO 3166-1 Country codes](https://en.wikipedia.org/wiki/ISO_3166-1)

## Credits

Inspired by adamduncan work on [eleventy-plugin-i18n](https://github.com/adamduncan/eleventy-plugin-i18n)