'use strict'

const chai = require('chai')
const i18n = require('../../dist/i18n')

chai.should()

describe('i18n.relocalizePath', () => {
    it('should relocalizePath a path', () => {
        i18n.pathPrefix = '/'

        const expected = '/fr-fr/apple'
        const actual = i18n.relocalizePath('fr-fr', '/en-us/apple')

        actual.should.be.equal(expected)
    })

    it('should relocalizePath a path having a pathPrefix', () => {
        i18n.pathPrefix = '/blog/'

        const expected = '/fr-fr/apple'
        const actual = i18n.relocalizePath('fr-fr', '/blog/en-us/apple')

        actual.should.be.equal(expected)
    })
})