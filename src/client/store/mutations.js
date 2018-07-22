import Vue from 'vue'
import Vuex from 'vuex'

import db from '../services/db'

export default {
  finishCheckingAuth(state) {
    state.isAuthChecked = true
  },
  updateState(state, data) {
    Object.assign(state, data)
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
  authorizeApp(state) {
    state.isLogin = false
    state.isAuthorized = true
    state.isAuthorization = false
    state.isFiltered = true

    const body = document.querySelector('body')
    body.classList.remove('no-scroll')
  },
  unAuthorizeApp(state) {
    state.isAuthorized = false
  },
  showLogout(state) {
    state.isLogout = true
    // console.log('isLogged:', state.isLogged)
    const body = document.querySelector('body')
    const main = document.querySelector('#main')
    body.classList.add('no-scroll')
  },
  hideLogout(state) {
    state.isLogout = false

    const body = document.querySelector('body')
    const main = document.querySelector('#main')
    body.classList.remove('no-scroll')
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
  showResetKeys(state) {
    state.isResetKeys = true
  },
  hideResetKeys(state) {
    state.isResetKeys = false
  },
  enableLoading(state) {
    state.isLoading = true
  },
  disableLoading(state) {
    state.isLoading = false
  },
  updateSelectedRange(state, { chartName, selectedRange }) {
    state.charts[chartName].selectedRange = selectedRange
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
  updateRate(state, data) {
    state.isBtcRate = data
  },
  showError(state, err) {
    state.isConnectionError = true
    console.log('Error:', err)
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

      window.scrollTo(0, 0)
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

      window.scrollTo(0, 0)
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
  updateCoin(state, data) {
    Object.assign(state.coin, data)
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
}
