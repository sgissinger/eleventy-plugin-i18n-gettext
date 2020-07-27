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
        i18n.loadTranslations(options)
    })
}

module.exports = Object.assign(module.exports, i18n)