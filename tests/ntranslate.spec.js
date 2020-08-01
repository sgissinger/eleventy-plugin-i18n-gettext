'use strict'

const chai = require('chai')
const i18n = require('../i18n')

chai.should()

describe('i18n.ntranslate', () => {
    beforeEach(() => {
        i18n.init({
            localesDirectory: 'tests/locales'
        })
    })

    it('should translate a key found in messages.po (singular)', () => {
        const expected = 'Banane jaune'
        const actual = i18n.ntranslate('fr-fr', 'Yellow banana', 'Yellow bananas', 1)

        actual.should.be.equal(expected)
    })

    it('should translate a key found in messages.po (plural)', () => {
        const expected = 'Bananes jaunes'
        const actual = i18n.ntranslate('fr-fr', 'Yellow banana', 'Yellow bananas', 2)

        actual.should.be.equal(expected)
    })

    it('should not translate a key not found in messages.po (singular)', () => {
        const expected = 'Red blackberry'
        const actual = i18n.ntranslate('fr-fr', 'Red blackberry', 'Red blackberries', 1)

        actual.should.be.equal(expected)
    })

    it('should not translate a key not found in messages.po (plural)', () => {
        const expected = 'Red blackberries'
        const actual = i18n.ntranslate('fr-fr', 'Red blackberry', 'Red blackberries', 2)

        actual.should.be.equal(expected)
    })

    it('should not translate a key when messages.po does not exist (singular)', () => {
        const expected = 'Yellow banana'
        const actual = i18n.ntranslate('nl-be', 'Yellow banana', 'Yellow bananas', 1)

        actual.should.be.equal(expected)
    })

    it('should not translate a key when messages.po does not exist (plural)', () => {
        const expected = 'Yellow bananas'
        const actual = i18n.ntranslate('nl-be', 'Yellow banana', 'Yellow bananas', 2)

        actual.should.be.equal(expected)
    })
})