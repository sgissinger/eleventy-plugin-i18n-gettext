'use strict'

const chai = require('chai')
const i18n = require('../../i18n')

chai.should()

describe('_d', () => {
    beforeEach(() => {
        i18n.init({
            localesDirectory: 'tests/assets/locales'
        })
    })

    it('should format a Date object to Asia/Bangkok time', () => {
        const expected = 'dimanche 2 août 2020 04:57'
        const actual = i18n._d('fr-fr', 'LLLL', new Date(1596319020000), 'Asia/Bangkok')

        actual.should.be.equal(expected)
    })

    it('should format a Date object to UTC time', () => {
        const expected = 'samedi 1 août 2020 21:57'
        const actual = i18n._d('fr-fr', 'LLLL', new Date(1596319020000), 'UTC')

        actual.should.be.equal(expected)
    })

    it('should format an ISO date string', () => {
        const expected = '1 août 2020'
        const actual = i18n._d('fr-fr', 'LL', '2020-08-01T21:57:00.000Z')

        actual.should.be.equal(expected)
    })

    it('should format a Date object (enhance11tydata)', () => {
        const eleventyData = i18n.enhance11tydata({}, 'fr-fr')

        const expected = '1 août 2020'
        const actual = eleventyData._d('LL', new Date(1596319020000))

        actual.should.be.equal(expected)
    })
})