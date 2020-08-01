'use strict'

const chai = require('chai')
const i18n = require('../i18n')

describe('i18n.getStandardLocale()', () => {
    before(() => {
        chai.should()
    })

    describe('default localeRegex', () => {
        beforeEach(() => {
            i18n.configuration = undefined
            i18n.init({})
        })

        it('should returns the full locale', () => {
            const expected = "fr-fr"
            const actual = i18n.getStandardLocale("fr-fr")

            actual.should.be.equal(expected)
        })

        it('should returns the lang locale', () => {
            const expected = "fr"
            const actual = i18n.getStandardLocale("fr")

            actual.should.be.equal(expected)
        })

        it('should throw an exception if locale does not match', () => {
            (() => {
                i18n.getStandardLocale("benl")
            })
            .should.throw("Locale benl does not match regex /^(?<lang>.{2})(?:-(?<country>.{2}))*$/")
        })
    })

    describe('custom localeRegex', () => {
        beforeEach(() => {
            i18n.configuration = undefined
            i18n.init({
                localeRegex: /^(?:(?<country>.{2}))*(?<lang>.{2})$/
            })
        })

        it('should returns the full locale', () => {
            const expected = "nl-be"
            const actual = i18n.getStandardLocale("benl")

            actual.should.be.equal(expected)
        })

        it('should returns the lang locale', () => {
            const expected = "nl"
            const actual = i18n.getStandardLocale("nl")

            actual.should.be.equal(expected)
        })

        it('should throw an exception if locale does not match', () => {
            (() => {
                i18n.getStandardLocale("nl-be")
            })
            .should.throw("Locale nl-be does not match regex /^(?:(?<country>.{2}))*(?<lang>.{2})$/")
        })
    })
})