const Poloniex = require('poloniex-api-node')

const keys = require('../keys.json')
const privateKey = keys.poloniex.key
const privateSecret = keys.poloniex.secret

const crypto = require('../lib/crypto')
const decrypt = crypto.decrypt

const moment = require('moment')

const db = require('../lib/db')

const q = require('../lib/queue')
const queue = q.api
const queue2 = q.processes
const queue3 = q.db

function sharedDataLoop() {
  return getSharedData(privateKey, privateSecret)
}

function userDataLoop() {
  return getUsers().then(users => processAllUsers(users))

  // Functions
  async function processAllUsers(users) {
    console.log('USERS count:', users.length)
    for (const user of users) {
      await getUserData(user)
    }
  }
}

async function runAll() {
  let counter = 0
  console.log(' [*] DATA LOOP is started. Counter:', counter)
  while (true) {
    await new Promise(resolve =>
      queue2.push(() =>
        sharedDataLoop()
          .then(() => userDataLoop())
          .then(() =>
            console.log(' [*] DATA LOOP is finished. Counter:', ++counter)
          )
          .then(() => resolve())
          .catch(err =>
            console.log('Error in the Data loop. Error:', err.message)
          )
      )
    )
  }
}

// Functions
// Setup Users
function getUsers() {
  return new Promise(resolve => {
    db.connect().then(conn => {
      db
        .table('users')
        .run(conn)
        .then(cursor =>
          cursor.toArray((err, result) => {
            if (err) {
              // console.log('Input String:', decrypt(user.doc.poloniex.key), 'Secret:', secret)
              console.log('Error:', err)
            }

            const users = result.filter(user => user.doc).map(user => {
              return {
                id: user.id,
                key: decrypt(user.doc.poloniex.key),
                secret: decrypt(user.doc.poloniex.secret)
              }
            })

            db.closeConnection(conn)
            resolve(users)
          })
        )
        .catch(err =>
          console.error('Error getting users from DB:', err.message)
        )
    })
  })
}

// Get data
function getSharedData(key, secret) {
  return Promise.resolve(
    console.info('Shared Data loop is STARTED. Time:', new Date().toString())
  )
    .then(() => setupCurrencies())
    .then(() => setupPrices())
    .then(() => setupCharts())
    .then(() =>
      console.info('Shared Data loop is FINISHED. Time:', new Date().toString())
    )
}

function getUserData({ id, key, secret }) {
  return Promise.resolve(
    console.info('User Data loop is STARTED. Time:', new Date().toString())
  )
    .then(() => setupDepositsWithdrawals(id, key, secret))
    .then(() => setupBalances(id, key, secret))
    .then(() => setupHistory(id, key, secret))
    .then(() => setupBalanceCharts(id, key, secret))
    .then(() => setupPortfolioChartData(id, key, secret))
    .then(() =>
      db.connect().then(conn =>
        db
          .update({
            table: 'users',
            id,
            doc: {
              hasData: true,
              schedule: {
                getInitialData: false
              }
            }
          })
          .run(conn)
          .then(() => db.closeConnection(conn))
      )
    )
    .then(() =>
      console.info('User Data loop is FINISHED. Time:', new Date().toString())
    )
    .catch(err => console.log('Error updaing user. Error:', err))
}

//
// Setup Data
//
// Shared data
function setupCurrencies(id, key, secret) {
  console.log('Running Setup currencies task')

  return processAllCurrencies()

  function processAllCurrencies() {
    return new Promise(resolve => {
      queue.push(() =>
        getCurrencies(key, secret).then(data =>
          queue3.push(() =>
            db.connect().then(conn => {
              const currencies = []
              const keys = Object.keys(data)

              for (const currency of keys) {
                if (!data[currency].delisted)
                  currencies.push({ id: currency, doc: data[currency] })
              }

              console.log(
                ' >> Inserting data to currencies table. Length:',
                currencies.length
              )

              return db
                .upsert({
                  table: 'currencies',
                  doc: currencies,
                  id: 'all'
                })
                .run(conn)
                .then(() => db.closeConnection(conn))
                .then(() => resolve())
                .catch(err =>
                  console.error('Error inserting currency to DB:', err.message)
                )
            })
          )
        )
      )
    }).catch(err => console.error('Error procssing currencies.', err.message))
  }
}

