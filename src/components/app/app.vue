<template>
  <section>
    <app-title />

    <transition name='fade'>
      <section v-if='isAppVisible'>
        <prices v-show='charts.current == "prices"'/>
      </section>
    </transition>

    <transition name='fade'>
      <section v-if='isAuthorized'>
        <portfolio v-show='charts.current === "portfolio"'/>
      </section>
    </transition>

    <app-footer />
    <scroll-top-button />
  </section>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import _ from 'lodash'

import appTitle from './app-title.vue'
import appFooter from './app-footer.vue'
import prices from './prices.vue'
import portfolio from './portfolio.vue'
import scrollTopButton from './scroll-top-button.vue'

import {
  getBalances,
  getDepositsWithdrawals,
  getCurrencies,
  getAllChartsData,
  getTradeHistory
} from './service-public-api'

const workerpool = require('workerpool')
const pool = workerpool.pool()

//
export default {
  name: 'app',
  components: {
    appTitle,
    appFooter,
    prices,
    portfolio,
    scrollTopButton
  },
  computed: {
    ...mapState([
      'balances',
      'currencies',
      'charts',
      'isAppVisible',
      'isAuthorized',
      'isBalanceChart',
      'currencies',
      'depositsWithdrawals',
      'depositsWithdrawalsAllCurrencies',
      'tradeHistory'
    ])
  },
  methods: {
    ...mapMutations([
      'updateCurrencies',
      'updateExchangeTime',
      'enableAppVisibility',
      'updateAllChartsData',
      'showError',
      'makeAppAuthorized'
    ]),
    ...mapActions([
      'updateAllPricesAction',
      'updateBalancesAction',
      'updateTradeHistoryAction',
      'updateBalanceChartAllAction',
      'updatePortfolioChartDataAction',
      'updateProfitChartDataAction',
      'updatePriceChartDataAction',
      'updateDepositsWithdrawalsAction',
      'updateDepositsWithdrawalsAllCurrenciesAction'
    ]),

    loaderShow() {
      function animateShow(element) {
        return new Promise(resolve => {
          if (element) {
            element.classList.add('animation-show')
            // console.log('Animation Show started on element:', element)
            setTimeout(() => resolve(true), 750)
          }
        }).catch(e => console.log('Error in animateShow:', e))
      }

      function animatePulse(element) {
        return new Promise(resolve => {
          if (element) {
            element.classList.remove('animation-show')
            element.classList.add('animation-pulse')
            // console.log('Animation Pulse started on:', element)
          }
          setTimeout(() => resolve(true), 750)
        }).catch(e => console.log('Error in animatePulse:', e))
      }

      return animateShow(document.querySelector('.cloud')).then(() =>
        animatePulse(document.querySelector('.cloud'))
      )
    },

    loaderHide() {
      function animateHide(element) {
        return new Promise(resolve => {
          element.addEventListener('animationiteration', () => {
            element.classList.add('animation-hide')
            element.classList.remove('animation-pulse')
            // console.log('Animation Hide started on element:', element)
            setTimeout(() => {
              element.classList.remove('animate-hide')
              resolve(true)
            }, 750)
          })
        }).catch(e => console.log('Error in animateHide:', e))
      }

      return animateHide(document.querySelector('.cloud'))
    }
  },

  mounted() {
    this.loaderShow()
      .then(() => getAllChartsData())
      .then(response => this.updateAllChartsData(response.data))
      .then(() => this.updatePriceChartDataAction())
      .then(() => this.updateAllPricesAction())
      .then(() => getCurrencies())
      .then(response => {
        this.updateCurrencies(response.data)
        this.updateExchangeTime(response.headers.date)
      })
      .then(() => this.loaderHide())
      .then(() => this.enableAppVisibility())
      .then(() => this.loaderShow())
      .then(() => getBalances())
      .then(response => this.updateBalancesAction(response.data))
      .then(() => getTradeHistory())
      .then(response => this.updateTradeHistoryAction(response.data))
      .then(() => getDepositsWithdrawals())
      .then(response => this.updateDepositsWithdrawalsAction(response.data))
      .then(() => this.updateDepositsWithdrawalsAllCurrenciesAction())
      .then(() => {
        // updateBalanceChartAllWorker
        function updateBalanceChartAllWorker(data) {
          const state = JSON.parse(data)

          function startOfDay(date) {
            const year = new Date(date).getFullYear()
            const month = new Date(date).getMonth()
            const day = new Date(date).getDate()
            return new Date(year, month, day).getTime()
          }

          const allCharts = {}
          let usdtBtcChart

          for (const chart of state.chartsAll) {
            let id = chart.id
            allCharts[id] = {}

            for (const day of chart.doc) {
              const date = startOfDay(day.date * 1000)
              allCharts[id][date] = day
            }
          }

          usdtBtcChart = allCharts['USDT_BTC']

          const balanceChartAll = {}
          const currencies = state.currencies

          for (const currency of currencies) {
            const currencyName = currency.id

            let chart
            chart = initialDaysArray(currencyName)
            chart = calculateDepositsWithdrawalsThisCurrency(chart)
            chart = updateVolumeThisCurrency(chart)
            chart = updatePriceAndVolumeInBtcAndUsdt(chart)

            balanceChartAll[currencyName] = chart
          }

          return JSON.stringify(balanceChartAll)

          function initialDaysArray(currencyName) {
            // Initial days array
            function getDaysCount(startDate, endDate) {
              return (
                (new Date(endDate) - new Date(startDate)) / 1000 / 60 / 60 / 24
              )
            }

            const deposits = state.depositsWithdrawals.deposits
            const firstDeposit = deposits[0]
            const startTime = firstDeposit.timestamp * 1000
            const startDate = startOfDay(startTime)
            const endDate = startOfDay(new Date().getTime())
            const daysCount = getDaysCount(startDate, endDate)
            const days = []

            let date = startDate

            for (let i = 0; i < daysCount; i++) {
              const newDay = {
                date,
                dateFormatted: new Date(date),
                volume: 0,
                volumeInBtc: 0,
                volumeInUsdt: 0,
                profitInBtc: 0,
                profitInUsdt: 0,
                depositWithdrawalInBtc: 0,
                depositWithdrawalInUsdt: 0,
                currencyName
              }

              days.push(newDay)
              date += 86400000 // Add 1 day
            }

            return days.slice(-365)
          }

          function calculateDepositsWithdrawalsThisCurrency(chart) {
            // Calculate deposits and withdrawals for this currency
            let sum = 0

            for (const day of chart) {
              const currencyName = day.currencyName

              const depositsThisCurrency =
                state.depositsWithdrawalsAllCurrencies.deposits[currencyName]

              const withdrawalsThisCurrency =
                state.depositsWithdrawalsAllCurrencies.withdrawals[currencyName]

              let volume = 0

              for (const deposit of depositsThisCurrency) {
                const depositDate = startOfDay(deposit.timestamp * 1000)

                if (day.date === depositDate) {
                  volume =
                    (volume * 100000000 + Number(deposit.amount) * 100000000) /
                    100000000
                }
              }

              for (const withdrawal of withdrawalsThisCurrency) {
                const withdrawalDate = startOfDay(withdrawal.timestamp * 1000)

                if (day.date === withdrawalDate) {
                  volume =
                    (volume * 100000000 -
                      Number(withdrawal.amount) * 100000000 -
                      Number(withdrawal.fee) * 100000000) /
                    100000000
                }
              }

              day.depositWithdrawal = volume

              sum = (sum * 100000000 + volume * 100000000) / 100000000

              day.volume =
                (sum * 100000000 + Number(day.volume) * 100000000) / 100000000
            }

            return chart
          }

          function updateVolumeThisCurrency(chart) {
            // Update volume for currency
            const tradeHistory = state.tradeHistory
            const pairs = Object.keys(tradeHistory)
            const currencyName = chart[0].currencyName
            const primaryType = `${currencyName}_`
            const secondaryType = `_${currencyName}`

            for (const pair of pairs) {
              let tradeHistoryForPair = tradeHistory[pair]

              if (pair.startsWith(primaryType)) {
                let sum = 0

                for (const day of chart) {
                  let dayVolume = 0

                  for (const trade of tradeHistoryForPair) {
                    let tradeDate = startOfDay(trade.date)

                    if (day.date === tradeDate) {
                      if (trade.type === 'buy') {
                        dayVolume =
                          (dayVolume * 100000000 -
                            Number(trade.total) * 100000000) /
                          100000000
                      }

                      if (trade.type === 'sell') {
                        dayVolume =
                          (dayVolume * 100000000 +
                            Number(trade.total) * 100000000) /
                          100000000
                      }
                    }
                  }

                  sum = (sum * 100000000 + dayVolume * 100000000) / 100000000
                  day.volume =
                    (day.volume * 100000000 + sum * 100000000) / 100000000
                }
              }

              if (pair.endsWith(secondaryType)) {
                let sum = 0

                for (const day of chart) {
                  let dayVolume = 0

                  for (const trade of tradeHistoryForPair) {
                    const tradeDate = startOfDay(trade.date)

                    if (day.date === tradeDate) {
                      if (trade.type === 'buy') {
                        dayVolume =
                          (dayVolume * 100000000 +
                            Number(trade.amount) * 100000000 -
                            Number(trade.fee) * 100000000) /
                          100000000
                      }

                      if (trade.type === 'sell') {
                        dayVolume =
                          (dayVolume * 100000000 -
                            Number(trade.amount) * 100000000 -
                            Number(trade.fee) * 100000000) /
                          100000000
                      }
                    }
                  }

                  sum = (sum * 100000000 + dayVolume * 100000000) / 100000000
                  day.volume =
                    (day.volume * 100000000 + sum * 100000000) / 100000000
                }
              }
            }

            return chart
          }

          function updatePriceAndVolumeInBtcAndUsdt(chart) {
            // Update Prices in BTC and Prices in USDT
            for (const day of chart) {
              let currencyName = day.currencyName

              if (currencyName === 'BTC') {
                day.priceInBtc = 1

                day.priceInUsdt = usdtBtcChart[day.date].close
              } else if (currencyName === 'USDT') {
                day.priceInBtc =
                  1 *
                  100000000 /
                  (usdtBtcChart[day.date].close * 100000000) /
                  (100000000 * 100000000)

                day.priceInUsdt = 1
              } else {
                let pair = allCharts[`BTC_${currencyName}`]

                let pairDay = pair ? pair[day.date] : null

                if (pairDay) {
                  day.priceInBtc = pairDay.close
                } else {
                  day.priceInBtc = 0
                }

                day.priceInUsdt =
                  day.priceInBtc *
                  100000000 *
                  (usdtBtcChart[day.date].close * 100000000) /
                  (100000000 * 100000000)
              }

              day.volumeInBtc =
                day.volume *
                100000000 *
                (day.priceInBtc * 100000000) /
                (100000000 * 100000000)

              day.volumeInUsdt =
                day.volume *
                100000000 *
                (day.priceInUsdt * 100000000) /
                (100000000 * 100000000)

              day.depositWithdrawalInBtc =
                day.depositWithdrawal *
                100000000 *
                (day.priceInBtc * 100000000) /
                (100000000 * 100000000)

              day.depositWithdrawalInUsdt =
                day.depositWithdrawal *
                100000000 *
                (day.priceInUsdt * 100000000) /
                (100000000 * 100000000)
            }

            return chart
          }
        }

        const chartsAll = _.cloneDeep(this.charts.all)
        const currencies = _.cloneDeep(this.currencies)
        const depositsWithdrawalsAllCurrencies = _.cloneDeep(
          this.depositsWithdrawalsAllCurrencies
        )
        const depositsWithdrawals = _.cloneDeep(this.depositsWithdrawals)
        const tradeHistory = _.cloneDeep(this.tradeHistory)

        const state = {
          chartsAll,
          currencies,
          depositsWithdrawalsAllCurrencies,
          depositsWithdrawals,
          tradeHistory
        }

        return pool
          .exec(updateBalanceChartAllWorker, [JSON.stringify(state)])
          .then(result => this.updateBalanceChartAllAction(JSON.parse(result)))
          .catch(err => console.error(err))
          .then(() => pool.terminate()) // terminate all workers when done
      })
      .then(() => {
        // getPortfolioChartDataWorker
        function getPortfolioChartDataWorker(data) {
          function reduce(data) {
            return data.reduce((accum, day) => {
              const date = day.date
              const dateFormatted = new Date(day.date)
              const volumeInBtc =
                (accum.volumeInBtc * 100000000 + day.volumeInBtc * 100000000) /
                100000000
              const volumeInUsdt =
                (accum.volumeInUsdt * 100000000 +
                  day.volumeInUsdt * 100000000) /
                100000000
              const depositWithdrawalInBtc =
                (accum.depositWithdrawalInBtc * 100000000 +
                  day.depositWithdrawalInBtc * 100000000) /
                100000000
              const depositWithdrawalInUsdt =
                (accum.depositWithdrawalInUsdt * 100000000 +
                  day.depositWithdrawalInUsdt * 100000000) /
                100000000

              return {
                date,
                dateFormatted,
                volumeInBtc,
                volumeInUsdt,
                depositWithdrawalInBtc,
                depositWithdrawalInUsdt
              }
            })
          }

          const state = JSON.parse(data)
          const portfolioChartData = []

          const currencies = state.currencies.map(currency => currency.id)

          for (const currency of currencies) {
            const chart = state.charts.balanceChartAll[currency]

            for (let i = 0; i < chart.length; i++) {
              if (!portfolioChartData[i]) {
                // initial step
                portfolioChartData[i] = []
              }
              // next steps
              portfolioChartData[i].push(chart[i])
            }
          }

          for (let i = 0; i < portfolioChartData.length; i++) {
            portfolioChartData[i] = reduce(portfolioChartData[i])
          }

          return JSON.stringify(portfolioChartData)
        }

        const balances = _.cloneDeep(this.balances)
        const currencies = _.cloneDeep(this.currencies)
        const balanceChartAll = _.cloneDeep(this.charts.balanceChartAll)
        const state = {
          balances,
          currencies,
          charts: {
            balanceChartAll
          }
        }

        return pool
          .exec(getPortfolioChartDataWorker, [JSON.stringify(state)])
          .then(result =>
            this.updatePortfolioChartDataAction(JSON.parse(result))
          )
          .catch(err => console.error(err))
          .then(() => pool.terminate()) // terminate all workers when done
      })
      .then(() => this.updateProfitChartDataAction())
      .then(() => this.loaderHide())
      .then(() => this.makeAppAuthorized())
      .catch(e => {
        this.showError()
        console.error(e)
      })
  }
}
</script>
<style scoped>

</style>
