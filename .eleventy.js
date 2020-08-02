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

    eleventyConfig.addShortcode('_',   (locale, key, ...args) => i18n._(locale, key, ...args) )
    eleventyConfig.addShortcode('_i',  (locale, key, obj) => i18n._i(locale, key, obj) )
    eleventyConfig.addShortcode('_n',  (locale, singular, plural, count, ...args) => i18n._n(locale, singular, plural, count, ...args) )
    eleventyConfig.addShortcode('_ni', (locale, singular, plural, count, obj) => i18n._ni(locale, singular, plural, count, obj) )
    eleventyConfig.addShortcode('_d',  (locale, format, date, timezone) => i18n._d(locale, format, date, timezone) )
    eleventyConfig.addShortcode('_p',  (locale, path) => {
        const url = i18n._p(locale, path)

        return eleventyConfig.getFilter('url')(url)
    })
}

module.exports._ = i18n._
module.exports._n = i18n._n
module.exports._d = i18n._d
module.exports._p = i18n._p
module.exports.enhance11tydata = i18n.enhance11tydata