function setupPrices(id, key, secret) {
  console.log('Running Setup prices task')

  return processPrices()

  // Functions
  function processPrices() {
    return new Promise(resolve => {
      queue.push(() =>
        getTicker().then(data =>
          db.connect().then(conn => {
            queue3.push(() => {
              console.log(' >> Inserting data to prices table.')

              const pairs = Object.keys(data)
              const prices = {}

              pairs.forEach(pair => {
                prices[pair] = data[pair]
              })

              return db
                .upsert({
                  table: 'prices',
                  doc: prices,
                  id: 'all'
                })
                .run(conn)
                .then(() => db.closeConnection(conn))
                .then(() => resolve())
                .catch(err =>
                  console.error('Error inserting prices to DB:', err.message)
                )
            })
          })
        )
      )
    }).catch(err => console.error('Error processing prices.', err.message))
  }
}

function setupCharts(id, key, secret) {
  console.log('Running Setup charts task')

  let pairs
  let usdtBtcChart
  const promises = []

  return new Promise(resolve => {
    return db
      .connect()
      .then(
      conn =>
        new Promise(resolve =>
          db.get({ table: 'prices', id: 'all' }).run(conn, (err, result) => {
            pairs = Object.keys(result.doc).filter(pair =>
              pair.startsWith('BTC_')
            )

            db.closeConnection(conn)
            resolve()
          })
        )
      )
      .then(() => processUsdtBtc())
      .then(() => {
        console.log(' >> Inserting data to charts table.')

        return processAllPairs(pairs)
      })
      .then(() => resolve())
      .catch(err => console.error('Error processing charts:', err.message))
  }).catch(err => console.error('Error processing charts.', err.message))

  // Functions
  async function processAllPairs(pairs) {
    for (const pair of pairs) {
      await processPair(pair)
    }
  }

  function processUsdtBtc() {
    return new Promise(resolve => {
      queue.push(() =>
        getChart('USDT_BTC', key, secret).then(chart => {
          usdtBtcChart = chart

          queue3.push(() =>
            db.connect().then(conn => {
              // console.log(
              //   ' >> Inserting data to charts table. Pair: USDT_BTC'
              // )

              db
                .upsert({
                  table: 'charts',
                  doc: usdtBtcChart.map(day => ({
                    open: day.open,
                    high: day.high,
                    low: day.low,
                    close: day.close,
                    volume: day.volume,
                    date: day.date
                  })),
                  id: 'USDT_BTC'
                })
                .run(conn)
                .then(() =>
                  db
                    .upsert({
                      table: 'charts',
                      doc: usdtBtcChart.map(day => ({
                        open: 1 / day.open,
                        high: 1 / day.high,
                        low: 1 / day.low,
                        close: 1 / day.close,
                        volume: 1 / day.volume,
                        date: day.date
                      })),
                      id: 'BTC_USDT'
                    })
                    .run(conn)
                )
                .then(() =>
                  db
                    .upsert({
                      table: 'charts',
                      doc: usdtBtcChart.map(day => ({
                        open: 1,
                        high: 1,
                        low: 1,
                        close: 1,
                        volume: day.volume,
                        date: day.date
                      })),
                      id: 'BTC_BTC'
                    })
                    .run(conn)
                )
                .then(() =>
                  db
                    .upsert({
                      table: 'charts',
                      doc: usdtBtcChart.map(day => ({
                        open: 1,
                        high: 1,
                        low: 1,
                        close: 1,
                        volume: 1 / day.volume,
                        date: day.date
                      })),
                      id: 'USDT_USDT'
                    })
                    .run(conn)
                )
                .then(() => db.closeConnection(conn))
                .then(() => resolve())
            })
          )
        })
      )
    })
  }

  function processPair(pairBtc) {
    // console.log('Processing pair:', pairBtc)

    let btcCurrencyChart

    return processBtcPair().then(() => processUsdtPair())

    // Functions
    function processBtcPair() {
      // console.log('processBtcPair')

      return new Promise(resolve => {
        queue.push(() => {
          getChart(pairBtc, key, secret)
            .then(chart => {
              btcCurrencyChart = chart

              queue3.push(
                () =>
                  new Promise(resolve =>
                    db.connect().then(conn => {
                      // console.log(
                      //   ' >> Inserting data to charts table. Pair:',
                      //   pairBtc
                      // )
                      if (!Array.isArray(btcCurrencyChart)) {
                        db.closeConnection(conn)
                        resolve()
                      }

                      return db
                        .upsert({
                          table: 'charts',
                          doc: btcCurrencyChart.map(day => ({
                            open: day.open,
                            high: day.high,
                            low: day.low,
                            close: day.close,
                            volume: day.volume,
                            date: day.date
                          })),
                          id: pairBtc
                        })
                        .run(conn)
                        .then(() => db.closeConnection(conn))
                        .then(() => resolve())
                        .catch(err =>
                          console.error(
                            'Error inserting BTC chart to DB:',
                            err.message
                          )
                        )
                    })
                      .catch(err =>
                        console.error(
                          'Error in queue of inserting BTC chart to DB:',
                          err.message
                        )
                      )
                  )
              )
            })
            .then(() => resolve())
            .catch(err =>
              console.error(
                'Error processing BTC pair:',
                pairBtc,
                'Error:',
                err.message
              )
            )
        })
      })
    }

    function processUsdtPair() {
      // console.log('processUsdtPair')

      return new Promise(resolve => {
        queue3.push(() =>
          db
            .connect()
            .then(conn => {
              //
              const currency = pairBtc.split('_')[1]
              const pairUsdt = `USDT_${currency}`

              // console.log(
              //   ' >> Inserting data to charts table. Pair:',
              //   pairUsdt
              // )

              const usdtCurrencyChart = []

              // One year chart
              for (const day of btcCurrencyChart) {
                const usdtBtcDay = usdtBtcChart.find(
                  row => row.date === day.date
                )

                if (usdtBtcDay === undefined) continue

                const usdtCurrencyDay = {
                  open:
                    Math.ceil(usdtBtcDay.open * day.open * 100000000) /
                    100000000,
                  high:
                    Math.ceil(usdtBtcDay.high * day.high * 100000000) /
                    100000000,
                  low:
                    Math.ceil(usdtBtcDay.low * day.low * 100000000) / 100000000,
                  close:
                    Math.ceil(usdtBtcDay.close * day.close * 100000000) /
                    100000000,
                  volume:
                    Math.ceil(usdtBtcDay.close * day.volume * 100000000) /
                    100000000,
                  date: usdtBtcDay.date
                }

                usdtCurrencyChart.push(usdtCurrencyDay)
              }

              return db
                .upsert({
                  table: 'charts',
                  doc: usdtCurrencyChart,
                  id: pairUsdt
                })
                .run(conn)
                .catch(err =>
                  console.error('Error inserting chart to DB:', err.message)
                )
                .then(() => db.closeConnection(conn))
            })
            .then(() => resolve())
            .catch(err =>
              console.error(
                'Error processing USDT pair:',
                pairBtc,
                'Error:',
                err.message
              )
            )
        )
      })
    }
  }
}

