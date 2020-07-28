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
}

module.exports._ = i18n._
module.exports._n = i18n._n
module.exports._p = i18n._p
module.exports._d = i18n._d
module.exports.relocalizePath = i18n.relocalizePath
module.exports.enhance11tydata = i18n.enhance11tydata