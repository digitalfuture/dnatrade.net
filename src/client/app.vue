<template>
  <section id='app'>
    <!-- Login page -->
    <transition name='fade'>
      <login v-if='isLogin' />
    </transition>

    <!-- Logout page -->
    <transition name='fade'>
      <logout v-if='isLogout' />
    </transition>

    <!-- Reset Keys page -->
    <transition name='fade'>
      <reset-keys v-if='isResetKeys' />
    </transition>

    <!--  -->
    <!-- App header -->
    <app-header class='top-4' />
    <!--  -->
    <!-- App Main -->
    <transition name='fade'>
      <app-main :class='isLogin ? "blur" : ""' v-if='isCurrenciesReady' />
      <!-- Background -->
      <section :class='isLogin ? "blur" : ""' v-else>
        <md-image :md-src='"../images/background.jpg"' id='background' class='top-5' alt='background'></md-image>
      </section>
    </transition>
    <!--  -->
    <transition name='fade'>
      <!-- App footer -->
      <app-footer v-if='isCurrenciesReady' />
    </transition>
    <!--  -->
    <!-- Scroll button -->
    <scroll-top-button class='top-4' />
    <!--  -->
  </section>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
import _ from 'lodash'

import login from './components/login.vue'
import logout from './components/logout.vue'
import resetKeys from './components/reset-keys.vue'
import appHeader from './components/header/header.vue'
import appFooter from './components/footer/footer.vue'
import appMain from './components/main/main.vue'
import scrollTopButton from './components/scroll-top-button.vue'

import {
  getBalances,
  getDepositsWithdrawals,
  getDepositsWithdrawalsAllCurrencies,
  getCurrencies,
  getAllChartsData,
  getTradeHistory,
  getBalanceChartAll,
  getPortfolioChartData
} from './services/data-api'

import { checkAuth } from './services/auth-api'

