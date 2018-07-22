<template>
  <md-card>
    <!--  -->
    <br />
    
    <!-- Page header -->
    <md-card-header>
      <md-layout md-flex>
        <md-layout md-flex md-vertical-align='center' class='large-margin-right'>
          <md-layout class='hide flex-1' md-flex md-vertical-align='center' md-align='end'>
            <h2 class='md-title hide lighter hand-write margin-right'>
              Rate switch
            </h2>
          </md-layout>
          <!--  -->
          <md-layout md-flex md-vertical-align='center'>
            <md-button class='rate-switcher md-icon-button md-raised' @click.passive='switchRate()' aria-label='Switch base currency rate'>
              <i class="icon-background dimmed far fa-circle"></i>
              <md-icon v-if='!isBtcRate' class='icon-rate dimmed'>monetization_on</md-icon>
              <i v-if='isBtcRate' class='icon dimmed cc BTC'></i>
            </md-button>
            <!--  -->
            <md-layout md-column>
              <h3 v-show='isBalanceChart' class='md-subhead'>
                <span :class='!isBtcRate ? "dimmed transparent" : ""'>
                  {{ balanceInBtc }} BTC
                </span>
                <br />
                <span :class='isBtcRate ? "dimmed transparent" : ""'>
                  {{ balanceInUsdt }} USD
                </span>
              </h3>
              <!--  -->
              <h3 v-show='!isBalanceChart' class='md-subhead'>
                <span :class='!isBtcRate ? "dimmed transparent" : ""'>
                  {{ portfolioBalanceInBtc }} BTC
                </span>
                <br />
                <span :class='isBtcRate ? "dimmed transparent" : ""'>
                  {{ portfolioBalanceInUsdt }} USD
                </span>
              </h3>
            </md-layout>
          </md-layout>
        </md-layout>
        <!--  -->
        <md-layout v-show='fullTime != 0' md-flex md-vertical-align='center' class='large-margin-left'>
          <md-layout class='hide flex-1' md-flex md-vertical-align='center' md-align='end'>
            <h2 class='md-title hide lighter hand-write'>
              Exchange time
            </h2>
          </md-layout>
          <!--  -->
          <md-layout md-vertical-align='center'>
            <md-icon class='icon-time light'>watch_later</md-icon>
            <!--  -->
            <md-layout v-show='fullTime != 0' md-column>
              <h3 class='md-subhead'>
                <span>
                  {{ exchangeTime }}
                </span>
              </h3>
              <!--  -->
              <h3 class='md-subhead'>
                <span>
                  {{ exchangeDate }}
                </span>
              </h3>
            </md-layout>
          </md-layout>
        </md-layout>
      </md-layout>
    </md-card-header>
    <!--  -->
    <br />
    <!--  -->
    <!-- Charts -->
    <div class='container'>
      <!-- Left card -->
      <balance-chart v-if='isBalanceChart' />
      <portfolio-chart v-else />

      <!-- Right card -->
      <currency-history v-if='isBalanceChart' />
      <profit-chart v-else />
    </div>

    <!-- Currencies list - Balances -->
    <transition name='fade'>
      <section v-if='isBalanceChart'>
        <br />
        <currencies-list-balances/>
      </section>
    </transition>
    <!--  -->
    <br />
    <!--  -->
  </md-card>
</template>

<script>
import Highcharts from 'highcharts/highstock'

import currenciesListBalances from './currencies-list-balances.vue'
import balanceChart from './balance-chart.vue'
import portfolioChart from './portfolio-chart.vue'
import profitChart from './profit-chart.vue'
import currencyHistory from './currency-history.vue'

import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  name: 'portfolio',
  components: {
    currenciesListBalances,
    balanceChart,
    portfolioChart,
    profitChart,
    currencyHistory
  },
  computed: {
    ...mapState(['coin', 'charts', 'isBalanceChart', 'isBtcRate']),
    ...mapGetters(['getPersonalCurrencies', 'exchangeTime', 'exchangeDate']),
    balanceInBtc() {
      const currency = this.getPersonalCurrencies.filter(
        currency => currency.shortName === this.coin.shortName
      )[0]

      return Math.ceil(currency.balanceInBtc * 100000) / 100000
    },
    balanceInUsdt() {
      const currency = this.getPersonalCurrencies.filter(
        currency => currency.shortName === this.coin.shortName
      )[0]

      return Math.ceil(currency.balanceInUsdt * 100) / 100
    },
    portfolioBalanceInBtc() {
      const currencies = this.getPersonalCurrencies
      let sum = 0

      for (const currency of currencies) {
        sum += currency.balanceInBtc
      }

      return Math.ceil(sum * 10000) / 10000
    },
    portfolioBalanceInUsdt() {
      const currencies = this.getPersonalCurrencies
      let sum = 0

      for (const currency of currencies) {
        sum += currency.balanceInUsdt
      }

      return Math.ceil(sum * 100) / 100
    }
  },
  methods: {
    ...mapMutations(['showError', 'switchRate'])
  }
}
</script>
<style scoped>
.margin-right {
  margin-right: 16px;
}

.md-subhead {
  font-weight: bolder;
}

.icon-background {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 42px;
  height: 42px;
}

.icon {
  font-size: 48px;
  line-height: 48px;
}

.icon-rate,
.icon-time {
  width: 48px;
  height: 48px;
  line-height: 48px;
  font-size: 48px;
  margin-right: 10px;
}

.icon-rate {
  font-size: 42px;
  margin-left: 0px;
  top: 0 !important;
}

.icon-time {
  margin-left: 16px;
}

.rate-switcher .BTC {
  font-size: 40px;
  line-height: 36px;
}

.md-button.md-icon-button.rate-switcher {
  width: 48px;
  height: 48px;
  min-width: 48px;
  min-height: 48px;
  padding: 0;
  margin-right: 10px;
  margin-left: 0px;
  border-radius: 50%;
}
</style>
