module.exports = getDepositsWithdrawalsAllCurrencies
const db = require('../lib/db')

// Functions

// Get deposits and withdrawals
function getDepositsWithdrawalsAllCurrencies(req, res, next) {
  db
    .get({ table: 'depositsWithdrawalsAllCurrencies', id: 1 })
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
