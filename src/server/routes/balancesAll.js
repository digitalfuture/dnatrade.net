module.exports = getBalances

// Poloniex Exchange API
const Poloniex = require('poloniex-api-node')
const keys = require('../keys.json')
const poloniex = new Poloniex(keys.key, keys.secret)

// Functions
function getBalancesAll() {
  const balances = poloniex.returnBalances().catch(e => console.error(e))
}

//
//
//

function countBalances() {
  function updateBalanceChartAll(data) {
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
        return (new Date(endDate) - new Date(startDate)) / 1000 / 60 / 60 / 24
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
                    (dayVolume * 100000000 - Number(trade.total) * 100000000) /
                    100000000
                }

                if (trade.type === 'sell') {
                  dayVolume =
                    (dayVolume * 100000000 + Number(trade.total) * 100000000) /
                    100000000
                }
              }
            }

            sum = (sum * 100000000 + dayVolume * 100000000) / 100000000
            day.volume = (day.volume * 100000000 + sum * 100000000) / 100000000
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
            day.volume = (day.volume * 100000000 + sum * 100000000) / 100000000
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

  updateBalanceChartAll(state)
    .then(result => this.updateBalanceChartAll(JSON.parse(result)))
    .catch(err => console.error(err))
}
