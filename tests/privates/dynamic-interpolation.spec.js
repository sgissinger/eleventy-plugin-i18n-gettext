'use strict'

const chai = require('chai')
const i18n = require('../../dist/i18n')

chai.should()

describe('dynamic-interpolation', () => {
    it('should return a string with tokens replaced by obj properties', () => {
        const translation = '${value1} ${value2} or not ${value1} ${value2}'
        const obj = {
            value2: 'be',
            value1: 'to'
        }

        const expected = 'to be or not to be'
        const actual = i18n.dynamicInterpolation(translation, obj)

        actual.should.be.equal(expected)
    })
})