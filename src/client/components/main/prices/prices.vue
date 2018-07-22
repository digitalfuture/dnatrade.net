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
              Rate switcher
            </h2>
          </md-layout>

          <md-layout md-vertical-align='center'>
            <md-button class='rate-switcher md-icon-button md-raised' @click.passive='switchRate()' aria-label='Switch base currency rate'>
              <i class="icon-background dimmed far fa-circle"></i>
              <md-icon v-if='!isBtcRate' class='icon-rate dimmed'>monetization_on</md-icon>
              <i v-if='isBtcRate' class='icon dimmed cc BTC'></i>
            </md-button>

            <md-layout md-column>
              <h3 class='md-subhead'>
                <span :class='!isBtcRate ? "dimmed transparent" : ""'>
                  {{ priceInBtc }} BTC
                </span>
                <br />
                <span :class='isBtcRate ? "dimmed transparent" : ""'>
                  {{ priceInUsdt }} USD
                </span>
              </h3>
            </md-layout>
          </md-layout>
        </md-layout>

        <md-layout v-show='fullTime != 0' md-flex md-vertical-align='center' class='large-margin-left'>
          <md-layout class='hide flex-1' md-flex md-vertical-align='center' md-align='end'>
            <h2 class='md-title hide lighter hand-write'>
              Exchange time
            </h2>
          </md-layout>

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
        </md-layout>
      </md-layout>
    </md-card-header>
    <!--  -->
    <br />
    <!--  -->
    <!-- Price charts -->
    <div class='container'>
      <price-chart-btc v-if='isBtcRate' />
      <price-chart-usdt v-else />

      <!-- Info card -->
      <info-card />
    </div>
    <!--  -->
    <br />
    <!--  -->
    <!-- Price list -->
    <currencies-list-prices />
    <!--  -->
    <br />
    <!--  -->
  </md-card>
</template>

<script>
import currenciesListPrices from './currencies-list-prices.vue'
import infoCard from './info-card.vue'
import priceChartBtc from './price-chart-btc.vue'
import priceChartUsdt from './price-chart-usdt.vue'

import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'prices',
  components: {
    priceChartBtc,
    priceChartUsdt,
    currenciesListPrices,
    infoCard
  },
  computed: {
    ...mapState(['coin', 'charts', 'isBtcRate']),
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
  },
  methods: {
    ...mapMutations(['switchRate'])
  }
}
</script>
<style scoped>
.margin-right {
  margin-right: 16px;
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
