const router = require('express').Router()

const getAllChartsData = require('./data/allcharts')
const getBalanceChartAll = require('./data/allbalancecharts')
const getTradeHistory = require('./data/history')
const getPrices = require('./data/prices')
const getDepositsWithdrawals = require('./data/depositswithdrawals')
const getDepositsWithdrawalsAllCurrencies = require('./data/alldepositswithdrawals')
const getBalances = require('./data/balances')
const getCurrencies = require('./data/currencies')
const getPortfolioChartData = require('./data/portfoliochartdata')

router.get('/allcharts', (req, res, next) => getAllChartsData(req, res, next))
router.get('/allbalancecharts', (req, res, next) =>
  getBalanceChartAll(req, res, next)
)
router.get('/depositswithdrawals', (req, res, next) =>
  getDepositsWithdrawals(req, res, next)
)
router.get('/alldepositswithdrawals', (req, res, next) =>
  getDepositsWithdrawalsAllCurrencies(req, res, next)
)
router.get('/history', (req, res, next) => getTradeHistory(req, res, next))
router.get('/prices', (req, res, next) => getPrices(req, res, next))
router.get('/balances', (req, res, next) => getBalances(req, res, next))
router.get('/currencies', (req, res, next) => getCurrencies(req, res, next))
router.get('/portfoliochartdata', (req, res, next) =>
  getPortfolioChartData(req, res, next)
)

module.exports = router
