import fs from 'fs'
import path from 'path'
import glob from 'glob'
import printf from 'printf'
import moment from 'moment-timezone'

const Gettext = require('node-gettext')
const parser = require('gettext-parser')

import type { IConfiguration } from './IConfiguration'
import type { ILocaleInformation } from './ILocaleInformation'

class i18n {
    private defaultConfiguration: IConfiguration = {
        localesDirectory: 'locales',
        parserMode: 'po',
        javascriptMessages: 'messages.js',
        tokenFilePatterns: [
            'src/**/*.njk',
            'src/**/*.js'
        ],
        localeRegex: /^(?<lang>.{2})(?:-(?<country>.{2}))*$/
    }
    private configuration: IConfiguration = { }
    private gettext: any = undefined
    private pathPrefix: string = '/'

    public configFunction(eleventyConfig: any, options: IConfiguration = {}) {
        this.init(options)

        eleventyConfig.on('beforeBuild', () => {
            this.gettext = undefined
            this.loadTranslations()
        })
    
        eleventyConfig.on('beforeWatch', () => {
            this.gettext = undefined
            this.loadTranslations()
        })
    
        eleventyConfig.addShortcode('_', (locale: string, key: string, ...args: string[]) => {
            return this._(locale, key, ...args)
        })
        eleventyConfig.addShortcode('_i', (locale: string, key: string, obj: any) => {
            return this._i(locale, key, obj)
        })
        eleventyConfig.addShortcode('_n', (locale: string, singular: string, plural: string, count: number, ...args: string[]) => {
            return this._n(locale, singular, plural, count, ...args)
        })
        eleventyConfig.addShortcode('_ni', (locale: string, singular: string, plural: string, count: number, obj: any) => {
            return this._ni(locale, singular, plural, count, obj)
        })
        eleventyConfig.addShortcode('_d', (locale: string, format: string, date: moment.MomentInput, timezone: string) => {
            return this._d(locale, format, date, timezone)
        })
        eleventyConfig.addShortcode('_p', (locale: string, path: string) => {
            const url = this._p(locale, path)
    
            return eleventyConfig.getFilter('url')(url)
        })
        eleventyConfig.addShortcode('relocalizePath', (targetedLocale: string, path: string) => {
            const url = this.relocalizePath(targetedLocale, path)
    
            return eleventyConfig.getFilter('url')(url)
        })
    }

    public init(options: IConfiguration): void {
        this.configuration = { ...this.defaultConfiguration, ...options }

        if( !['po', 'mo'].includes(this.configuration.parserMode!) ) {
            throw `Parser mode '${this.configuration.parserMode}' is invalid. It must be 'po' or 'mo'.`
        }
    }

