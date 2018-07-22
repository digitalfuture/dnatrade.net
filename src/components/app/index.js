import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'
import VueMaterial from 'vue-material'

import app from './app.vue'

Vue.use(Vuex)

Vue.use(VueMaterial)
Vue.material.registerTheme('shades', {
  primary: {
    color: 'grey',
    hue: 500
  },
  accent: {
    color: 'blue-grey',
    hue: 500
  }
})
Vue.material.setCurrentTheme('shades')

const store = new Vuex.Store({
  state: {
    charts: {
      all: [
        {
          doc: [],
          id: 'USDT_BTC'
        }
      ],
      priceChart: {
        elem: {},
        data: []
      },
      balanceChart: {
        elem: {},
        data: []
      },
      balanceChartAll: {},
      portfolioChart: {
        elem: {},
        data: []
      },
      profitChart: {
        elem: {},
        data: []
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
      deposits: [],
      withdrawals: []
    },
    tradeHistory: {},
    isFiltered: true,
    fullTime: 0,
    isBalanceChart: false,
    isPriceChartLoading: true,
    isProfitChartLoading: true,
    isAppVisible: false,
    isAuthorized: false,
    isError: false,
    isBtcRate: false
  },
  mutations: {
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
      state.isError = true
    },
    hideError(state) {
      state.isError = false
    },
    switchToPrices(state) {
      state.charts.current = 'prices'

      Vue.nextTick(() => {
        state.charts['priceChart'].elem.reflow()
      })
    },
    switchToPortfolio(state, nextChart) {
      state.charts.current = 'portfolio'

      Vue.nextTick(() => {
        state.charts['balanceChart'].elem.reflow()
        state.charts['portfolioChart'].elem.reflow()
        state.charts['profitChart'].elem.reflow()
      })
    },
    switchPortfolio(state) {
      state.isBalanceChart = !state.isBalanceChart

      Vue.nextTick(() => {
        state.charts['balanceChart'].elem.reflow()
        state.charts['portfolioChart'].elem.reflow()
        state.charts['profitChart'].elem.reflow()
      })
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
    updatePriceChartData(state, data) {
      state.charts.priceChart.data = data
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
    },
    enableAppVisibility(state) {
      state.isAppVisible = true
    },
    disableAppVisibility(state) {
      state.isAppVisible = false
    },
    makeAppAuthorized(state) {
      state.isAuthorized = true
    },
    makeAppUnautorized(state) {
      state.isAuthorised = false
    }
  },
  actions: {
    switchToPricesAction({ commit, state }) {
      Promise.resolve(commit('switchToPrices'))
    },
    switchToPortfolioAction({ commit, state }) {
      Promise.resolve(commit('switchToPortfolio'))
    },
    switchPortfolioAction({ commit, state }) {
      Promise.resolve(commit('switchPortfolio'))
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
    updatePriceChartDataAction({ commit, state }, data) {
      return new Promise(resolve => {
        const allCharts = state.charts.all

        const baseTradeName = state.coin.baseTradeName
        const shortName = state.coin.shortName

        let pair

        switch (shortName) {
          case 'USDT':
            pair = `USDT_BTC`
            break
          default:
            pair = `${baseTradeName}_${shortName}`
        }

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

        commit('updatePriceChartData', data)
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
    updateDepositsWithdrawalsAllCurrenciesAction({ commit, state }) {
      const deposits = {}
      const withdrawals = {}
      const currencies = state.currencies

      // Get all deposits and withdrawals for every currency
      for (const currency of currencies) {
        const currencyName = currency.id

        // Get deposits
        const depositsThisCurrency = state.depositsWithdrawals.deposits.filter(
          deposit => {
            if (deposit.status.startsWith('COMPLETE')) {
              return deposit.currency === currencyName
            } else return false
          }
        )

        deposits[currencyName] = depositsThisCurrency.map(deposit => ({
          ...deposit
        }))

        // Get withdrawals
        const withdrawalsThisCurrency = state.depositsWithdrawals.withdrawals.filter(
          withdrawal => {
            if (withdrawal.status.startsWith('COMPLETE')) {
              return withdrawal.currency === currencyName
            } else return false
          }
        )

        withdrawals[currencyName] = withdrawalsThisCurrency.map(withdrawal => ({
          ...withdrawal
        }))
      }

      commit('updateDepositsWithdrawalsAllCurrencies', {
        deposits,
        withdrawals
      })
    }
  },
  getters: {
    currencyHistory(state) {
      const history = []
      const shortName = state.coin.shortName
      const deposits =
        state.depositsWithdrawalsAllCurrencies.deposits[shortName]
      const withdrawals =
        state.depositsWithdrawalsAllCurrencies.withdrawals[shortName]

      for (const pair in state.tradeHistory) {
        if (pair.includes(`_${state.coin.shortName}`)) {
          // console.log('buy:', state.tradeHistory[pair])
          for (const trade of state.tradeHistory[pair]) {
            const obj = { ...trade }
            obj.type = 'Buy'
            obj.price = obj.rate
            obj.base = pair.split(`_${state.coin.shortName}`)[0]
            history.push(obj)
          }
        }

        if (pair.includes(`${state.coin.shortName}_`)) {
          // console.log('sell:', state.tradeHistory[pair])
          for (const trade of state.tradeHistory[pair]) {
            const obj = { ...trade }
            obj.type = 'Sell'
            obj.amount = obj.total
            obj.price = 1 / obj.rate
            obj.base = pair.split(`${state.coin.shortName}_`)[1]
            history.push(obj)
          }
        }
      }

      for (const deposit in deposits) {
        const obj = { ...deposit }
        console.log('deposit:', deposit)
        // history.push(obj)
      }

      for (const withdrawal in withdrawals) {
        const obj = { ...withdrawal }
        console.log('withdrawal:', withdrawal)
        // history.push(obj)
      }

      return history
    },
    tradeHistory(state) {
      return state.tradeHistory
    },
    getCurrencies(state) {
      const currencies = state.currencies
      const balances = state.balances
      const result = []

      for (const currency of currencies) {
        const shortName = currency.id
        const doc = currency.doc

        result.push({
          shortName: shortName,
          fullName: doc.name,
          balance: +balances[shortName] || 0,
          balanceInBtc: getBalanceInBtc(shortName),
          balanceInUsdt: getBalanceInUsdt(shortName),
          priceInBtc: getPriceInBtc(shortName),
          priceInUsdt: getPriceInUsdt(shortName),
          delisted: doc.delisted
        })
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
    lastUpdateDate(state) {
      return moment
        .utc(state.fullTime)
        .clone()
        .subtract(1, 'days')
        .format('D MMM')
    },
    lastUpdateTime(state) {
      return '23:59'
    },
    priceChartData(state) {
      return state.charts.priceChart.data
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

const vm = new Vue({
  el: '#main',
  store,
  components: { app },
  render: h => h('app')
})

if (vm) console.log('Dev mode')
