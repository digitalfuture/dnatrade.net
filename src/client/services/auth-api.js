import axios from 'axios'

exports.authenticate = provider => {
  const options = {
    method: 'get',
    baseURL: `/`,
    url: 'auth/' + provider
  }

  return axios(options)
}

exports.logout = () => {
  const options = {
    method: 'get',
    baseURL: `/`,
    url: 'auth/logout'
  }

  return axios(options)
}

exports.resetKeys = () => {
  const options = {
    method: 'get',
    baseURL: `/`,
    url: 'auth/resetKeys'
  }

  return axios(options)
}

exports.checkAuth = () => {
  const options = {
    method: 'get',
    baseURL: `/`,
    url: 'auth/checkAuth',
    headers: {
      credentials: 'same-origin'
    }
  }

  return axios(options)
}

exports.validateKeys = (key, secret) => {
  const options = {
    method: 'post',
    data: {
      key,
      secret
    },
    baseURL: `/`,
    url: 'auth/validateKeys',
    headers: {
      credentials: 'same-origin'
    }
  }

  return axios(options)
}
