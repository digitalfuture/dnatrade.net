module.exports = getCurrencies
const db = require('../../lib/db')

// Functions

// Get currencies
function getCurrencies(req, res, next) {
  db
    .get({ table: 'currencies', id: 'all' })
    .run(req._rdbConn, (err, result) => {
      if (err) {
        handleError(res, err)
      } else {
        res.send(JSON.stringify(result.doc))
      }

      next()
    })
}

// Send back a 500 error
function handleError(res, err) {
  res.status(500).send({ error: err.message })
}
