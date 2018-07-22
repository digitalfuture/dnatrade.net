module.exports = getAllChartsData

const db = require('../../lib/db')

// Functions

// Get all charts data
function getAllChartsData(req, res, next) {
  db
    .table('charts')
    .run(req._rdbConn)
    .then(cursor =>
      cursor.toArray((err, result) => {
        if (err) {
          handleError(res, err)
        } else {
          res.send(JSON.stringify(result))
        }
      })
    )
    .finally(next)
}

// Send back a 500 error
function handleError(res, err) {
  res.status(500).send({ error: err.message })
}
