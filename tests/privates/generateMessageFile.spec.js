'use strict'

const chai = require('chai')
const i18n = require('../../i18n')

const chaiFiles = require('chai-files')
chai.use(chaiFiles)

const file = chaiFiles.file
const path = require('path')
const fs = require('fs')

chai.should()

describe('generateMessageFile', () => {
    beforeEach(() => {
        i18n.init({
            localesDirectory: 'tests/locales',
            tokenFilePatterns: [
              'tests/src/**/*.njk',
              'tests/src/**/*.js'
            ],
            javascriptMessages: 'test-messages.js'
        })
    })

    it('should create test-messages.js', () => {
        i18n.generateMessageFile()

        const actual = path.join(process.cwd(), 'tests/locales', 'test-messages.js')
        const expected = path.join(process.cwd(), 'tests/locales', 'expected-messages.js')

        file(actual).should.equal(file(expected))

        fs.unlinkSync(actual)
    })
})