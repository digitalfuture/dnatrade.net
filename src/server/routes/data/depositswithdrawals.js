module.exports = getDepositsWithdrawals
const db = require('../../lib/db')

// Functions

// Get deposits and withdrawals
function getDepositsWithdrawals(req, res, next) {
  db
    .get({ table: 'depositsWithdrawals', id: req.user.id })
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
