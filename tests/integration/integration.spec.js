'use strict'

const chai = require('chai')
const process = require('child_process')

const chaiFiles = require('chai-files')
chai.use(chaiFiles)

const file = chaiFiles.file
const path = require('path')
const glob = require('glob')

chai.should()

describe('integration', () => {
    beforeEach(() => {
        process.execSync('npm install', { cwd: __dirname } )
        process.execSync('npm run build', { cwd: __dirname } )
    })

    it('should compare built files count', () => {
        const expectedDistDir = path.join(__dirname, 'expected-dist')
        const expected = glob.sync(path.join(expectedDistDir, '**/*.html')).length
        
        const actualDistDir = path.join(__dirname, 'dist')
        const actual = glob.sync(path.join(actualDistDir, '**/*.html')).length

        actual.should.be.equal(expected)
    })

    it('should compare built files content', () => {
        const expectedDistDir = path.join(__dirname, 'expected-dist')

        glob.sync(path.join(expectedDistDir, '**/*.html'))
            .map(expected => {
                const actual = expected.replace('expected-', '')

                file(actual).should.equal(file(expected))
            })
    })
})