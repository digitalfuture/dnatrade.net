const express = require('express')
const compression = require('compression')
const bodyParser = require('body-parser')
const path = require('path')
const serveStatic = require('serve-static')

//
const db = require('./lib/db')
const dbTasks = require('./tasks/tasks')
const queue = require('./lib/queue')
const passportSetup = require('./lib/passport-setup')
const keys = require('./keys.json')

//
const authRoute = require('./routes/auth-route')
const dataRoute = require('./routes/data-route')

//
const passport = require('passport')
const cookieSession = require('cookie-session')

//
const app = express()

// Use static files
app.use(serveStatic(path.join(__dirname, 'www'), { index: 'index.html' }))

//
app.set('env', 'production')
app.disable('x-powered-by')

//
app.use(
  cookieSession({
    maxAge: 1000 * 60 * 60 * 24 * 10, // 10 days
    keys: [keys.session.cookieKey]
  })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(compression())
app.use(bodyParser.json())
app.use(createConnection)

// Routes
app.use('/data', dataRoute)
app.use('/auth', authRoute)

//
app.use(closeConnection)

// Start
Promise.resolve(true)
  // .then(() => db.dbDrop())
  .then(() => db.dbSetup())
  .then(() =>
    app.listen(80, () =>
      console.log('Dynamic Portfolio app is listening on port 80')
    )
  )
  .then(() => dbTasks.runAll())

//
// Functions

// Send back a 500 error
function handleError(res) {
  return function(error) {
    res.send.status(500).body({ error: error.message })
  }
}

// Create a RethinkDB connection, and save it in req._rdbConn
function createConnection(req, res, next) {
  db
    .connect()
    .then(function(conn) {
      req._rdbConn = conn
      next()
    })
    .error(handleError(res))
}

// Close the RethinkDB connection
function closeConnection(req, res, next) {
  req._rdbConn.close()
}
