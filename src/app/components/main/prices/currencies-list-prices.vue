<template>
<section>
  <md-card md-with-hover id='currencies-list-prices' class='flex-1'>
    
    <br class='hide' />

    <md-card-header>
      <div class="md-title hide light"><b>PRICE</b> <span class='dimmed'>LIST</span></div>
    </md-card-header>

    <md-card-actions v-if='isAuthorized'>
      <md-button @click.passive='updateListFilter' class='md-icon-button hide-large' aria-label='Update list filter'>
        <md-icon class='light'>filter_list</md-icon>
      </md-button>
      
      <md-button @click.passive='updateListFilter' class='md-button hide' aria-label='Update list filter'>
        <span v-if='isFiltered' class='light'>SHOW <span class='dimmed'>ALL</span></span>
        <span v-if='!isFiltered' class='light'>SHOW ONLY <span class='dimmed'>PORTFOLIO</span></span>
      </md-button>
    </md-card-actions>

    <br class='hide' />

    <md-table md-sort='shortName' @sort='reOrder'>
      <md-table-header>
        <md-table-row>
          <md-table-head></md-table-head>
          <md-table-head></md-table-head>
          <md-table-head md-sort-by='shortName'>Name</md-table-head>
          <md-table-head md-sort-by='fullName' class='hide'>Full name</md-table-head>
          <md-table-head md-sort-by='priceInBtc'>In BTC</md-table-head>
          <md-table-head md-sort-by='priceInUsdt'>In USD</md-table-head>
        </md-table-row>
      </md-table-header>

      <md-table-body>
        <md-table-row :class='coin.shortName == currency.shortName ? "selected" : ""' class='pointer' v-for='(currency, index) in orderedCurrencies' :key='index' :name='currency.shortName' :md-item='currency'>
          <md-table-cell :class='getStatusColor(currency)'>
            <b>{{ index + 1 }}</b>
          </md-table-cell>

          <md-table-cell>
            <!-- <md-image class='table-icon' type='image/svg+xml' :md-src="getTableIcon(currency.shortName)"></md-image> -->
            <i class='table-icon dimmed' :class='getCurrencyIcon(currency.shortName)'></i>
            <!-- <md-image class='table-icon' :md-src='getTableIcon(currency.shortName)' /> -->
            
          </md-table-cell>

          <md-table-cell class='dimmed'>
            <b>{{ currency.shortName }}</b>
          </md-table-cell>

          <md-table-cell class='hide hand-write'>
            {{ currency.fullName }}
          </md-table-cell>

          <md-table-cell>
            <span>
              {{ priceInBtc(currency) }}
            </span>
          </md-table-cell>

          <md-table-cell>
            {{ priceInUsdt(currency) }}
          </md-table-cell>
        </md-table-row>
      </md-table-body>
    </md-table>
    <br />
  </md-card>
  </section>
</template>

<script>
import { orderBy } from 'lodash/collection'

import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { getRoundIcon } from '../../functions'

export default {
  name: 'currencies-list-prices',
  data: () => ({
    orderField: 'shortName',
    direction: 'asc'
  }),
  computed: {
    ...mapState([
      'prices',
      'charts',
      'coin',
      'isFiltered',
      'balances',
      'isAuthorized',
      'cryptoIcons'
    ]),
    ...mapGetters(['getCurrencies']),
    orderedCurrencies() {
      const currencies = this.getCurrencies.filter(currency => {
        if (this.isFiltered) return currency.shortName in this.balances
        else return true
      })

      return orderBy(currencies, this.orderField, this.direction)
    }
  },
  methods: {
    ...mapActions(['scrollToTop']),
    ...mapMutations(['updateCoin', 'updateListFilter', 'updateExchangeTime']),
    priceInBtc(currency) {
      const priceInBtc = currency.priceInBtc
      const isFractional = priceInBtc.toString().indexOf('.') != -1

      const length = isFractional
        ? priceInBtc.toString().split('.')[1].length
        : 0

      switch (length > 8) {
        case true:
          return (Math.ceil(priceInBtc * 10000000) / 10000000).toFixed(8)
        default:
          return priceInBtc
      }
    },
    priceInUsdt(currency) {
      const priceInUsdt = currency.priceInUsdt
      const isFractional = priceInUsdt.toString().indexOf('.') != -1

      const length = isFractional
        ? priceInUsdt.toString().split('.')[1].length
        : 0

      switch (length > 2) {
        case true:
          return (Math.ceil(priceInUsdt * 100) / 100).toFixed(2)
        default:
          return priceInUsdt.toFixed(2)
      }
    },
    selectRow(event) {
      const row = event.target.closest('tr')

      if (row) {
        const name = row.attributes.name.value

        this.scrollToTop().then(() => {
          this.updateCoin({
            shortName: name,
            fullName: this.getCurrencies.find(
              currency => currency.shortName === name
            ).fullName
          })
        })
      }
    },
    getCurrencyIcon(name) {
      return getRoundIcon(name)
    },
    getStatusColor(currency) {
      if (currency.disabled) return 'red'
      if (currency.frozen) return 'blue'

      return ''
    },
    reOrder(object) {
      this.orderField = object.name
      this.direction = object.type
    },
    getTableIcon(name) {
      return this.cryptoIcons[name]
        ? 'https://www.cryptocompare.com' +
            this.cryptoIcons[name].imageUrl.toLowerCase()
        : ''
    }
  },
  mounted() {
    document
      .querySelector('#currencies-list-prices table tbody')
      .addEventListener(
        'click',
        event => {
          this.selectRow(event)
        },
        { passive: true }
      )
  }
}
</script>

<style scoped>
.table-icon {
  font-size: 20px;
  line-height: 20px;
}

.selected {
  background: #eeeeee;
}
/* Additional styles in style.css */
</style>
