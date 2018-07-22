// Poloniex Exchange API
const Poloniex = require('poloniex-api-node')

// API requests
//
function getDepositsWithdrawals(key, secret) {
  // console.log('> Getting deposits and withdrawals from Poloniex API.')

  const startDate = moment('20150101', 'YYYYMMDD').unix()
  const endDate = moment().unix()

  const poloniex = new Poloniex(key, secret)

  return poloniex.returnDepositsWithdrawals(startDate, endDate)
}

function getCurrencies(key, secret) {
  // console.log('> Getting currencies from Poloniex API.')
  const poloniex = new Poloniex(key, secret)

  return poloniex
    .returnCurrencies()
    .catch(e =>
      console.error('Error getting currencies from Poloniex API:', e.message)
    )
}

function getChart(currencyPair, key, secret) {
  // console.log('> Getting chart from Poloniex API. Pair:', currencyPair)

  const period = 86400 // 86400 seconds == 1 day
  const startDate = moment()
    .subtract(1, 'year')
    .unix()
  const endDate = moment().unix()

  const poloniex = new Poloniex(key, secret)

  return poloniex
    .returnChartData(currencyPair, period, startDate, endDate)
    .catch(e => console.error(e))
}

function getTicker(key, secret) {
  // console.log('> Getting prices from Poloniex API.')
  const poloniex = new Poloniex(key, secret)

  return poloniex
    .returnTicker()
    .catch(err => console.error('Error getting prices:', err.message))
}

function getBalances(key, secret) {
  // console.log('> Getting balances from Poloniex API.')
  const poloniex = new Poloniex(key, secret)

  return poloniex
    .returnBalances()
    .catch(err => console.error('Error getting balances:', err.message))
}

function getTradeHistory(key, secret) {
  // console.log('> Getting trading history from Poloniex API.')

  const currencyPair = 'all'
  const startDate = moment('20150101', 'YYYYMMDD').unix()
  const endDate = moment().unix()

  const poloniex = new Poloniex(key, secret)

  return poloniex
    .returnMyTradeHistory(currencyPair, startDate, endDate)
    .catch(err => console.error('Error getting history:', err.message))
}

module.exports = {
  getDepositsWithdrawals,
  getCurrencies,
  getChart,
  getTicker,
  getBalances,
  getTradeHistory
}
