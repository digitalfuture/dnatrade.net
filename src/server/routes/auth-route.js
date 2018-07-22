const router = require('express').Router()
const passport = require('passport')
const Poloniex = require('poloniex-api-node')

const crypto = require('../lib/crypto')
const encrypt = crypto.encrypt

const db = require('../lib/db')

const q = require('../lib/queue')
const queue = q.api
const queue3 = q.db

router.get('/checkAuth', (req, res, next) => {
  if (!req.user) {
    res.send('0')
    return
  }

  db
    .connect()
    .then(conn => {
      db.get({ table: 'users', id: req.user.id }).run(conn, (err, user) => {
        if (err) {
          console.log('Error:', err)
        }

        db.closeConnection(conn)

        if (!user) {
          res.status(200).send('0')
          return
        }

        if (!user.doc) {
          res.status(200).send('1')
          return
        }

        if (user.doc.hasData) {
          res.status(200).send('2')
          return
        }

        if (user.doc.schedule.getInitialData) {
          res.status(200).send('3')
          return
        }
      })
    })
    .then(() => next())
    .catch(err => console.log('Error:', err))
})

// Validate API keys
router.post('/validateKeys', (req, res, next) => {
  // console.log('Getting new keys.')

  const key = req.body.key
  const secret = req.body.secret

  const id = req.user.id

  queue.push(() =>
    // Check if user exists on Poloniex
    checkPoloniexUser(key, secret)
      // .then(result => console.log('Balances:', result))
      .then(() => updateKeys(key, secret, id))
      .then(() => res.status(200).send('1'))
      .then(() => console.log('New keys registered. USER ID:', id, '. Time:', new Date.toString()))
      // If user does not exist on Poloniex
      .catch(err => {
        res.send('0')
      })
  )
})

// Reset API keys
router.post('/resetKeys', (req, res, next) => {
  // console.log('Getting new keys.')

  const key = undefined
  const secret = undefined

  const id = req.user.id

  new Promise(resolve => {
    queue.push(() => {
      db.table('users').get(id).delete()
      resolve()
    })
  })
    .then(() => res.status(200).send('User erased'))
    .then(() => console.log('User erased. USER ID:', id, '. Time:', new Date().toString()))
    // If user does not exist on Poloniex
    .catch(err => res.send('0'))
})

//
// Logout
router.get('/logout', (req, res, next) => {
  const id = req.user.id

  req.logout()
  console.log('User session destroyed. Time:', new Date().toString())
  res.status(200).send('User session destroyed')
})

//
// Auth providers

// Auth with Google
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile']
  }),
  (req, res, next) => next()
)

router.get(
  '/google/redirect',
  passport.authenticate('google'),
  (req, res, next) => {
    res.redirect('/')
  }
)

// Auth with Facebook
router.get('/facebook', passport.authenticate('facebook'))

router.get(
  '/facebook/redirect',
  passport.authenticate('facebook'),
  (req, res, next) => {
    res.redirect('/')
  }
)

// Auth with Twitter
router.get('/twitter', passport.authenticate('twitter'))

router.get(
  '/twitter/redirect',
  passport.authenticate('twitter'),
  (req, res, next) => {
    res.redirect('/')
  }
)

// Functions
function checkPoloniexUser(key, secret) {
  return new Promise(resolve => {
    // console.log('Checking Poloniex user.')

    // Check user balances to understand if user exists on Poloniex
    const poloniex = new Poloniex(key, secret)

    return poloniex.returnBalances().then(balances => resolve(balances))
  })
}

function updateKeys(key, secret, id) {
  return new Promise(resolve => {
    queue3.push(() =>
      db.connect().then(conn => {
        // console.log('Updating user credentials.')

        // console.log('Key:', key)
        // console.log('Crypto key:', encrypt(key))

        return (
          db
            .update({
              table: 'users',
              id,
              doc: {
                poloniex: {
                  key: encrypt(key),
                  secret: encrypt(secret)
                },
                schedule: {
                  getInitialData: true
                }
              }
            })
            .run(conn)
            .then(() => db.closeConnection(conn))
            // .then(() => console.log('User credentials saved to DB.'))
            .then(() => resolve())
            .catch(err => console.log('Error saving user credentials to DB. USER ID:', id))
        )
      })
    )
  })
}

module.exports = router