// User data
function setupDepositsWithdrawals(id, key, secret) {
  console.log('Running Setup deposits and withdrawals task')

  return processDepositsWithdrawals()

  // Functions
  function processDepositsWithdrawals() {
    return new Promise(resolve => {
      queue.push(() =>
        getDepositsWithdrawals(key, secret)
          .then(depositsWithdrawals =>
            queue3.push(() => {
              db.connect().then(conn => {
                console.log(' >> Inserting data to depositsWithdrawals table.')

                db
                  .upsert({
                    table: 'depositsWithdrawals',
                    doc: depositsWithdrawals,
                    id // User ID
                  })
                  .run(conn)
                  .then(() => db.closeConnection(conn))
                  //
                  .then(() => processDepositsWithdrawalsAllCurrencies(resolve))
                  .catch(err =>
                    console.error(
                      'Error inserting deposits and withdrawals to DB:',
                      err.message
                    )
                  )
              })
            })
          )
          .catch(err =>
            console.error(
              'Error processing deposits and withdrawals:',
              err.message
            )
          )
      )

      // Functions
      function processDepositsWithdrawalsAllCurrencies() {
        const deposits = {}
        const withdrawals = {}
        let currencies
        let depositsWithdrawals

        db
          .connect()
          .then(conn =>
            db
              .get({ table: 'currencies', id: 'all' })
              .run(conn, (err, result) => {
                currencies = result.doc
                db.closeConnection(conn)
              })
          )
          .catch(err =>
            console.error('Error getting currencies from DB:', err.message)
          )
          .then(() => db.connect())
          .then(conn =>
            db
              .get({
                table: 'depositsWithdrawals',
                id // User ID
              })
              .run(conn, (err, result) => {
                depositsWithdrawals = result.doc
                db.closeConnection(conn)
              })
          )
          .catch(err =>
            console.error(
              'Error getting deposits and withdrawals from DB:',
              err.message
            )
          )
          .then(() => {
            // Get all deposits and withdrawals for every currency
            for (const currency of currencies) {
              const currencyName = currency.id

              // Get deposits
              const depositsThisCurrency = depositsWithdrawals.deposits.filter(
                deposit => {
                  if (deposit.status.startsWith('COMPLETE')) {
                    return deposit.currency === currencyName
                  } else return false
                }
              )

              deposits[currencyName] = depositsThisCurrency

              // Get withdrawals
              const withdrawalsThisCurrency = depositsWithdrawals.withdrawals.filter(
                withdrawal => {
                  if (withdrawal.status.startsWith('COMPLETE')) {
                    return withdrawal.currency === currencyName
                  } else return false
                }
              )

              withdrawals[currencyName] = withdrawalsThisCurrency
            }

            return { deposits, withdrawals }
          })
          .then(depositsWithdrawalsAllCurrencies =>
            queue3.push(() =>
              db.connect().then(conn =>
                db
                  .upsert({
                    table: 'depositsWithdrawalsAllCurrencies',
                    doc: depositsWithdrawalsAllCurrencies,
                    id // User ID
                  })
                  .run(conn)
                  .then(() => db.closeConnection(conn))
                  .then(() => resolve())
                  .catch(err =>
                    console.error(
                      'Error inserting deposits and withdrawals for all currencies to DB:',
                      err.message
                    )
                  )
              )
            )
          )
          .then(() => resolve())
          .catch(err =>
            console.error(
              'Error processing deposits and withdrawals for all currencies: Error',
              err.message
            )
          )
      }
    }).catch(err =>
      console.error('Error processing deposits and withdrawals.', err.message)
      )
  }
}

