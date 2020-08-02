'use strict'

module.exports = () => {
    const one = i18n._(locale, 'Banana (javascript)')
    const two = i18n._n(locale, 'This fruit is excellent. (javascript)', 'These fruits are excellent. (javascript)', fruit.count)

    return one + two
}