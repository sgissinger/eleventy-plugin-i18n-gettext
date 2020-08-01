'use strict'

const chai = require('chai')
const dynamic_interpolation = require('../../i18n-dynamic-interpolation')

chai.should()

describe('dynamic-interpolation', () => {
    it('should return a string with tokens replaced by obj properties', () => {
        const translation = '${value1} ${value2} or not ${value1} ${value2}'
        const obj = {
            value2: 'be',
            value1: 'to'
        }

        const expected = 'to be or not to be'
        const actual = dynamic_interpolation(translation, obj)

        actual.should.be.equal(expected)
    })
})