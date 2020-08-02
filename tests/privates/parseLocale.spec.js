'use strict'

const chai = require('chai')
const i18n = require('../../i18n')

chai.should()

describe('parseLocale', () => {
    describe('default localeRegex', () => {
        it('should returns the full locale', () => {
            i18n.init()
    
            const expected = {
                lang: 'fr',
                country: 'fr',
                locale: 'fr-fr'
            }
            const actual = i18n.parseLocale('fr-fr')
    
            actual.should.be.deep.equal(expected)
        })

        it('should returns the lang locale', () => {
            i18n.init()
    
            const expected = {
                lang: 'fr',
                country: '',
                locale: 'fr'
            }
            const actual = i18n.parseLocale('fr')
    
            actual.should.be.deep.equal(expected)
        })

        it('should throw an exception if locale does not match', () => {
            (() => {
                i18n.init()
                i18n.parseLocale('benl')
            })
            .should.throw('Locale benl does not match regex /^(?<lang>.{2})(?:-(?<country>.{2}))*$/')
        })
    })

    describe('custom localeRegex', () => {
        it('should returns the full locale', () => {
            i18n.init({
                localeRegex: /^(?:(?<country>.{2}))*(?<lang>.{2})$/
            })

            const expected = {
                lang: 'nl',
                country: 'be',
                locale: 'nl-be'
            }
            const actual = i18n.parseLocale('benl')

            actual.should.be.deep.equal(expected)
        })

        it('should returns the lang locale', () => {
            i18n.init({
                localeRegex: /^(?:(?<country>.{2}))*(?<lang>.{2})$/
            })

            const expected = {
                lang: 'nl',
                country: '',
                locale: 'nl'
            }
            const actual = i18n.parseLocale('nl')

            actual.should.be.deep.equal(expected)
        })

        it('should throw an exception if locale does not match', () => {
            (() => {
                i18n.init({
                    localeRegex: /^(?:(?<country>.{2}))*(?<lang>.{2})$/
                })
                i18n.parseLocale('nl-be')
            })
            .should.throw('Locale nl-be does not match regex /^(?:(?<country>.{2}))*(?<lang>.{2})$/')
        })
    })
})