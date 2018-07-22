import axios from 'axios'

exports.auth = {
  run(provider) {
    // Run auth providers
    switch (provider) {
      case 'google': {
        const options = {
          method: 'get',
          baseURL: `/`,
          url: 'auth/google',
          headers: { credentials: 'same-origin' }
        }

        return axios(options)
      }
    }
  }
}
