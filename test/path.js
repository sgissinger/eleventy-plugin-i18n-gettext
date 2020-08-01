const assert = require('assert')
const sinon = require('sinon')
const eleventyConfig = require('@11ty/eleventy/src/Config')
const i18n = require('../i18n')

describe('i18n.normalizePath()', () => {
    beforeEach(() => {
        i18n.pathPrefix = undefined
    })

    afterEach(() => {
        sinon.restore()
    })

    it('should not normalize path when pathPrefix is /', () => {
        sinon.stub(eleventyConfig, 'getConfig')
            .returns({ pathPrefix: '/' })

        const expected = '/tatayoyo'
        const actual = i18n.normalizePath('/tatayoyo')

        assert.deepStrictEqual(actual, expected)
    })

    it('should normalize path when pathPrefix is /blog/', () => {
        sinon.stub(eleventyConfig, 'getConfig')
            .returns({ pathPrefix: '/blog/' })

        const expected = 'post-12345'
        const actual = i18n.normalizePath('/blog/post-12345')

        assert.deepStrictEqual(actual, expected)
    })

    it('should call @11ty/eleventy/src/Config.getConfig() only once', () => {
        const stub = sinon.stub(eleventyConfig, 'getConfig')
            .returns({ pathPrefix: '/blog/' })

        i18n.normalizePath('/blog/post-12345')
        i18n.normalizePath('/blog/post-12345')

        assert.deepStrictEqual(stub.callCount, 1)
    })
})