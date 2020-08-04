'use strict'

const chai = require('chai')
const i18n = require('../../src/i18n')

chai.should()

describe('translate', () => {
    beforeEach(() => {
        i18n.init({
            localesDirectory: 'tests/assets/locales'
        })
    })

    it('should translate a key found in messages.po', () => {
        const expected = 'Banane'
        const actual = i18n.translate('fr-fr', 'Banana')

        actual.should.be.equal(expected)
    })

    it('should not translate a key not found in messages.po', () => {
        const expected = 'Blackberry'
        const actual = i18n.translate('fr-fr', 'Blackberry')

        actual.should.be.equal(expected)
    })

    it('should not translate a key when messages.po does not exist', () => {
        const expected = 'Banana'
        const actual = i18n.translate('nl-be', 'Banana')

        actual.should.be.equal(expected)
    })
})