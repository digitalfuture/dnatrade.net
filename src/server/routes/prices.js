module.exports = getPrices
const db = require('../lib/db')

// Functions
// Get prices
function getPrices(req, res, next) {
  db
    .get({ table: 'prices', id: 1 })
    .run(req._rdbConn, (err, result) => {
      res.send(JSON.stringify(result.doc))
    })
    .error(handleError(res))
    .finally(next)
}

// Send back a 500 error
function handleError(res) {
  return error => res.send(500, { error: error.message })
}
