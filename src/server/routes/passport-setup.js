const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const keys = require('../keys.json').passport
const db = require('../lib/db')

const queue = require('../lib/queue').db

passport.serializeUser((user, done) => done(null, user))

passport.deserializeUser((user, done) =>
  db.connect().then(conn =>
    db.get({ table: 'users', id: user }).run(conn, (err, result) => {
      done(null, result.doc)
      db.closeConnection(conn)
    })
  )
)

passport.use(
  new GoogleStrategy(
    {
      // options
      callbackURL: 'https://dnatrade.net/auth/google/redirect',
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret
    },
    (accessToken, refreshToken, data, done) => {
      const user = data.emails[0].value
      return db.connect().then(conn =>
        db
          .update({
            table: 'users',
            id: user,
            doc: {
              date: new Date()
            }
          })
          .run(conn)
          .then(() => db.closeConnection(conn))
          .then(() => done(null, user))
      )
    }
  )
)
