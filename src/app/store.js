import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    charts: {
      all: [
        {
          doc: [],
          id: 'USDT_BTC'
        }
      ],
      priceChartBtc: {
        elem: {},
        data: [],
        selectedRange: 1
      },
      priceChartUsdt: {
        elem: {},
        data: [],
        selectedRange: 1
      },
      balanceChart: {
        elem: {},
        data: [],
        selectedRange: 0
      },
      balanceChartAll: {},
      portfolioChart: {
        elem: {},
        data: [],
        selectedRange: 0
      },
      profitChart: {
        elem: {},
        data: [],
        selectedRange: 0
      },
      current: 'prices'
    },
    coin: {
      fullName: 'Bitcoin',
      shortName: 'BTC',
      baseTradeName: 'USDT'
    },
    prices: {},
    balances: {},
    currencies: [],
    depositsWithdrawals: {
      deposits: [],
      withdrawals: []
    },
    depositsWithdrawalsAllCurrencies: {
      deposits: {
        BTC: []
      },
      withdrawals: {
        BTC: []
      }
    },
    tradeHistory: {},
    isFiltered: false,
    fullTime: 0,
    isBalanceChart: false,
    isLoading: false,
    isBtcRate: false,
    isConnectionError: false,
    isLogin: false,
    isLogged: false,
    isAuthorized: false,
    isAuthorization: false,
    isLogging: false,
    isScheduledToUpdate: false,
    appInitialized: false,
    // cryptoIcons: {}
  },
  mutations: {
    // updateCryptoIcons(state, data) {
    //   state.cryptoIcons = data
    // },
    initApp(state) {
      state.appInitialized = true
    },
    scheduleToUpdate(state) {
      state.isScheduledToUpdate = true
    },
    scheduleToUpdateStop(state) {
      state.isScheduledToUpdate = false
    },
    startLogging(state) {
      state.isLogging = true
    },
    startAuthorization(state) {
      state.isAuthorization = true
    },
    login(state) {
      state.isLogged = true
      state.isLogging = false
    },
    logout(state) {
      state.isLogged = false
    },
    authorizeApp(state) {
      state.isLogin = false
      state.isAuthorized = true
      state.isFiltered = true
      state.charts.current = 'portfolio'

      const body = document.querySelector('body')
      body.classList.remove('no-scroll')
    },
    unAuthorizeApp(state) {
      state.isAuthorized = false
    },
    showLogin(state) {
      state.isLogin = true
      // console.log('isLogged:', state.isLogged)
      const body = document.querySelector('body')
      const main = document.querySelector('#main')
      body.classList.add('no-scroll')
    },
    hideLogin(state) {
      state.isLogin = false

      const body = document.querySelector('body')
      const main = document.querySelector('#main')
      body.classList.remove('no-scroll')
    },
    enableLoading(state) {
      state.isLoading = true
    },
    disableLoading(state) {
      state.isLoading = false
    },
    updateSelectedRange(state, { chartName, value }) {
      state.charts[chartName] = value
    },
    switchRate(state) {
      switch (state.baseTradeName) {
        case 'BTC':
          state.baseTradeName = 'USDT'
          state.isBtcRate = false
          break
        case 'USDT':
          state.isBtcRate = true
          state.baseTradeName = 'BTC'
      }

      state.isBtcRate = !state.isBtcRate
    },
    showError(state) {
      state.isConnectionError = true
    },
    hideError(state) {
      state.isConnectionError = false
    },
    switchToPrices(state) {
      state.charts.current = 'prices'

      Vue.nextTick(() => {
        if (state.charts['profitChart'].elem.reflow)
          state.charts['priceChartUsdt'].elem.reflow()
        if (state.charts['priceChartBtc'].elem.reflow)
          state.charts['priceChartBtc'].elem.reflow()
      })
    },
    switchToPortfolio(state) {
      state.charts.current = 'portfolio'

      Vue.nextTick(() => {
        if (state.charts['profitChart'].elem.reflow)
          state.charts['profitChart'].elem.reflow()
        if (state.charts['portfolioChart'].elem.reflow)
          state.charts['portfolioChart'].elem.reflow()
        if (state.charts['balanceChart'].elem.reflow)
          state.charts['balanceChart'].elem.reflow()
      })
    },
    switchPortfolio(state) {
      state.isBalanceChart = !state.isBalanceChart
    },
    updateTradeHistory(state, data) {
      state.tradeHistory = data
    },
    updateDepositsWithdrawals(state, data) {
      state.depositsWithdrawals = data
    },
    updateCoin(state, coin) {
      Object.assign(state.coin, coin)
    },
    updateCurrencies(state, currencies) {
      state.currencies = currencies
    },
    updateBalances(state, balances) {
      state.balances = balances
    },
    updateListFilter(state) {
      state.isFiltered = !state.isFiltered
    },
    updatePriceChartBtcData(state, data) {
      state.charts.priceChartBtc.data = data
    },
    updatePriceChartUsdtData(state, data) {
      state.charts.priceChartUsdt.data = data
    },
    updateBalanceChartData(state, data) {
      state.charts.balanceChart.data = data
    },
    updatePortfolioChartData(state, data) {
      state.charts.portfolioChart.data = data
    },
    updateProfitChartData(state, data) {
      state.charts.profitChart.data = data
    },
    updateAllChartsData(state, data) {
      state.charts.all = data
    },
    updateChart(state, { chartName, chartElem }) {
      state.charts[chartName].elem = chartElem
    },
    updatePrices(state, data) {
      state.prices = data
    },
    updateCompleteBalances(state, balances) {
      state.completeBalances = balances
    },
    updateBalanceChartAll(state, charts) {
      state.charts.balanceChartAll = charts
    },
    updateDepositsWithdrawalsAllCurrencies(state, data) {
      state.depositsWithdrawalsAllCurrencies = data
    },
    updateExchangeTime(state, time) {
      state.fullTime = time
    }
  },
  actions: {
    updateCurrenciesAction({ commit, state }, data) {
      return new Promise(resolve => {
        const currencies = data
        // const currencies = { ...data }
        commit('updateCurrencies', currencies)
        resolve()
      })
    },
    switchToPricesAction({ commit, state }) {
      Promise.resolve(commit('switchToPrices'))
    },
    switchToPortfolioAction({ commit, state }) {
      Promise.resolve(commit('switchToPortfolio'))
    },
    scrollToTop() {
      return new Promise(resolve => {
        window.scrollTo(0, 0)
        setTimeout(() => resolve(), 100)
      })
    },
    updateAllPricesAction({ commit, state }) {
      return new Promise(resolve => {
        const allCharts = state.charts.all

        const data = {}

        allCharts.forEach(chart => {
          data[chart.id] = { last: chart.doc[chart.doc.length - 1].close }
        })

        commit('updatePrices', data)
        resolve()
      })
    },
    updateTradeHistoryAction({ commit, state }, data) {
      return new Promise(resolve => {
        commit('updateTradeHistory', data)
        resolve()
      })
    },
    updateBalancesAction({ commit, state }, data) {
      return new Promise(resolve => {
        for (const currency in data) {
          if (+data[currency] === 0) {
            delete data[currency]
          }
        }

        commit('updateBalances', data)
        resolve()
      })
    },
    updateChartAction({ commit, state }, elem) {
      return new Promise(resolve => {
        commit('updateChart', elem)
        resolve()
      })
    },
    updatePriceChartBtcDataAction({ commit, state }, data) {
      return new Promise(resolve => {
        const allCharts = state.charts.all

        const shortName = state.coin.shortName

        let pair = `BTC_${shortName}`

        const data = allCharts
          .find(chart => chart.id === pair)
          .doc.map(day => ({ ...day }))
          .map(day => {
            day.date = moment
              .unix(day.date)
              .clone()
              .valueOf()
            return day
          })

        commit('updatePriceChartBtcData', data)
        resolve()
      })
    },
    updatePriceChartUsdtDataAction({ commit, state }, data) {
      return new Promise(resolve => {
        const allCharts = state.charts.all

        const shortName = state.coin.shortName

        let pair = `USDT_${shortName}`

        const data = allCharts
          .find(chart => chart.id === pair)
          .doc.map(day => ({ ...day }))
          .map(day => {
            day.date = moment
              .unix(day.date)
              .clone()
              .valueOf()
            return day
          })

        commit('updatePriceChartUsdtData', data)
        resolve()
      })
    },
    updateBalanceChartDataAction({ commit, state }) {
      return new Promise(resolve => {
        const balanceChartAll = state.charts.balanceChartAll
        const currencyName = state.coin.shortName

        const data = balanceChartAll[currencyName].map(day => ({ ...day }))

        commit('updateBalanceChartData', data)
        resolve()
      })
    },
    updateBalanceChartAllAction({ commit, state }, data) {
      return new Promise(resolve => {
        commit('updateBalanceChartAll', data)
        resolve()
      })
    },
    updatePortfolioChartDataAction({ commit, state }, data) {
      return new Promise(resolve => {
        commit('updatePortfolioChartData', data)
        resolve()
      })
    },
    updateProfitChartDataAction({ commit, state }) {
      const data = state.charts.portfolioChart.data
        .map(day => ({ ...day }))
        .map((day, index, chart) => {
          const depositWithdrawalInBtc = day.depositWithdrawalInBtc
          const volumeInBtc = day.volumeInBtc
          const prevVolumeInBtc = index === 0 ? 0 : chart[index - 1].volumeInBtc
          const prevProfitInBtc = index === 0 ? 0 : chart[index - 1].profitInBtc

          day.profitInBtc =
            (volumeInBtc * 100000000 -
              prevVolumeInBtc * 100000000 -
              depositWithdrawalInBtc * 100000000 +
              prevProfitInBtc * 100000000) /
            100000000

          const depositWithdrawalInUsdt = day.depositWithdrawalInUsdt
          const volumeInUsdt = day.volumeInUsdt
          const prevVolumeInUsdt =
            index === 0 ? 0 : chart[index - 1].volumeInUsdt
          const prevProfitInUsdt =
            index === 0 ? 0 : chart[index - 1].profitInUsdt

          day.profitInUsdt =
            (volumeInUsdt * 100000000 -
              prevVolumeInUsdt * 100000000 -
              depositWithdrawalInUsdt * 100000000 +
              prevProfitInUsdt * 100000000) /
            100000000

          return day
        })

      return new Promise(resolve => {
        commit('updateProfitChartData', data)
        resolve()
      })
    },
    updateDepositsWithdrawalsAction({ commit, state }, data) {
      return new Promise(resolve => {
        commit('updateDepositsWithdrawals', data)
        resolve()
      })
    },
    updateDepositsWithdrawalsAllCurrenciesAction({ commit, state }, data) {
      return new Promise(resolve => {
        commit('updateDepositsWithdrawalsAllCurrencies', data)
        resolve()
      })
    }
  },
  getters: {
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
      const deposits =
        state.depositsWithdrawalsAllCurrencies.deposits[shortName]
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
})

const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB
const IDBTransaction =
  window.IDBTransaction ||
  window.webkitIDBTransaction ||
  window.msIDBTransaction

function connectDB(f) {
  const request = indexedDB.open('App', 1)

  request.onerror = function(err) {
    console.log(err)
  }

  request.onsuccess = function() {
    // При успешном открытии вызвали коллбэк передав ему объект БД
    // On successfull opened DB call the callback with DB object passed there
    f(request.result)
  }

  request.onupgradeneeded = function(e) {
    // Create store if DB still doesen't exist
    e.currentTarget.result.createObjectStore('objectStore', {
      keyPath: 'key'
    })
    connectDB(f)
  }
}
