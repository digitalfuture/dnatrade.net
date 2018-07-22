import axios from 'axios'
import moment from 'moment'

exports.getPrices = () => {
  const options = {
    method: 'get',
    baseURL: `/`,
    url: 'data/prices',
    headers: { credentials: 'same-origin' }
  }

  return axios(options)
}

exports.getDepositsWithdrawals = () => {
  const options = {
    method: 'get',
    baseURL: `/`,
    url: 'data/depositswithdrawals',
    headers: { credentials: 'same-origin' }
  }

  return axios(options)
}

exports.getDepositsWithdrawalsAllCurrencies = () => {
  const options = {
    method: 'get',
    baseURL: `/`,
    url: 'data/alldepositswithdrawals',
    headers: { credentials: 'same-origin' }
  }

  return axios(options)
}

exports.getCurrencies = () => {
  const options = {
    method: 'get',
    baseURL: `/`,
    url: 'data/currencies',
    headers: { credentials: 'same-origin' }
  }

  return axios(options)
}

exports.getBalances = () => {
  const options = {
    method: 'get',
    baseURL: `/`,
    url: 'data/balances',
    headers: { credentials: 'same-origin' }
  }

  return axios(options)
}

exports.getTradeHistory = () => {
  const options = {
    method: 'get',
    baseURL: `/`,
    url: 'data/history',
    headers: { credentials: 'same-origin' }
  }

  return axios(options)
}

exports.getAllChartsData = () => {
  const options = {
    method: 'get',
    baseURL: '/',
    url: 'data/allcharts',
    headers: { credentials: 'same-origin' }
  }

  return axios(options)
}

exports.getBalanceChartAll = () => {
  const options = {
    method: 'get',
    baseURL: '/',
    url: 'data/allbalancecharts',
    headers: { credentials: 'same-origin' }
  }

  return axios(options)
}

exports.getPortfolioChartData = () => {
  const options = {
    method: 'get',
    baseURL: '/',
    url: 'data/portfoliochartdata',
    headers: { credentials: 'same-origin' }
  }

  return axios(options)
}
