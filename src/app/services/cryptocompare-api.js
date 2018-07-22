import axios from 'axios'

exports.getIcons = () => {
  const options = {
    method: 'get',
    baseURL: `https://min-api.cryptocompare.com/`,
    url: 'data/all/coinlist',
    headers: { credentials: 'same-origin' }
  }

  return axios(options)
}
