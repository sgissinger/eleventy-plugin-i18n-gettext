'use strict'

const chai = require('chai')
const i18n = require('../../i18n')

const chaiFiles = require('chai-files')
chai.use(chaiFiles)

const file = chaiFiles.file
const path = require('path')

chai.should()

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