function setupBalances(id, key, secret) {
  console.log('Running Setup balances task')

  return processBalances()

  function processBalances() {
    return new Promise(resolve => {
      queue.push(() =>
        getBalances(key, secret).then(balances =>
          db.connect().then(conn => {
            queue3.push(() => {
              console.log(' >> Inserting data to balances table.')

              db
                .upsert({
                  table: 'balances',
                  doc: balances,
                  id // User ID
                })
                .run(conn)
                .then(() => db.closeConnection(conn))
                .then(() => resolve())
                .catch(err =>
                  console.error('Error inserting balances to DB:', err.message)
                )
            })
          })
        )
      )
    }).catch(err => console.error('Error processing balanes.', err.message))
  }
}

function setupHistory(id, key, secret) {
  console.log('Running Setup history task')

  return processHistory()

  function processHistory() {
    return new Promise(resolve => {
      queue.push(() =>
        getTradeHistory(key, secret).then(history =>
          db.connect().then(conn => {
            queue3.push(() => {
              console.log(' >> Inserting data to history table.')

              return db
                .upsert({
                  table: 'history',
                  doc: history,
                  id // User ID
                })
                .run(conn)
                .then(() => db.closeConnection(conn))
                .then(() => resolve())
                .catch(err =>
                  console.error('Error inserting prices to DB:', err.message)
                )
            })
          })
        )
      )
    }).catch(err => console.error('Error processing history.', err.message))
  }
}

