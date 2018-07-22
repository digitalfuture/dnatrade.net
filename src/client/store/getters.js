import Vue from 'vue'
import Vuex from 'vuex'

import moment from 'moment'

export default {
  getCurrencies(state) {
    const currencies = state.currencies
    const result = []

    for (const currency of currencies) {
      const shortName = currency.id
      const doc = currency.doc

      const modifiedCurrency = {
        shortName: shortName,
        fullName: doc.name,
        priceInBtc: getPriceInBtc(shortName),
        priceInUsdt: getPriceInUsdt(shortName),
        delisted: doc.delisted
      }

      result.push(modifiedCurrency)
    }

    return result.filter(currency => currency.delisted === 0)

    // Functions
    function getPriceInUsdt(shortName) {
      const prices = state.prices

      if (shortName === 'BTC') return +prices['USDT_BTC'].last
      if (shortName === 'USDT') return 1
      if (!(`BTC_${shortName}` in prices)) return 0

      const priceInUsdt =
        +prices[`BTC_${shortName}`].last * +prices['USDT_BTC'].last
      return priceInUsdt
    }

    function getPriceInBtc(shortName) {
      const prices = state.prices

      if (shortName === 'BTC') return 1
      if (shortName === 'USDT') return 1 / +prices[`USDT_BTC`].last
      if (!(`BTC_${shortName}` in prices)) return 0

      const priceInBtc = +prices[`BTC_${shortName}`].last
      return priceInBtc
    }
  },
  isCurrenciesReady(state) {
    return state.currencies.length > 0 ? true : false
  },
  currencyHistory(state) {
    const history = []
    const shortName = state.coin.shortName
    const deposits = state.depositsWithdrawalsAllCurrencies.deposits[shortName]
    const withdrawals =
      state.depositsWithdrawalsAllCurrencies.withdrawals[shortName]

    for (const pair in state.tradeHistory) {
      if (pair.includes(`_${state.coin.shortName}`)) {
        for (const trade of state.tradeHistory[pair]) {
          const row = { ...trade }
          row.date = moment.utc(row.date)
          row.type = row.type === 'buy' ? 'Buy' : 'Sell'
          row.price = row.rate
          row.base = pair.split(`_${state.coin.shortName}`)[0]
          history.push(row)
        }
      }

      if (pair.includes(`${state.coin.shortName}_`)) {
        for (const trade of state.tradeHistory[pair]) {
          const row = { ...trade }
          row.date = moment.utc(row.date)
          row.amount = row.total
          row.type = row.type === 'buy' ? 'Sell' : 'Buy'
          row.price = Math.ceil(1 / row.rate * 100000000) / 100000000
          row.base = pair.split(`${state.coin.shortName}_`)[1]
          history.push(row)
        }
      }
    }

    for (const deposit of deposits) {
      const row = { ...deposit }
      row.date = moment.unix(row.timestamp).utc()
      row.type = 'Deposit'

      if (row.status === 'COMPLETE') history.push(row)
    }

    for (const withdrawal of withdrawals) {
      const row = { ...withdrawal }
      row.date = moment.unix(row.timestamp).utc()
      row.type = 'Withdrawal'

      if (row.status.startsWith('COMPLETE')) history.push(row)
    }

    return history
      .sort((row1, row2) => {
        if (moment(row1.date).isBefore(row2.date)) return 1
        return -1
      })
      .map(row => {
        row.date = moment.utc(row.date).format('D MMM')
        return row
      })
  },
  tradeHistory(state) {
    return state.tradeHistory
  },
  getPersonalCurrencies(state) {
    const currencies = state.currencies
    const balances = state.balances
    const result = []

    for (const currency of currencies) {
      const shortName = currency.id
      const doc = currency.doc

      const modifiedCurrency = {
        shortName: shortName,
        fullName: doc.name,
        balance: +balances[shortName] || 0,
        balanceInBtc: getBalanceInBtc(shortName),
        balanceInUsdt: getBalanceInUsdt(shortName),
        priceInBtc: getPriceInBtc(shortName),
        priceInUsdt: getPriceInUsdt(shortName),
        delisted: doc.delisted
      }

      result.push(modifiedCurrency)
    }

    return result.filter(currency => currency.delisted === 0)

    // Functions
    function getPriceInUsdt(shortName) {
      const prices = state.prices

      if (shortName === 'BTC') return +prices['USDT_BTC'].last
      if (shortName === 'USDT') return 1
      if (!(`BTC_${shortName}` in prices)) return 0

      const priceInUsdt =
        +prices[`BTC_${shortName}`].last * +prices['USDT_BTC'].last
      return priceInUsdt
    }

    function getPriceInBtc(shortName) {
      const prices = state.prices

      if (shortName === 'BTC') return 1
      if (shortName === 'USDT') return 1 / +prices[`USDT_BTC`].last
      if (!(`BTC_${shortName}` in prices)) return 0

      const priceInBtc = +prices[`BTC_${shortName}`].last
      return priceInBtc
    }

    function getBalanceInBtc(shortName) {
      const balances = state.balances
      const prices = state.prices

      if (!balances.hasOwnProperty(shortName)) return 0
      if (shortName === 'BTC') return +balances['BTC']
      if (!(`BTC_${shortName}` in prices)) return 0

      const balanceInBtc =
        +balances[shortName] * +prices[`BTC_${shortName}`].last
      return balanceInBtc
    }

    function getBalanceInUsdt(shortName) {
      const balances = state.balances
      const prices = state.prices

      if (!balances.hasOwnProperty(shortName)) return 0
      if (shortName === 'BTC') {
        return getBalanceInBtc(shortName) * +prices['USDT_BTC'].last
      }
      if (shortName === 'USDT') return +balances[`USDT`]

      const balanceInUsdt =
        getBalanceInBtc(shortName) * +prices['USDT_BTC'].last
      return balanceInUsdt
    }
  },
  exchangeDate(state) {
    return moment.utc(state.fullTime).format('D MMM')
  },
  exchangeTime(state) {
    return moment.utc(state.fullTime).format('HH:mm')
  },
  priceChartBtcData(state) {
    return state.charts.priceChartBtc.data
  },
  priceChartUsdtData(state) {
    return state.charts.priceChartUsdt.data
  },
  balanceChartData(state) {
    return state.charts.balanceChart.data
  },
  portfolioChartData(state) {
    return state.charts.portfolioChart.data
  },
  profitChartData(state) {
    return state.charts.profitChart.data
  }
}
