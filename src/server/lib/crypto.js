const crypto = require('crypto')

const keys = require('../keys.json')
const password = keys.crypto.password
const algorithm = 'aes192'

// Nodejs encryption with CTR

function encrypt(text) {
  const cipher = crypto.createCipher(algorithm, password)
  let crypted = cipher.update(text, 'utf8', 'hex')
  crypted += cipher.final('hex')
  return crypted
}

function decrypt(text) {
  const decipher = crypto.createDecipher(algorithm, password)
  let decrypted = decipher.update(text, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

module.exports = {
  encrypt,
  decrypt
}
