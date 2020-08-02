'use strict'

const fs = require('fs')
const path = require('path')
const glob = require('glob')
const Gettext = require('node-gettext')
const parser = require('gettext-parser')
const printf = require('printf')
const moment = require('moment')
const dynamic_interpolation = require('./i18n-dynamic-interpolation')

module.exports.defaultConfiguration = {
    localesDirectory: 'locales',
    parserMode: 'po',
    javascriptMessages: 'messages.js',
    tokenFilePatterns: [
        'src/**/*.njk',
        'src/**/*.js'
    ],
    localeRegex: /^(?<lang>.{2})(?:-(?<country>.{2}))*$/
}
module.exports.configuration = undefined
module.exports.gettext = undefined
module.exports.pathPrefix = undefined

module.exports.init = (options = {}) => {
    this.configuration = Object.assign(this.defaultConfiguration, options)

    if( !['po', 'mo'].includes(this.configuration.parserMode) ) {
        throw `Parser mode '${this.configuration.parserMode}' is invalid. It must be 'po' or 'mo'.`
    }
}

module.exports.normalizePath = path => {
    if( this.pathPrefix === undefined ) {
        // Works when pathPrefix is configured in .eleventy.js file
        // Does not work when pathPrefix is given with commandline `--pathprefix=eleventy-base-blog`
        const projectConfig = require('@11ty/eleventy/src/Config').getConfig()
        this.pathPrefix = projectConfig.pathPrefix
    }

    if( this.pathPrefix !== '/' ) {
        return path.replace(this.pathPrefix, '/')
    }
    return path
}

module.exports.getStandardLocale = locale => {
    const match = locale.match(this.configuration.localeRegex)

    if ( !match ) {
        throw `Locale ${locale} does not match regex ${this.configuration.localeRegex}`
    }

    if( match.groups.country ) {
        return `${match.groups.lang}-${match.groups.country}`
    }

    return match.groups.lang
}

module.exports.setLocale = locale => {
    const standardLocale = this.getStandardLocale(locale)

    if( this.gettext ) {
        this.gettext.setLocale(standardLocale)
    }
    moment.locale(standardLocale)
}

module.exports.translate = (locale, key) => {
    this.loadTranslations()
    this.setLocale(locale)

    return this.gettext.gettext(key)
}

module.exports.ntranslate = (locale, singular, plural, count) => {
    this.loadTranslations()
    this.setLocale(locale)

    return this.gettext.ngettext(singular, plural, count)
}

module.exports._ = (locale, key, ...args) => {
    const translation = this.translate(locale, key)

    if( args.length ) {
        return printf(translation, ...args)
    }
    return translation
}

module.exports._i = (locale, key, obj) => {
    const translation = this.translate(locale, key)

    if( obj ) {
        return dynamic_interpolation(translation, obj)
    }
    return translation
}

module.exports._n = (locale, singular, plural, count, ...args) => {
    const translation = this.ntranslate(locale, singular, plural, count)

    if( args.length ) {
        return printf(translation, ...args)
    }
    return translation
}

module.exports._ni = (locale, singular, plural, count, obj) => {
    const translation = this.ntranslate(locale, singular, plural, count)

    if( obj ) {
        return dynamic_interpolation(translation, obj)
    }
    return translation
}

module.exports._d = (locale, format, date) => {
    this.setLocale(locale)

    return moment(date).format(format)
}

module.exports._p = (locale, basePath) => {
    const path = this.normalizePath(basePath)

    return `/${locale}${path}`
}

module.exports.relocalizePath = (targetedLocale, pagePath) => {
    const path = this.normalizePath(pagePath)

    const pathParts = path.split('/').filter(pathPart => pathPart !== '')
    pathParts[0] = targetedLocale

    return `/${pathParts.join('/')}`
}

module.exports.enhance11tydata = (obj, locale, dir = 'ltr') => {
    if ( fs.existsSync(locale) ) {
        locale = path.basename(locale)
    }

    if( !['ltr', 'rtl'].includes(dir) ) {
        throw `Language direction '${dir}' is invalid. It must be 'ltr' or 'rtl'.`
    }

    const match = locale.match(this.configuration.localeRegex)

    obj.lang = match.groups.lang
    obj.langDir = dir
    obj.locale = locale
    obj._ = (key, ...args) => {
        return this._(locale, key, ...args)
    }
    obj._i = (key, obj) => {
        return this._i(locale, key, obj)
    }
    obj._n = (singular, plural, count, ...args) => {
        return this._n(locale, singular, plural, count, ...args)
    }
    obj._ni = (singular, plural, count, obj) => {
        return this._ni(locale, singular, plural, count, obj)
    }
    obj._d = (format, date) => {
        return this._d(locale, format, date)
    }
    obj._p = (basePath) => {
        return this._p(locale, basePath)
    }

    return obj
}

module.exports.loadTranslations = () => {
    if( this.gettext === undefined ) {
        let gettextParser = undefined

        if( this.configuration.parserMode === 'po' ) {
            gettextParser = parser.po
        }
        else if( this.configuration.parserMode === 'mo' ) {
            gettextParser = parser.mo
        }
        else {
            throw `Parser mode '${this.configuration.parserMode}' is invalid. It must be 'po' or 'mo'.`
        }

        const localesDir = path.join(process.cwd(), this.configuration.localesDirectory)
        const localeFileName = `messages.${this.configuration.parserMode}`

        this.gettext = new Gettext()

        fs.readdirSync(localesDir, { withFileTypes : true })
            .filter(locale => locale.isDirectory())
            .forEach(locale => {
                const filePath = path.join(localesDir, locale.name, localeFileName)
                console.log(`Loading ${filePath}.`)

                const content = fs.readFileSync(filePath)
                const parsedTranslations = gettextParser.parse(content)

                const standardLocale = this.getStandardLocale(locale.name)
                this.gettext.addTranslations(standardLocale, 'messages', parsedTranslations)
            })

        this.generateMessageFile()
    }
}

module.exports.generateMessageFile = () => {
    // These regex can find multiples occurences on the same line due to ? lazy quantifier
    const singular = /_(?:i)*\('.+?'/g         // _('singular' ; _i('singular'
    const plural = /_n(?:i)*\('.+?',.*?'.+?'/g // _n('singular', 'plural' ; _ni('singular', 'plural'

    const lines = this.configuration.tokenFilePatterns
        .map(tokenFilePattern => {
            return glob.sync(path.join(process.cwd(), tokenFilePattern))
        })
        .flat(1)
        .map(filePath => {
            const fileContent = fs.readFileSync(filePath).toString()
            const singularMatches = fileContent.match(singular)
            const pluralMatches = fileContent.match(plural)

            if(singularMatches || pluralMatches) {
                console.log(`Localization tokens found in ${filePath}.`)
            }

            return [].concat(singularMatches, pluralMatches)
        })
        .flat(1)
        .filter((match, index, matches) => matches.indexOf(match) == index && match) // Distinct and not null
        .map(match => match += ')')

    lines.unshift('// It exists only to allow PO editors to get translation keys from source code.')
    lines.unshift('// WARNING! This file is generated by a tool.')

    const messagesPath = path.join(process.cwd(), this.configuration.localesDirectory, this.configuration.javascriptMessages)
    const messagesContent = lines.join("\r\n")

    console.log(`Writing ${messagesPath}.`)
    fs.writeFileSync(messagesPath, messagesContent)
}