module.exports = getCurrencies
const db = require('../lib/db')

// Functions

// Get currencies
function getCurrencies(req, res, next) {
  db
    .get({ table: 'currencies', id: 1 })
    .run(req._rdbConn, (err, result) => res.send(JSON.stringify(result.doc)))
    .error(handleError(res))
    .finally(next)
}

// Send back a 500 error
function handleError(res) {
  return error => res.send(500, { error: error.message })
}
