module.exports = getAllChartsData

const db = require('../lib/db')

// Functions

// Get all charts data
function getAllChartsData(req, res, next) {
  db
    .table('charts')
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
