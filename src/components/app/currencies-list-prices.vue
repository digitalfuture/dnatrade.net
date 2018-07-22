<template>
  <md-card id='currencies-list-prices' class='flex1'>
    
    <br class='hide' />

    <md-card-actions>
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
          <md-table-head md-sort-by='priceInUsdt'>In USDT</md-table-head>
        </md-table-row>
      </md-table-header>

      <md-table-body>
        <md-table-row :class='coin.shortName == currency.shortName ? "selected" : ""' class='pointer' v-for='(currency, index) in orderedCurrencies' :key='index' :name='currency.shortName' :md-item='currency'>
          <md-table-cell :class='getStatusColor(currency)'>
            <b>{{ index + 1 }}</b>
          </md-table-cell>

          <md-table-cell>
            <i class='table-icon' :class='getCurrencyIcon(currency.shortName)'></i>
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
</template>

<script>
import _ from 'lodash'

import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { getIcon } from './functions'

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
      'isAppVisible',
      'balances'
    ]),
    ...mapGetters(['getCurrencies']),
    orderedCurrencies() {
      const currencies = this.getCurrencies.filter(currency => {
        if (this.isFiltered) return currency.shortName in this.balances
        else return true
      })

      return _.orderBy(currencies, this.orderField, this.direction)
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
          let baseTradeName

          switch (name) {
            case 'BTC':
              baseTradeName = 'USDT'
              break
            default:
              baseTradeName = 'BTC'
          }

          this.updateCoin({
            shortName: name,
            fullName: this.getCurrencies.find(
              currency => currency.shortName === name
            ).fullName,
            baseTradeName
          })
        })
      }
    },
    getCurrencyIcon(name) {
      return getIcon(name)
    },
    getStatusColor(currency) {
      if (currency.disabled) return 'red'
      if (currency.frozen) return 'blue'

      return ''
    },
    reOrder(object) {
      this.orderField = object.name
      this.direction = object.type
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
  color: #455a64;
}

.selected {
  background: #eeeeee;
}
/* Additional styles in style.css */
</style>
