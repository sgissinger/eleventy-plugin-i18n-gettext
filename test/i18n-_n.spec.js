'use strict'

const chai = require('chai')
const i18n = require('../i18n')

chai.should()

describe('i18n._n', () => {
    it('should translate a key found in messages.po (singular)', () => {
        i18n.init({
            localesDirectory: 'test/locales'
        })

        const expected = 'Banane jaune'
        const actual = i18n._n('fr-fr', 'Yellow banana', 'Yellow bananas', 1)

        actual.should.be.equal(expected)
    })

    it('should translate a key found in messages.po (plural)', () => {
        i18n.init({
            localesDirectory: 'test/locales'
        })

        const expected = 'Bananes jaunes'
        const actual = i18n._n('fr-fr', 'Yellow banana', 'Yellow bananas', 2)

        actual.should.be.equal(expected)
    })

    it('should not translate a key not found in messages.po (singular)', () => {
        i18n.init({
            localesDirectory: 'test/locales'
        })

        const expected = 'Red blackberry'
        const actual = i18n._n('fr-fr', 'Red blackberry', 'Red blackberries', 1)

        actual.should.be.equal(expected)
    })

    it('should not translate a key not found in messages.po (plural)', () => {
        i18n.init({
            localesDirectory: 'test/locales'
        })

        const expected = 'Red blackberries'
        const actual = i18n._n('fr-fr', 'Red blackberry', 'Red blackberries', 2)

        actual.should.be.equal(expected)
    })

    it('should not translate a key when messages.po does not exist (singular)', () => {
        i18n.init({
            localesDirectory: 'test/locales'
        })

        const expected = 'Yellow banana'
        const actual = i18n._n('nl-be', 'Yellow banana', 'Yellow bananas', 1)

        actual.should.be.equal(expected)
    })

    it('should not translate a key when messages.po does not exist (plural)', () => {
        i18n.init({
            localesDirectory: 'test/locales'
        })

        const expected = 'Yellow bananas'
        const actual = i18n._n('nl-be', 'Yellow banana', 'Yellow bananas', 2)

        actual.should.be.equal(expected)
    })

    it('should translate a key found in messages.po then format with printf', () => {
        i18n.init({
            localesDirectory: 'test/locales'
        })

        const expected = 'Ces 3 fruits sont excellents.'
        const actual = i18n._n('fr-fr', 'This unique fruit is excellent.', 'These %d fruits are excellent.', 3, 3)

        actual.should.be.equal(expected)
    })

    it('should translate a key found in messages.po then format with printf (enhance11tydata)', () => {
        i18n.init({
            localesDirectory: 'test/locales'
        })

        const eleventyData = i18n.enhance11tydata({}, 'fr-fr')

        const expected = 'Ces 3 fruits sont excellents.'
        const actual = eleventyData._n('This unique fruit is excellent.', 'These %d fruits are excellent.', 3, 3)

        actual.should.be.equal(expected)
    })
})