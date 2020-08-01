'use strict'

const chai = require('chai')
const i18n = require('../i18n')

chai.should()

describe('i18n.getStandardLocale custom localeRegex', () => {
    it('should returns the full locale', () => {
        i18n.init({
            localeRegex: /^(?:(?<country>.{2}))*(?<lang>.{2})$/
        })

        const expected = 'nl-be'
        const actual = i18n.getStandardLocale('benl')

        actual.should.be.equal(expected)
    })

    it('should returns the lang locale', () => {
        i18n.init({
            localeRegex: /^(?:(?<country>.{2}))*(?<lang>.{2})$/
        })

        const expected = 'nl'
        const actual = i18n.getStandardLocale('nl')

        actual.should.be.equal(expected)
    })

    it('should throw an exception if locale does not match', () => {
        (() => {
            i18n.init({
                localeRegex: /^(?:(?<country>.{2}))*(?<lang>.{2})$/
            })
            i18n.getStandardLocale('nl-be')
        })
        .should.throw('Locale nl-be does not match regex /^(?:(?<country>.{2}))*(?<lang>.{2})$/')
    })
})