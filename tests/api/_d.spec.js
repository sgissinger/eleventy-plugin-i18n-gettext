'use strict'

const chai = require('chai')
const i18n = require('../../i18n')

chai.should()

describe('_d', () => {
    beforeEach(() => {
        i18n.init({
            localesDirectory: 'tests/locales'
        })
    })

    it('should format a Date object', () => {
        const expected = 'samedi 1 août 2020 23:57'
        const actual = i18n._d('fr-fr', 'LLLL', new Date(1596319020000))

        actual.should.be.equal(expected)
    })

    it('should format an ISO date string', () => {
        const expected = 'samedi 1 août 2020 23:57'
        const actual = i18n._d('fr-fr', 'LLLL', '2020-08-01T21:57:00.000Z')

        actual.should.be.equal(expected)
    })

    it('should format a Date object (enhance11tydata)', () => {
        const eleventyData = i18n.enhance11tydata({}, 'fr-fr')

        const expected = 'samedi 1 août 2020 23:57'
        const actual = eleventyData._d('LLLL', new Date(1596319020000))

        actual.should.be.equal(expected)
    })
})