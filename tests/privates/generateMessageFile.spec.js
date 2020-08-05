'use strict'

const chai = require('chai')
const chaiFiles = require('chai-files')
const file = chaiFiles.file
const path = require('path')
const i18n = require('../../src/i18n')

chai.should()
chai.use(chaiFiles)

describe('generateMessageFile', () => {
    it('should create test-messages.js', () => {
        i18n.init({
            localesDirectory: 'tests/assets/locales',
            tokenFilePatterns: [
              'tests/assets/filesToParse/**/*.njk',
              'tests/assets/filesToParse/**/*.js'
            ],
            javascriptMessages: 'test-messages.js'
        })
        i18n.generateMessageFile()

        const actual = path.join(process.cwd(), 'tests/assets/locales', 'test-messages.js')
        const expected = path.join(process.cwd(), 'tests/assets/locales', 'expected-messages.js')

        file(actual).should.equal(file(expected))
    })
})