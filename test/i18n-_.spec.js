'use strict'

const chai = require('chai')
const i18n = require('../i18n')

chai.should()

describe('i18n._', () => {
    it('should translate a key found in messages.po', () => {
        i18n.init({
            localesDirectory: 'test/locales'
        })

        const expected = 'Banane'
        const actual = i18n._('fr-fr', 'Banana')

        actual.should.be.equal(expected)
    })

    it('should translate a key found in messages.po then format with printf', () => {
        i18n.init({
            localesDirectory: 'test/locales'
        })

        const expected = 'La pomme éloigne le médecin.'
        const actual = i18n._('fr-fr', 'The %s keeps the doctor away.', 'pomme')

        actual.should.be.equal(expected)
    })

    it('should translate a key found in messages.po then format with printf (enhance11tydata)', () => {
        i18n.init({
            localesDirectory: 'test/locales'
        })

        const eleventyData = i18n.enhance11tydata({}, 'fr-fr')

        const expected = 'La pomme éloigne le médecin.'
        const actual = eleventyData._('The %s keeps the doctor away.', 'pomme')

        actual.should.be.equal(expected)
    })
})