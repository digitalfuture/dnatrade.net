module.exports = getIcons

const axios = require('axios')

// Functions
// Get history
async function getIcons(req, res, next) {
  const options = {
    method: 'get',
    baseURL: `https://min-api.cryptocompare.com/`,
    url: 'data/all/coinlist'
  }

  const response = await axios(options).catch(err => handleError(res, err))

  res.status(200).send(JSON.stringify(response.data.Data))

  // next()
}

// Send back a 500 error
function handleError(res, err) {
  return res.status(500).send({ error: err.message })
}
