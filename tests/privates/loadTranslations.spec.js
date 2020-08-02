'use strict'

const chai = require('chai')
const i18n = require('../../i18n')

chai.should()

describe('loadTranslations', () => {
    it('should load translations from messages.mo', () => {
        i18n.init({
            localesDirectory: 'tests/assets/locales',
            parserMode: 'mo'
        })
        i18n.gettext = undefined

        i18n.loadTranslations()
    })

    it('should not load translations if parserMode is overriden manually', () => {
        (() => {
            i18n.init()
            i18n.configuration.parserMode = 'override'
            i18n.gettext = undefined

            i18n.loadTranslations()
        })
        .should.throw("Parser mode 'override' is invalid. It must be 'po' or 'mo'.")
    })
})