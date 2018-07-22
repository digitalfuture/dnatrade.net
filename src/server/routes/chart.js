module.exports = getChartData

// Poloniex Exchange API
const Poloniex = require('poloniex-api-node')
const keys = require('../keys.json')
const poloniex = new Poloniex(keys.key, keys.secret)
const moment = require('moment')

// Functions
function getChartData(options) {
  // Options
  const defaultOptions = {
    currencyPair: 'USDT_BTC',
    period: 86400, // seconds = 1 day
    startDate: moment()
      .subtract(1, 'year')
      .unix(),
    endDate: moment().unix()
  }

  const currencyPair = options.currencyPair || defaultOptions.currencyPair
  const period = options.period || defaultOptions.period
  const startDate = options.startDate || defaultOptions.startDate
  const endDate = options.endDate || defaultOptions.endDate

  return poloniex
    .returnChartData(currencyPair, period, startDate, endDate)
    .catch(e => console.error(e))
}
