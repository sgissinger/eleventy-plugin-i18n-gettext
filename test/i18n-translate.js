'use strict'

const chai = require('chai')
const i18n = require('../i18n')

chai.should()

describe('i18n.translate', () => {    
    beforeEach(() => {
        i18n.configuration = undefined
        i18n.init({
            localesDirectory: 'test/locales'
        })
    })

    it('should translate a key found in file messages.po', () => {
        const expected = 'Banane'
        const actual = i18n.translate('fr-fr', 'Banana')

        actual.should.be.equal(expected)
    })

    it('should not translate a key not found in file messages.po', () => {
        const expected = 'Blackberry'
        const actual = i18n.translate('fr-fr', 'Blackberry')

        actual.should.be.equal(expected)
    })

    it('should not translate a key when file messages.po does not exist', () => {
        const expected = 'Banana'
        const actual = i18n.translate('nl-be', 'Banana')

        actual.should.be.equal(expected)
    })
})