import Vue from 'vue'
import Vuex from 'vuex'

import moment from 'moment'
import db from '../services/db'

export default {
  saveSelectedRangeToDbAction({ commit, state }, data) {
    return new Promise(resolve =>
      db.charts
        .put({ chartName: data.chartName, selectedRange: data.selectedRange })
        .then(() => {
          // console.log('Saved to DB:', {
          //   chartName: data.chartName,
          //   selectedRange: data.selectedRange
          // })
          return db.charts.get(data.chartName)
        })
        // .then(chart => {
        //   console.log('saveSelectedRangeToDbAction. Result:' + chart)
        //   console.log(
        //     'Check if data was saved to DB. chart.selectedRange:' +
        //       chart.selectedRange
        //   )
        // })
        .then(() => resolve(true))
        .catch(err => {
          console.log('Error: ' + err)
        })
    )
  },
  getSelectedRangeFromDbAction({ commit, state }, chartName) {
    return new Promise(resolve =>
      db.charts
        .get(chartName)
        .then(result => {
          if (result === undefined) {
            resolve(undefined)
          } else {
            // console.log(
            //   'getSelectedRangeFromDbAction. Result:',
            //   Object.keys(result)
            // )
            resolve(result.selectedRange)
          }
        })
        .catch(err => {
          console.log('Error: ' + err)
        })
    )
  },
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
        const prevVolumeInUsdt = index === 0 ? 0 : chart[index - 1].volumeInUsdt
        const prevProfitInUsdt = index === 0 ? 0 : chart[index - 1].profitInUsdt

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
}
