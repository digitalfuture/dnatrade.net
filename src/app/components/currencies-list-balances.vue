<template>
  <transition name='fade'>
    <md-card md-with-hover id='currencies-list-balances' class='flex-1'>
      
      <br class='hide' />

      <md-card-header>
        <div class='md-title hide light'><b>CURRENT</b> <span class='dimmed'>BALANCES</span></div>
      </md-card-header>


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
            <md-table-head md-sort-by='balance'>Balance</md-table-head>
            <md-table-head md-sort-by='balanceInBtc'>In BTC</md-table-head>
            <md-table-head md-sort-by='balanceInUsdt'>In USD</md-table-head>
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
              {{ balance(currency) }}
            </md-table-cell>

            <md-table-cell>
              {{ balanceInBtc(currency) }}
            </md-table-cell>

            <md-table-cell>
              {{ balanceInUsdt(currency) }}
            </md-table-cell>

          </md-table-row>
        </md-table-body>
      </md-table>
      <br />
    </md-card>
  </transition>
</template>

<script>
import { orderBy } from 'lodash/collection'

import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { getRoundIcon } from './functions'

export default {
  name: 'currencies-list-balances',
  data: () => ({
    orderField: 'shortName',
    direction: 'asc'
  }),
  computed: {
    ...mapState([
      'coin',
      'isFiltered',
      'isCurrenciesReady',
      'balances',
      'isBalanceChart'
    ]),
    ...mapGetters(['getPersonalCurrencies']),
    orderedCurrencies() {
      const currencies = this.getPersonalCurrencies.filter(currency => {
        if (this.isFiltered) return currency.balance !== 0
        else return true
      })

      return orderBy(currencies, this.orderField, this.direction)
    }
  },
  methods: {
    ...mapActions(['scrollToTop', 'switchProfitChartAction']),
    ...mapMutations(['updateCoin', 'updateListFilter']),
    balance(currency) {
      return Math.ceil(currency.balance * 1000000) / 1000000
    },
    balanceInBtc(currency) {
      return Math.ceil(currency.balanceInBtc * 10000) / 10000
    },
    balanceInUsdt(currency) {
      return Math.ceil(currency.balanceInUsdt * 100) / 100
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
            fullName: this.getPersonalCurrencies.find(
              currency => currency.shortName === name
            ).fullName,
            baseTradeName
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
    }
  },
  mounted() {
    document
      .querySelector('#currencies-list-balances table tbody')
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

.pointer {
  cursor: pointer;
}

.blue {
  color: #2196f3;
}

.red {
  color: #f44336;
}

.placeholder {
  position: absolute;
  color: #455a64;
}

.selected {
  background: #eeeeee;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* Additional styles in style.css */
</style>
