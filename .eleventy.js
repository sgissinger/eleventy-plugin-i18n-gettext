'use strict'

const i18n = require('./i18n')

module.exports = (eleventyConfig, options = {}) => {
    i18n.init(options)

    eleventyConfig.on('beforeBuild', () => {
        i18n.gettext = undefined
        i18n.loadTranslations()
    })

    eleventyConfig.on('beforeWatch', () => {
        i18n.gettext = undefined
        i18n.loadTranslations()
    })

    eleventyConfig.addShortcode('relocalizePath', (targetedLocale, path) => {
        const url = i18n.relocalizePath(targetedLocale, path)

        return eleventyConfig.getFilter('url')(url)
    })

    eleventyConfig.addShortcode('t',  (locale, key) => i18n._(locale, key) )
    eleventyConfig.addShortcode('tn', (locale, singular, plural, count) => i18n._n(locale, singular, plural, count) )
    eleventyConfig.addShortcode('td', (locale, format, date) => i18n._d(locale, format, date) )
    eleventyConfig.addShortcode('tp', (locale, path) => {
        const url = i18n._p(locale, path)

        return eleventyConfig.getFilter('url')(url)
    })
}

module.exports._ = i18n._
module.exports._n = i18n._n
module.exports._d = i18n._d
module.exports._p = i18n._p
module.exports.enhance11tydata = i18n.enhance11tydata