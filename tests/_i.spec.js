'use strict'

const chai = require('chai')
const i18n = require('../i18n')

chai.should()

describe('i18n._i', () => {
    beforeEach(() => {
        i18n.init({
            localesDirectory: 'tests/locales'
        })
    })

    it('should translate a key found in messages.po', () => {
        const expected = 'Banane'
        const actual = i18n._i('fr-fr', 'Banana')

        actual.should.be.equal(expected)
    })

    it('should not translate a key not found in messages.po', () => {
        const expected = 'Blackberry'
        const actual = i18n._i('fr-fr', 'Blackberry')

        actual.should.be.equal(expected)
    })

    it('should not translate a key when messages.po does not exist', () => {
        const expected = 'Banana'
        const actual = i18n._i('nl-be', 'Banana')

        actual.should.be.equal(expected)
    })

    it('should translate a key found in messages.po then interpolate string', () => {
        const expected = 'La pomme éloigne le médecin (3).'
        const actual = i18n._i('fr-fr', 'The ${name} keeps the doctor away (${count}).', {name:'pomme', count:3})

        actual.should.be.equal(expected)
    })

    it('should translate a key found in messages.po then interpolate string (enhance11tydata)', () => {
        const eleventyData = i18n.enhance11tydata({}, 'fr-fr')

        const expected = 'La pomme éloigne le médecin (3).'
        const actual = eleventyData._i('The ${name} keeps the doctor away (${count}).', {name:'pomme', count:3})

        actual.should.be.equal(expected)
    })
})