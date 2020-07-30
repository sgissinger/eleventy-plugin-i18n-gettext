'use strict'

const fs = require('fs')
const path = require('path')
const glob = require('glob')
const Gettext = require('node-gettext')
const parser = require('gettext-parser')
const printf = require('printf')
const moment = require('moment')

module.exports.defaultConfiguration = {
    localesDirectory: 'locales',
    parserMode: 'po',
    javascriptMessages: 'messages.js',
    tokenFilePatterns: [
        'src/**/*.njk',
        'src/**/*.js'
    ]
}
module.exports.configuration = undefined
module.exports.gettext = undefined

module.exports.init = (options) => {
    this.configuration = Object.assign(this.defaultConfiguration, options)

    if( !['po', 'mo'].includes(this.configuration.parserMode) ) {
        console.error(`Parser mode '${this.configuration.parserMode}' is invalid. It must be 'po' or 'mo'.`)
    }
}

module.exports._ = (locale, key, ...args) => {
    this.loadTranslations()
    this.gettext.setLocale(locale)
    const translation = this.gettext.gettext(key)

    return printf(translation, ...args)
}

module.exports._n = (locale, singular, plural, count, ...args) => {
    this.loadTranslations()
    this.gettext.setLocale(locale)
    const translation = this.gettext.ngettext(singular, plural, count)

    return printf(translation, ...args)
}

module.exports._d = (locale, format, date) => {
    moment.locale(locale.substring(0, 2))

    return moment(date).format(format)
}

module.exports._p = (locale, basePath) => {
    return `/${locale}${basePath}`
}

module.exports.relocalizePath = (targetedLocale, pagePath) => {
    const pathParts = pagePath.split('/').filter(pathPart => pathPart !== '')
    pathParts[0] = targetedLocale

    return `/${pathParts.join('/')}`
}

module.exports.enhance11tydata = (obj, locale, dir = "ltr") => {
    if ( fs.existsSync(locale) ) {
        locale = path.basename(locale)
    }

    if( !['ltr', 'rtl'].includes(dir) ) {
        console.error(`Language direction '${dir}' is invalid. It must be 'ltr' or 'rtl'.`)
    }

    obj.lang = locale.substring(0, 2)
    obj.langDir = dir
    obj.locale = locale
    obj._ = (key, ...args) => {
        return this._(locale, key, ...args)
    }
    obj._n = (singular, plural, count, ...args) => {
        return this._n(locale, singular, plural, count, ...args)
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
    if( this.configuration === undefined ) {
        this.init({})
    }

    if( this.gettext === undefined ) {
        const localesDir = path.join(process.cwd(), this.configuration.localesDirectory)
        const localeFileName = `messages.${this.configuration.parserMode}`

        this.gettext = new Gettext()

        fs.readdirSync(localesDir, { withFileTypes : true })
            .filter(locale => locale.isDirectory())
            .map(locale => {
                const filePath = path.join(localesDir, locale.name, localeFileName)
                console.log(`Loading ${filePath}.`)

                const content = fs.readFileSync(filePath)

                let parsedTranslations = undefined

                if( this.configuration.parserMode === 'po' ) {
                    parsedTranslations = parser.po.parse(content)
                }
                else if( this.configuration.parserMode === 'mo' ) {
                    parsedTranslations = parser.mo.parse(content)
                }

                this.gettext.addTranslations(locale.name, 'messages', parsedTranslations)
            })

        this.generateMessageFile()
    }
}

module.exports.generateMessageFile = () => {
    const files = this.configuration.tokenFilePatterns.map(tokenFilePattern => {
        return glob.sync(path.join(process.cwd(), tokenFilePattern))
    }).flat(1)

    // These regex can find multiples occurences on the same line due to ? lazy quantifier
    const singular = /_\('.+?'/g         // _('singular'
    const plural = /_n\('.+?',.*?'.+?'/g // _n('singular', 'plural'

    let matches = []

    files.map(file => {
        const fileContent = fs.readFileSync(file).toString()

        const singularMatches = fileContent.match(singular)
        if(singularMatches) {
            matches = matches.concat(singularMatches)
        }

        const pluralMatches = fileContent.match(plural)
        if(pluralMatches) {
            matches = matches.concat(pluralMatches)
        }

        if(singularMatches || pluralMatches) {
            console.log(`Localization tokens found in ${file}.`)
        }
    })

    matches = matches
        .filter((match, index) => matches.indexOf(match) == index) // Distinct
        .map(match => match += ")")

    matches.unshift("// It exists only to allow PO editors to get translation keys from source code.")
    matches.unshift("// WARNING! This file is generated by a tool.")

    const messagesPath = path.join(process.cwd(), this.configuration.localesDirectory, this.configuration.javascriptMessages)

    console.log(`Writing ${messagesPath}.`)
    fs.writeFileSync(messagesPath, matches.join("\r\n"))
}