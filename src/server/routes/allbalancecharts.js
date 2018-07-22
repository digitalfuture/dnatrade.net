module.exports = getBalanceChartAll

const db = require('../lib/db')

//  Functions

// Get all balance charts
function getBalanceChartAll(req, res, next) {
  db
    .table('balanceCharts')
    .run(req._rdbConn)
    .then(cursor =>
      cursor.toArray((err, result) => {
        res.send(JSON.stringify(result))
      })
    )
    .error(handleError(res))
    .finally(next)
}

// Send back a 500 error
function handleError(res) {
  return error => res.send(500, { error: error.message })
}
