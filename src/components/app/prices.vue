<template>
  <transition name='fade'>
    <md-card>

      <br />

      <!-- Page header -->
      <md-card-header>
        <md-layout md-flex>
          <md-layout md-flex md-vertical-align='center' class='large-margin-right'>
            <md-layout md-vertical-align='center'>
              <md-icon class='icon-price light'>monetization_on</md-icon>

              <md-layout md-column>
                <h3 class='md-subhead'>
                  <span>
                    {{ priceInBtc }} BTC
                    <br />
                    {{ priceInUsdt }} USDT
                  </span>
                </h3>
              </md-layout>
            </md-layout>

            <md-layout class='hide flex1' md-flex md-vertical-align='center' md-align='start'>
              <h2 class='md-title hide lighter hand-write'>
                Currency rate
              </h2>
            </md-layout>
          </md-layout>            

          <md-layout v-show='fullTime != 0' md-flex md-vertical-align='center' class='large-margin-left'>
            <md-layout md-vertical-align='center'>
              <md-icon class='icon-time light'>watch_later</md-icon>

              <md-layout v-show='fullTime != 0' md-column>
                <h3 class='md-subhead'>
                  <span>
                    {{ exchangeTime }}
                  </span>
                </h3>

                <h3 class='md-subhead'>
                  <span>
                    {{ exchangeDate }}
                  </span>
                </h3>
              </md-layout>
            </md-layout>

            <md-layout class='hide flex1' md-flex md-vertical-align='center' md-align='start'>
              <h2 v-if='!isBtcRate' class='md-title hide lighter hand-write'>
                Exchange time
              </h2>
            </md-layout>
          </md-layout>
        </md-layout>
      </md-card-header>

      <br />

      <div class='container'>
        <!-- Price chart -->
        <price-chart />

        <!-- Coming soon -->
        <md-card class='item large-margin-left hide background-dark'>
          <div class='coming-soon light'>
            <center>
              <h2>App is under development</h2>
            </center>
            <center class='hand-write glow'>
              <h3>Stay connected</h3>
            </center>
          </div>
        </md-card>
      </div>

      <br />

      <!-- Price list -->
      <currencies-list-prices v-if='getCurrencies.length > 0' />

      <br />
      
    </md-card>
  </transition>
</template>

<script>
import currenciesListPrices from './currencies-list-prices.vue'
import priceChart from './price-chart.vue'

import { mapState, mapGetters } from 'vuex'

export default {
  name: 'prices',
  components: {
    priceChart,
    currenciesListPrices
  },
  computed: {
    ...mapState(['coin', 'charts']),
    ...mapGetters(['getCurrencies', 'exchangeTime', 'exchangeDate']),
    priceInBtc() {
      const currency = this.getCurrencies.find(
        currency => currency.shortName === this.coin.shortName
      )

      return Math.ceil(currency.priceInBtc * 100000) / 100000
    },
    priceInUsdt() {
      const currency = this.getCurrencies.find(
        currency => currency.shortName === this.coin.shortName
      )

      return Math.ceil(currency.priceInUsdt * 100) / 100
    }
  }
}
</script>
<style scoped>
.icon-time,
.icon-price {
  width: 48px;
  height: 48px;
  line-height: 48px;
  font-size: 48px;
  margin-right: 10px;
}

.icon-time {
  margin-left: 16px;
}

.coming-soon {
  position: absolute;
  top: 20%;
}
</style>
