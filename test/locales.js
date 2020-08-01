const assert = require('assert')
const i18n = require('../i18n')

describe('i18n.getStandardLocale()', () => {
    describe('default localeRegex', () => {
        beforeEach(() => {
            i18n.configuration = undefined
            i18n.init({})
        })

        it('should returns the full locale', () => {
            const expected = "fr-fr"
            const actual = i18n.getStandardLocale("fr-fr")

            assert.strictEqual(actual, expected)
        })

        it('should returns the lang locale', () => {
            const expected = "fr"
            const actual = i18n.getStandardLocale("fr")

            assert.strictEqual(actual, expected)
        })

        it('should throw an exception if locale does not match', () => {
            assert.throws(
                () => {
                    i18n.getStandardLocale("benl")
                },
                null,
                "Locale benl does not match regex /^(?<lang>.{2})(?:-(?<country>.{2}))*$/"
            )
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

            assert.strictEqual(actual, expected)
        })

        it('should returns the lang locale', () => {
            const expected = "nl"
            const actual = i18n.getStandardLocale("nl")

            assert.strictEqual(actual, expected)
        })

        it('should throw an exception if locale does not match', () => {
            assert.throws(
                () => {
                    i18n.getStandardLocale("nl-be")
                },
                null,
                "Locale nl-be does not match regex /^(?:(?<country>.{2}))*(?<lang>.{2})$/"
            )
        })
    })
})