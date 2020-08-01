'use strict'

const chai = require('chai')
const i18n = require('../i18n')

chai.should()

describe('i18n.translate', () => {
    it('should translate a key found in messages.po', () => {
        i18n.init({
            localesDirectory: 'test/locales'
        })

        const expected = 'Banane'
        const actual = i18n.translate('fr-fr', 'Banana')

        actual.should.be.equal(expected)
    })

    it('should not translate a key not found in messages.po', () => {
        i18n.init({
            localesDirectory: 'test/locales'
        })

        const expected = 'Blackberry'
        const actual = i18n.translate('fr-fr', 'Blackberry')

        actual.should.be.equal(expected)
    })

    it('should not translate a key when messages.po does not exist', () => {
        i18n.init({
            localesDirectory: 'test/locales'
        })

        const expected = 'Banana'
        const actual = i18n.translate('nl-be', 'Banana')

        actual.should.be.equal(expected)
    })
})