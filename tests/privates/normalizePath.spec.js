'use strict'

const chai = require('chai')
const sinon = require('sinon')
const i18n = require('../../i18n')

chai.should()

describe('normalizePath', () => {
    it('should not normalize path when pathPrefix is /', () => {
        i18n.pathPrefix = '/'

        const expected = '/tatayoyo'
        const actual = i18n.normalizePath('/tatayoyo')

        actual.should.be.equal(expected)
    })

    it('should normalize path when pathPrefix is /blog/', () => {
        i18n.pathPrefix = '/blog/'

        const expected = 'post-12345'
        const actual = i18n.normalizePath('/blog/post-12345')

        actual.should.be.equal(expected)
    })

    it('should call @11ty/eleventy/src/Config.getConfig only once', () => {
        i18n.pathPrefix = undefined

        const eleventyConfig = require('@11ty/eleventy/src/Config')

        const stub = sinon.stub(eleventyConfig, 'getConfig')
            .returns({ pathPrefix: '/blog/' })

        i18n.normalizePath('/blog/post-12345')
        i18n.normalizePath('/blog/post-12345')

        stub.callCount.should.be.equal(1)

        sinon.restore()
    })
})