//
export default {
  name: 'app',
  components: {
    login,
    logout,
    resetKeys,
    appHeader,
    appFooter,
    appMain,
    scrollTopButton
  },
  watch: {
    isLogging: function() {
      if (this.isLogging) {
        this.hideLogin()
        this.enableLoading()

        this.getInitialData()
          .then(() => checkAuth())
          .then(result => {
            if (result.data == 2) return this.startAuthorization()
          })
          .then(() => this.login())
          .then(() => this.disableLoading())
      }
    },
    isAuthorization: function() {
      if (this.isAuthorization) {
        this.getPersonalData()
          .then(() => this.authorizeApp())
          .then(() => this.disableLoading())
      }
    },
    isScheduledToUpdate: function() {
      if (!this.isScheduledToUpdate) return

      checkAuth().then(result => {
        // If initial data is ready
        if (result.data == 2) {
          this.scheduleToUpdateStop()
          this.startAuthorization()

          return
        }
      })

      const watcher = setInterval(() => {
        checkAuth().then(result => {
          if (result.data == 0) {
            return
          }

          if (result.data == 1) {
            return
          }

          if (result.data == 2) {
            this.scheduleToUpdateStop()
            this.startAuthorization()
            clearInterval(watcher)
          }
        })
      }, 1000 * 30)
    },
    'charts.priceChartBtc.selectedRange': function(newValue, oldValue) {
      // console.log(
      //   'Watch handler fired. oldValue:',
      //   oldValue,
      //   'newValue:',
      //   newValue
      // )

      if (newValue != undefined)
        this.saveSelectedRangeToDbAction({
          chartName: 'priceChartBtc',
          selectedRange: newValue
        })
    },
    'charts.priceChartUsdt.selectedRange': function(newValue, oldValue) {
      // console.log(
      //   'Watch handler fired. oldValue:',
      //   oldValue,
      //   'newValue:',
      //   newValue
      // )

      if (newValue != undefined)
        this.saveSelectedRangeToDbAction({
          chartName: 'priceChartUsdt',
          selectedRange: newValue
        })
    },
    'charts.balanceChart.selectedRange': function(newValue, oldValue) {
      // console.log(
      //   'Watch handler fired. oldValue:',
      //   oldValue,
      //   'newValue:',
      //   newValue
      // )

      if (newValue != undefined)
        this.saveSelectedRangeToDbAction({
          chartName: 'balanceChart',
          selectedRange: newValue
        })
    },
    'charts.profitChart.selectedRange': function(newValue, oldValue) {
      // console.log(
      //   'Watch handler fired. oldValue:',
      //   oldValue,
      //   'newValue:',
      //   newValue
      // )

      if (newValue != undefined)
        this.saveSelectedRangeToDbAction({
          chartName: 'profitChart',
          selectedRange: newValue
        })
    },
    'charts.portfolioChart.selectedRange': function(newValue, oldValue) {
      // console.log(
      //   'Watch handler fired. oldValue:',
      //   oldValue,
      //   'newValue:',
      //   newValue
      // )

      if (newValue != undefined)
        this.saveSelectedRangeToDbAction({
          chartName: 'portfolioChart',
          selectedRange: newValue
        })
    },
    isBtcRate: function(newValue, oldValue) {
      if (newValue != undefined) this.saveRateToDb(newValue)
    },
    coin: {
      handler: function() {
        this.saveCoinToDb()
      },

      deep: true
    }
  },
  computed: {
    ...mapState([
      'coin',
      'isBtcRate',
      'balances',
      'currencies',
      'charts',
      'isBalanceChart',
      'currencies',
      'depositsWithdrawals',
      'depositsWithdrawalsAllCurrencies',
      'tradeHistory',
      'isLogin',
      'isLogout',
      'isResetKeys',
      'isLogging',
      'isLogged',
      'isAuthorized',
      'isAuthorization',
      'isScheduledToUpdate'
    ]),
    ...mapGetters(['isCurrenciesReady'])
  },
  methods: {
    ...mapMutations([
      'updateCoin',
      'updateRate',
      'updateSelectedRange',
      'updateExchangeTime',
      'updateAllChartsData',
      'showError',
      'enableLoading',
      'disableLoading',
      'login',
      'hideLogin',
      'startLogging',
      'authorizeApp',
      'startAuthorization',
      'scheduleToUpdate',
      'scheduleToUpdateStop',
      'finishCheckingAuth'
    ]),
    ...mapActions([
      'getCoinFromDb',
      'saveCoinToDb',
      'saveRateToDb',
      'getRateFromDb',
      'saveSelectedRangeToDbAction',
      'getSelectedRangeFromDbAction',
      'updateCurrenciesAction',
      'updateAllPricesAction',
      'updateBalancesAction',
      'updateTradeHistoryAction',
      'updateBalanceChartAllAction',
      'updatePortfolioChartDataAction',
      'updateProfitChartDataAction',
      'updatePriceChartBtcDataAction',
      'updatePriceChartUsdtDataAction',
      'updateDepositsWithdrawalsAction',
      'updateDepositsWithdrawalsAllCurrenciesAction'
    ]),
    getInitialData() {
      return Promise.resolve(true)
        .then(() => getAllChartsData())
        .then(response => this.updateAllChartsData(response.data))
        .then(() => this.updatePriceChartBtcDataAction())
        .then(() => this.updatePriceChartUsdtDataAction())
        .then(() => this.updateAllPricesAction())
        .then(() => getCurrencies())
        .then(response => {
          this.updateCurrenciesAction(response.data)
          this.updateExchangeTime(response.headers.date)
        })
        .catch(err => this.showError(err))
    },
    getPersonalData() {
      return (
        Promise.resolve(true)
          .then(() => getBalances())
          .then(response => this.updateBalancesAction(response.data))
          .then(() => getTradeHistory())
          .then(response => this.updateTradeHistoryAction(response.data))
          .then(() => getDepositsWithdrawals())
          .then(response => this.updateDepositsWithdrawalsAction(response.data))
          .then(() => getDepositsWithdrawalsAllCurrencies())
          .then(response =>
            this.updateDepositsWithdrawalsAllCurrenciesAction(response.data)
          )
          .then(() => getBalanceChartAll())
          .then(response => this.updateBalanceChartAllAction(response.data))
          //
          .then(() => getPortfolioChartData())
          .then(response => this.updatePortfolioChartDataAction(response.data))
          .then(() => this.updateProfitChartDataAction())
          .catch(err => this.showError(err))
      )
    },
    getSavedPropertiesFromDb() {
      for (const chartName in this.charts) {
        this.getSelectedRangeFromDbAction(chartName)
          .then(selectedRange => {
            if (selectedRange !== undefined)
              this.updateSelectedRange({ chartName, selectedRange })
          })
          .catch(err => console.log('Error:', err))
      }

      this.getRateFromDb()
        .then(rate => {
          if (rate !== undefined) this.updateRate(rate)
        })
        .catch(err => console.log('Error:', err))

      this.getCoinFromDb()
        .then(result => {
          if (
            result !== undefined &&
            result.shortName !== undefined &&
            result.fullName !== undefined
          )
            this.updateCoin({
              shortName: result.shortName,
              fullName: result.fullName
            })
        })
        .catch(err => console.log('Error:', err))
    }
  },
  mounted() {
    this.getSavedPropertiesFromDb()

    checkAuth()
      .then(result => {
        // If user does not exist
        if (result.data == 0) {

          this.finishCheckingAuth()          
          return
        }

        // If user does exist but not a Poloniex User
        if (result.data == 1) {
          this.startLogging()

          this.finishCheckingAuth()          
          return
        }

        // If user is Poloniex user
        if (result.data == 2) {
          this.startLogging()
          this.finishCheckingAuth()
          return
        }

        // If user is Poloniex user but data is not ready yet
        if (result.data == 3) {
          this.scheduleToUpdate()
          this.startLogging()

          this.finishCheckingAuth()          
          return
        }
      })
      .catch(err => console.log('Error:', err))
  }
}
</script>
<style scoped>
/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>