    private normalizePath(path: string): string {
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

    private parseLocale(locale: string): ILocaleInformation {
        const match = locale.match(this.configuration.localeRegex!)
    
        if ( !match || !match.groups ) {
            throw `Locale ${locale} does not match regex ${this.configuration.localeRegex}`
        }
    
        return {
            lang: match.groups.lang,
            locale: match.groups.country ? `${match.groups.lang}-${match.groups.country}` : match.groups.lang
        }
    }

    private setLocale(locale: string) {
        const parsedLocale = this.parseLocale(locale)
    
        if( this.gettext ) {
            this.gettext.setLocale(parsedLocale.locale)
        }
        moment.locale(parsedLocale.locale)
    }
    
    private translate(locale: string, key: string): string {
        this.loadTranslations()
        this.setLocale(locale)
    
        return this.gettext.gettext(key)
    }
    
    private ntranslate(locale: string, singular: string, plural: string, count: number) {
        this.loadTranslations()
        this.setLocale(locale)
    
        return this.gettext.ngettext(singular, plural, count)
    }

    public _(locale: string, key: string, ...args: string[]): string {
        const translation = this.translate(locale, key)
    
        if( args.length ) {
            return printf(translation, ...args)
        }
        return translation
    }
    
    public _i(locale: string, key: string, obj: any): string {
        const translation = this.translate(locale, key)
    
        if( obj ) {
            return this.dynamicInterpolation(translation, obj)
        }
        return translation
    }
    
    public _n(locale: string, singular: string, plural: string, count: number, ...args: string[]): string {
        const translation = this.ntranslate(locale, singular, plural, count)
    
        if( args.length ) {
            return printf(translation, ...args)
        }
        return translation
    }
    
    public _ni(locale: string, singular: string, plural: string, count: number, obj: any): string {
        const translation = this.ntranslate(locale, singular, plural, count)
    
        if( obj ) {
            return this.dynamicInterpolation(translation, obj)
        }
        return translation
    }
    
    public _d(locale: string, format: string, date: moment.MomentInput, timezone: string): string {
        this.setLocale(locale)

        if( timezone ) {
            return moment(date).tz(timezone).format(format)
        }
        return moment(date).format(format)
    }
    
    public _p(locale: string, basePath: string): string {
        const path = this.normalizePath(basePath)
    
        return `/${locale}${path}`
    }

    public relocalizePath(targetedLocale: string, pagePath: string): string {
        const path = this.normalizePath(pagePath)
    
        const pathParts = path.split('/').filter(pathPart => pathPart)
        pathParts[0] = targetedLocale
    
        return `/${pathParts.join('/')}`
    }

    public enhance11tydata(obj: any, locale: string, dir: string = 'ltr'): any {
        if ( fs.existsSync(locale) ) {
            locale = path.win32.basename(locale)
        }
    
        if( !['ltr', 'rtl'].includes(dir) ) {
            throw `Language direction '${dir}' is invalid. It must be 'ltr' or 'rtl'.`
        }
    
        const parsedLocale = this.parseLocale(locale)
    
        obj.lang = parsedLocale.lang
        obj.langDir = dir
        obj.locale = locale

        obj._ = (key: string, ...args: string[]) => {
            return this._(locale, key, ...args)
        }
        obj._i = (key: string, obj: any) => {
            return this._i(locale, key, obj)
        }
        obj._n = (singular: string, plural: string, count: number, ...args: string[]) => {
            return this._n(locale, singular, plural, count, ...args)
        }
        obj._ni = (singular: string, plural: string, count: number, obj: any) => {
            return this._ni(locale, singular, plural, count, obj)
        }
        obj._d = (format: string, date: moment.MomentInput, timezone: string) => {
            return this._d(locale, format, date, timezone)
        }
        obj._p = (basePath: string) => {
            return this._p(locale, basePath)
        }
    
        return obj
    }

    private loadTranslations(): void {
        if( this.gettext === undefined ) {
            let gettextParser: any = undefined
    
            if( this.configuration.parserMode === 'po' ) {
                gettextParser = parser.po
            }
            else if( this.configuration.parserMode === 'mo' ) {
                gettextParser = parser.mo
            }
            else {
                throw `Parser mode '${this.configuration.parserMode}' is invalid. It must be 'po' or 'mo'.`
            }
    
            const localesDir = path.join(process.cwd(), this.configuration.localesDirectory!)
            const localeFileName = `messages.${this.configuration.parserMode}`
    
            this.gettext = new Gettext()
    
            fs.readdirSync(localesDir, { withFileTypes : true })
                .filter(locale => locale.isDirectory())
                .forEach(locale => {
                    const filePath = path.join(localesDir, locale.name, localeFileName)
                    console.log(`Loading ${filePath}.`)
    
                    const content = fs.readFileSync(filePath)
                    const parsedTranslations = gettextParser.parse(content)
    
                    const parsedLocale = this.parseLocale(locale.name)
                    this.gettext.addTranslations(parsedLocale.locale, 'messages', parsedTranslations)
                })
    
            this.generateMessageFile()
        }
    }

    private generateMessageFile(): void {
        // This regex can find multiples occurences on the same line due to ? lazy quantifier
        const stringRegExp = "(?:'.+?'|\".+?\")"
        const localeRegExp = "\\(?\\s*(?:locale\\s*,)?"
    
        // _('singular'             _i('singular'
        // _(locale, 'singular'     _i(locale, 'singular'
        // _ locale, 'singular'     _i locale, 'singular'
        const singular = new RegExp(`_i?${localeRegExp}\\s*${stringRegExp}`, 'g')
    
        // _n('singular', 'plural'             _ni('singular', 'plural'
        // _n(locale, 'singular', 'plural'     _ni(locale, 'singular', 'plural'
        // _n locale, 'singular', 'plural'     _ni locale, 'singular', 'plural'
        const plural = new RegExp(`_ni?${localeRegExp}\\s*${stringRegExp}\\s*,\\s*${stringRegExp}`, 'g')
    
        // Node 10.x backward compatibility
        if( !Array.prototype.flat ) {
            Array.prototype.flat = function() { return [].concat.apply([], this as any) }
        }
    
        const lines = this.configuration.tokenFilePatterns!
            .map(tokenFilePattern => {
                return glob.sync(path.join(process.cwd(), tokenFilePattern))
            })
            .flat()
            .map(filePath => {
                const fileContent = fs.readFileSync(filePath).toString()
                const singularMatches = fileContent.match(singular)
                const pluralMatches = fileContent.match(plural)
    
                if(singularMatches || pluralMatches) {
                    console.log(`Localization tokens found in ${filePath}.`)
                }
    
                return [].concat(singularMatches as any, pluralMatches as any) as RegExpMatchArray
            })
            .flat()
            .filter(match => match) // not null
            .map(match => {
                return match
                    .replace(/\(?\s*locale\s*,/, '(')  // remove locale parameter
                    .replace(/([\(,])\s+(["'])/g, '$1$2') + ')' // remove spaces in front of string parameters
            })
            .filter((match, index, matches) => matches.indexOf(match) == index) // distinct
    
        lines.unshift('// It exists only to allow PO editors to get translation keys from source code.')
        lines.unshift('// WARNING! This file is generated by a tool.')
    
        const messagesPath = path.join(process.cwd(), this.configuration.localesDirectory!, this.configuration.javascriptMessages!)
        const messagesContent = lines.join("\r\n")
    
        console.log(`Writing ${messagesPath}.`)
        fs.writeFileSync(messagesPath, messagesContent)
    }

    private dynamicInterpolation(translation: string, obj: any): string {
        let codeToEvaluate = ''

        for (const prop in obj) {
            codeToEvaluate += `const ${prop} = "${obj[prop]}";`
        }
    
        return eval(`${codeToEvaluate}\`${translation}\``)
    }
}

export = new i18n()