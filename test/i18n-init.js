'use strict'

const chai = require('chai')
const i18n = require('../i18n')

describe('i18n.init()', () => {
    before(() => {
        chai.should()
    })

    beforeEach(() => {
        i18n.configuration = undefined
    })

    it('should set configuration with default configuration', () => {
        const expected = i18n.defaultConfiguration

        i18n.init({})
        const actual = i18n.configuration

        actual.should.be.deep.equal(expected)
    })

    it('should set configuration with partial custom configuration', () => {
        const expected = {
            localesDirectory: 'lang',
            parserMode: 'mo',
            javascriptMessages: 'computed-messages.js',
            tokenFilePatterns: [
                'src/**/*.njk',
                'src/**/*.js'
            ],
            localeRegex: /^(?<lang>.{2})(?:-(?<country>.{2}))*$/
        }

        i18n.init({
            localesDirectory: 'lang',
            parserMode: 'mo',
            javascriptMessages: 'computed-messages.js'
        })
        const actual = i18n.configuration

        actual.should.be.deep.equal(expected)
    })

    it('should set configuration with full custom configuration', () => {
        const expected = {
            localesDirectory: 'lang',
            parserMode: 'mo',
            javascriptMessages: 'computed-messages.js',
            tokenFilePatterns: [
                'src/**/*.liquid'
            ],
            localeRegex: /^(?:(?<country>.{2}))*(?<lang>.{2})$/
        }

        i18n.init({
            localesDirectory: 'lang',
            parserMode: 'mo',
            javascriptMessages: 'computed-messages.js',
            tokenFilePatterns: [
                'src/**/*.liquid'
            ],
            localeRegex: /^(?:(?<country>.{2}))*(?<lang>.{2})$/
        })
        const actual = i18n.configuration

        actual.should.be.deep.equal(expected)
    })

    it('should throw error when parser mode is invalid', () => {
        (() => {
            i18n.init({
                parserMode: 'mon'
            })
        })
        .should.throw("Parser mode 'mon' is invalid. It must be 'po' or 'mo'.")
    })
})