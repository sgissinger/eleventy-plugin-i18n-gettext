'use strict'

const chai = require('chai')
const i18n = require('../../i18n')

chai.should()

describe('_p', () => {
    beforeEach(() => {
        i18n.init({
            localesDirectory: 'tests/locales'
        })
    })

    it('should localize a path', () => {
        i18n.pathPrefix = '/'

        const expected = '/fr-fr/apple'
        const actual = i18n._p('fr-fr', '/apple')

        actual.should.be.equal(expected)
    })

    it('should localize a path having a pathPrefix', () => {
        i18n.pathPrefix = '/blog/'

        const expected = '/fr-fr/apple'
        const actual = i18n._p('fr-fr', '/apple')

        actual.should.be.equal(expected)
    })

    it('should localize a path (enhance11tydata)', () => {
        i18n.pathPrefix = '/'

        const eleventyData = i18n.enhance11tydata({}, 'fr-fr')

        const expected = '/fr-fr/apple'
        const actual = eleventyData._p('/apple')

        actual.should.be.equal(expected)
    })
})