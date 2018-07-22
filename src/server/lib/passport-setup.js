const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const TwitterStrategy = require('passport-twitter').Strategy
const keys = require('../keys.json').passport
const db = require('../lib/db')

const queue = require('../lib/queue').db

// Cookie session
passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) =>
  db.connect().then(conn => {
    db.get({ table: 'users', id: id }).run(conn, (err, user) => {
      done(null, user)
      db.closeConnection(conn)
    })
  })
)

// Strategies

//  Google
passport.use(
  new GoogleStrategy(
    {
      // options
      callbackURL: 'https://dnatrade.net/auth/google/redirect',
      clientID: keys.google.clientId,
      clientSecret: keys.google.clientSecret
    },
    (accessToken, refreshToken, profile, done) => {
      const id = profile.id

      db.connect().then(conn => {
        db
          .table('users')
          .filter({ googleId: id })
          .run(conn)
          .then(cursor => cursor.toArray((err, result) => checkUser(result[0])))

        // Functions
        function checkUser(user) {
          if (user) {
            done(null, user)
            db.closeConnection(conn)
          } else {
            createUser(id).then(() =>
              db
                .table('users')
                .filter({ googleId: id })
                .run(conn)
                .then(cursor =>
                  cursor.toArray((err, result) => done(null, result[0]))
                )
                .then(() => db.closeConnection(conn))
            )
          }
        }

        function createUser(userId) {
          return db
            .insert({
              table: 'users',
              doc: {
                googleId: userId,
                created: new Date()
              }
            })
            .run(conn)
        }
      })
    }
  )
)

// Facebook
passport.use(
  new FacebookStrategy(
    {
      // options
      callbackURL: 'https://dnatrade.net/auth/facebook/redirect',
      clientID: keys.facebook.appId,
      clientSecret: keys.facebook.appSecret
    },
    (accessToken, refreshToken, profile, done) => {
      const id = profile.id

      db.connect().then(conn => {
        db
          .table('users')
          .filter({ facebookId: id })
          .run(conn)
          .then(cursor => cursor.toArray((err, result) => checkUser(result[0])))

        // Functions
        function checkUser(user) {
          if (user) {
            done(null, user)
            db.closeConnection(conn)
          } else {
            createUser(id).then(() =>
              db
                .table('users')
                .filter({ facebookId: id })
                .run(conn)
                .then(cursor =>
                  cursor.toArray((err, result) => done(null, result[0]))
                )
                .then(() => db.closeConnection(conn))
            )
          }
        }

        function createUser(userId) {
          return db
            .insert({
              table: 'users',
              doc: {
                facebookId: userId,
                created: new Date()
              }
            })
            .run(conn)
        }
      })
    }
  )
)

// Twitter
passport.use(
  new TwitterStrategy(
    {
      // options
      callbackURL: 'https://dnatrade.net/auth/twitter/redirect',
      consumerKey: keys.twitter.consumerKey,
      consumerSecret: keys.twitter.consumerSecret
    },
    (accessToken, refreshToken, profile, done) => {
      const id = profile.id

      db.connect().then(conn => {
        db
          .table('users')
          .filter({ twitterId: id })
          .run(conn)
          .then(cursor => cursor.toArray((err, result) => checkUser(result[0])))

        // Functions
        function checkUser(user) {
          if (user) {
            done(null, user)
            db.closeConnection(conn)
          } else {
            createUser(id).then(() =>
              db
                .table('users')
                .filter({ twitterId: id })
                .run(conn)
                .then(cursor =>
                  cursor.toArray((err, result) => done(null, result[0]))
                )
                .then(() => db.closeConnection(conn))
            )
          }
        }

        function createUser(userId) {
          return db
            .insert({
              table: 'users',
              doc: {
                twitterId: userId,
                created: new Date()
              }
            })
            .run(conn)
        }
      })
    }
  )
)
