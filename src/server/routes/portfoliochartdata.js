module.exports = getPortfolioChartData
const db = require('../lib/db')

// Functions

// Get portfolio chart data
function getPortfolioChartData(req, res, next) {
  db
    .get({ table: 'portfolioChartData', id: 1 })
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
