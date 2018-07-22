export default {
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
  appInitialized: false
}
