'use strict'

const chai = require('chai')
const sinon = require('sinon')
const i18n = require('../../i18n')
const fs = require('fs')

chai.should()

describe('enhance11tydata', () => {
    it('should have i18n properties and functions set', () => {
        i18n.init()

        const actual = i18n.enhance11tydata({}, 'en-us')

        actual.lang.should.be.a('string')
        actual.langDir.should.be.a('string')
        actual.locale.should.be.a('string')

        actual._.should.be.a('function')
        actual._i.should.be.a('function')
        actual._n.should.be.a('function')
        actual._ni.should.be.a('function')
        actual._d.should.be.a('function')
        actual._p.should.be.a('function')
    })

    it('should have i18n properties set with valid values', () => {
        i18n.init()

        const expected = {
            lang: 'fr',
            langDir: 'ltr',
            locale: 'fr-fr'
        }

        const actual = i18n.enhance11tydata({}, 'fr-fr')

        actual.lang.should.be.equal(expected.lang)
        actual.langDir.should.be.equal(expected.langDir)
        actual.locale.should.be.equal(expected.locale)
    })

    it('should use path basename to retrieve the locale', () => {
        i18n.init()

        sinon.stub(fs, 'existsSync').returns(true)

        const expected = {
            lang: 'fr',
            locale: 'fr-fr'
        }

        const actual = i18n.enhance11tydata({}, 'D:\\dummy\\eleventy-plugin-i18n-gettext-demo\\src\\fr-fr')

        actual.lang.should.be.equal(expected.lang)
        actual.locale.should.be.equal(expected.locale)

        sinon.restore()
    })

    it('should keep custom data object values', () => {
        i18n.init()

        const expected = {
            eatSnails: true,
            city: 'Paris',
            peopleCount: 2148000
        }

        const actual = i18n.enhance11tydata(expected, 'fr-fr')

        actual.eatSnails.should.be.equal(expected.eatSnails)
        actual.city.should.be.equal(expected.city)
        actual.peopleCount.should.be.equal(expected.peopleCount)
    })

    it('should throw an error when direction is invalid', () => {
        (() => {
            i18n.enhance11tydata({}, 'fr-fr', 'rtt')
        })
        .should.throw("Language direction 'rtt' is invalid. It must be 'ltr' or 'rtl'.")
    })
})