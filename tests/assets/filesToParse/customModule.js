'use strict'

module.exports = () => {
    let html = '<div class="card"><div class="card-body">'

    html += `<h4 class="card-title">${i18n._(locale, 'Banana')}</h4>`
    html += `<div class="card-text">${i18n._n(locale, 'This fruit is excellent.', 'These fruits are excellent.', fruit.count)}</div>`

    return html + '</div></div>'
}