const housecall = require('housecall')
const api = housecall({ concurrency: 1, cooldown: 500 })
const processes = housecall({ concurrency: 1, cooldown: 200 })
const db = housecall({ concurrency: 1, cooldown: 100 })

module.exports = {
  api,
  processes,
  db
}