function setupBalanceCharts(id, key, secret) {
  console.log('Running Setup balance charts task')

  let chartsAll
  let currencies
  let depositsWithdrawals
  let depositsWithdrawalsAllCurrencies
  let tradeHistory

  return new Promise(resolve =>
    db
      .connect()
      .then(conn =>
        db
          .table('charts')
          .run(conn)
          .then(
          cursor =>
            new Promise(resolve => {
              cursor.toArray((err, result) => {
                chartsAll = result

                // console.log('charts: OK')
                resolve()
              })
            })
          )
          .then(() => db.closeConnection(conn))
          .catch(err =>
            console.error('Error getting charts from DB:', err.message)
          )
      )
      //
      .then(() => db.connect())
      .then(
      conn =>
        new Promise(resolve => {
          db
            .get({
              table: 'currencies',
              id: 'all'
            })
            .run(conn, (err, result) => {
              currencies = result.doc

              // console.log('currencies: OK')

              db.closeConnection(conn)
              resolve()
            })
        })
      )
      //
      .then(() => db.connect())
      .then(
      conn =>
        new Promise(resolve => {
          db
            .get({
              table: 'depositsWithdrawals',
              id // User ID
            })
            .run(conn, (err, result) => {
              depositsWithdrawals = result.doc

              // console.log('depositsWithdrawals: OK')

              db.closeConnection(conn)
              resolve()
            })
        })
      )
      //
      .then(() => db.connect())
      .then(
      conn =>
        new Promise(resolve => {
          db
            .get({
              table: 'depositsWithdrawalsAllCurrencies',
              id // User ID
            })
            .run(conn, (err, result) => {
              depositsWithdrawalsAllCurrencies = result.doc

              // console.log('depositsWithdrawalsAllCurrencies: OK')

              db.closeConnection(conn)
              resolve()
            })
        })
      )
      //
      .then(() => db.connect())
      .then(
      conn =>
        new Promise(resolve => {
          db
            .get({
              table: 'history',
              id // User ID
            })
            .run(conn, (err, result) => {
              tradeHistory = result.doc

              // console.log('tradeHistory: OK')

              db.closeConnection(conn)
              resolve()
            })
        })
      )
      //
      .catch(err =>
        console.error('Error getting data for all balance charts:', err.message)
      )
      //
      .then(() => ({
        chartsAll,
        currencies,
        depositsWithdrawalsAllCurrencies,
        depositsWithdrawals,
        tradeHistory
      }))
      .then(state => updateBalanceChartAll(state))
      .then(charts => {
        //
        console.log(' >> Inserting data to balanceCharts table.')

        return insertAllBalanceCharts(charts)
        // Functions
        async function insertAllBalanceCharts(balanceCharts) {
          for (const currency in balanceCharts) {
            await new Promise(resolve => {
              queue3.push(() => {
                // console.log(
                //   'Inserting data to balanceCharts table. Currency:',
                //   currency
                // )

                return db.connect().then(conn =>
                  db
                    .update({
                      table: 'balanceCharts',
                      doc: { [currency]: balanceCharts[currency] },
                      id
                    })
                    .run(conn)
                    .then(() => db.closeConnection(conn))
                    .then(() => resolve())
                    .catch(err =>
                      console.error(
                        'Error inserting balance charts to DB. Error:',
                        err
                      )
                    )
                )
              })
            }).catch(err =>
              console.error('Error inserting balance chart:', err.message)
              )
          }
        }
        //
      })
      .then(() => resolve())
      .catch(err =>
        console.error('Error processing balance charts:', err)
      )
  ).catch(err =>
    console.error('Error processing baalance charts.', err.message)
    )

  //  Functions
  function updateBalanceChartAll(state) {
    // console.log(' >>> updateBalanceChartAll')

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
    let counter = 0
    for (const currency of currencies) {
      // console.log('---> Currency:', currency, ' Counter:', ++counter)

      const currencyName = currency.id

      let chart
      chart = initialDaysArray(currencyName)
      chart = calculateDepositsWithdrawalsThisCurrency(chart)
      chart = updateVolumeThisCurrency(chart)
      chart = updatePriceAndVolumeInBtcAndUsdt(chart)

      balanceChartAll[currencyName] = chart
    }

    return balanceChartAll

    //  Functions
    function startOfDay(date) {
      const year = new Date(date).getFullYear()
      const month = new Date(date).getMonth()
      const day = new Date(date).getDate()
      return new Date(year, month, day).getTime()
    }

    function initialDaysArray(currencyName) {
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

      //  Functions
      function getDaysCount(startDate, endDate) {
        return (new Date(endDate) - new Date(startDate)) / 86400000 + 1
      }
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
                    (dayVolume * 100000000 + Number(trade.amount) * 100000000) /
                    100000000
                }

                if (trade.type === 'sell') {
                  dayVolume =
                    (dayVolume * 100000000 - Number(trade.amount) * 100000000) /
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
        if (!usdtBtcChart[day.date]) continue

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
}

function setupPortfolioChartData(id, key, secret) {
  console.log('Running Setup portfolio сhart data task.')

  return processPortfolioChartData()

  // Functions
  function processPortfolioChartData() {
    let balances
    let currencies
    let charts
    let state

    return getDataFromDb()
      .then(() => processAllData())
      .catch(err =>
        console.error('Error processing portfolio chart.', err.message)
      )

    // Functions
    function getDataFromDb() {
      return new Promise(resolve =>
        db
          .connect()
          .then(conn => {
            // console.log(' > Getting data from DB.')

            db
              .get({
                table: 'balances',
                id // User ID
              })
              .run(conn, (err, result) => {
                if (err) console.log('Error:', err)

                balances = result.doc
                // console.log('Balances: OK')
              })

            return db
              .get({
                table: 'balanceCharts',
                id
              })
              .run(conn, (err, result) => {
                if (err) console.log('Error:', err)

                // console.log('Balance charts: OK')
                charts = result.doc
                currencies = Object.keys(charts)

                // Compose data state
                state = {
                  balances,
                  currencies,
                  charts
                }

                db.closeConnection(conn)
              })
          })
          .then(() => resolve())
          .catch(err => console.log('Error getting data from DB. Error:', err))
      )
    }

    function processAllData() {
      return new Promise(resolve => {
        queue3.push(() => {
          const portfolioChartData = getPortfolioChartData()

          console.log(' >> Inserting data to portfolioChartData table.')

          return db.connect().then(conn =>
            db
              .upsert({
                table: 'portfolioChartData',
                doc: portfolioChartData,
                id // User ID
              })
              .run(conn)
              .then(() => db.closeConnection(conn))
              .then(() => resolve())
              .catch(err =>
                console.error(
                  'Error inserting portfolio chart data to DB:',
                  err
                )
              )
          )
        })
      })
    }

    function getPortfolioChartData() {
      // console.log(' >> Proessing getPortfolioChartData: step 1')

      const portfolioChartData = []

      const currencies = state.currencies

      // console.log(' >> Proessing getPortfolioChartData: step 2')

      for (const currency of currencies) {
        // console.log(' >> Proessing getPortfolioChartData. Currency:', currency)

        const chart = state.charts[currency]

        for (let i = 0; i < chart.length; i++) {
          if (!portfolioChartData[i]) {
            // initial step
            // console.log('Initial step')
            portfolioChartData[i] = []
          }

          // console.log('Next step:', i)
          // next steps
          portfolioChartData[i].push(chart[i])
        }
      }

      // console.log(' >> Proessing getPortfolioChartData: step 3')

      for (let i = 0; i < portfolioChartData.length; i++) {
        portfolioChartData[i] = reduce(portfolioChartData[i])
      }

      // console.log(' >> Proessing getPortfolioChartData: step 4')

      return portfolioChartData

      // Functions
      function reduce(data) {
        return data.reduce((accum, day) => {
          const date = day.date
          const dateFormatted = new Date(day.date)
          const volumeInBtc =
            (accum.volumeInBtc * 100000000 + day.volumeInBtc * 100000000) /
            100000000
          const volumeInUsdt =
            (accum.volumeInUsdt * 100000000 + day.volumeInUsdt * 100000000) /
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
    }
  }
}

// Poloniex Exchange API

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

//
module.exports = { runAll }
