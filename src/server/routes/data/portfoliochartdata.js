module.exports = getPortfolioChartData
const db = require('../../lib/db')

// Functions

// Get portfolio chart data
function getPortfolioChartData(req, res, next) {
  db
    .get({ table: 'portfolioChartData', id: req.user.id })
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
