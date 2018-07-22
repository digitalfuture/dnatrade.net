const router = require('express').Router()
const passport = require('passport')

router.get('/check', (req, res) => {
  console.log('User:', req.user)
  if (req.user) {
    res.send('1')
  } else {
    res.send('0')
  }
})

//
// Logout
router.get('/logout', (req, res) => {
  // ToDo: handle with passport
  res.send('logging out')
})

// Auth providers
const template = `
<script type="text/javascript">
  window.opener.authenticateCallback()
  window.close()
</script>
`

// Auth with Google
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile']
  })
)

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.send(template)
})

// Auth with Facebook
router.get('/facebook', passport.authenticate('facebook'))

router.get(
  '/facebook/redirect',
  passport.authenticate('facebook'),
  (req, res) => res.send(template)
)

// Auth with Twitter
router.get('/twitter', passport.authenticate('twitter'))

router.get('/twitter/redirect', passport.authenticate('twitter'), (req, res) =>
  res.send(template)
)

module.exports = router
