import axios from 'axios'
import moment from 'moment'

exports.getPrices = () => {
  const options = {
    method: 'get',
    baseURL: `/`,
    url: 'prices',
    headers: { credentials: 'same-origin' }
  }

  return axios(options)
}

exports.getDepositsWithdrawals = () => {
  const options = {
    method: 'get',
    baseURL: `/`,
    url: 'depositswithdrawals',
    headers: { credentials: 'same-origin' }
  }

  return axios(options)
}

exports.getCurrencies = () => {
  const options = {
    method: 'get',
    baseURL: `/`,
    url: 'currencies',
    headers: { credentials: 'same-origin' }
  }

  return axios(options)
}

exports.getBalances = () => {
  const options = {
    method: 'get',
    baseURL: `/`,
    url: 'balances',
    headers: { credentials: 'same-origin' }
  }

  return axios(options)
  // .then(response => {
  //   return response
  // })
}

exports.getCompleteBalances = () => {
  const options = {
    method: 'get',
    baseURL: `/`,
    url: 'completebalances',
    headers: { credentials: 'same-origin' }
  }

  return axios(options)
}

// exports.getChartData = (currencyPair) => {
//   const options = {
//     method: 'get',
//     baseURL: `/`,
//     url: 'chart',
//     headers: { credentials: 'same-origin' },
//     params: {
//       currencyPair,
//       period: 86400, // seconds in 1 day
//       startDate: moment().subtract(1, 'year').unix(),
//       endDate: moment().unix()
//     }
//   }

//   return axios(options)
// }

exports.getTradeHistory = (currencyPair) => {
  const options = {
    method: 'get',
    baseURL: `/`,
    url: 'history',
    headers: { credentials: 'same-origin' },
    params: {
      currencyPair,
      startDate: moment('20150101', 'YYYYMMDD').unix(),
      endDate: moment().unix()
    }
  }

  return axios(options)
}

exports.getAllChartsData = () => {
  const options = {
    method: 'get',
    baseURL: '/',
    url: 'allcharts',
    headers: { credentials: 'same-origin' }
  }

  return axios(options)
}
