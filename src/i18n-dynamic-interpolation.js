// Use a separate file for this, because when used in strict mode
// eval creates variables only for the code being evaluated.
//
// https://stackoverflow.com/questions/9781285/specify-scope-for-eval-in-javascript
module.exports = (translation, obj) => {
    for (const prop in obj) {
        eval(`var ${prop} = "${obj[prop]}"`)
    }

    return eval(`\`${translation}\``)
}