<template>
  <transition name='fade'>
    <md-card id='currencies-list-balances' class='flex1'>
      
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
            <md-table-head md-sort-by='balance'>Balance</md-table-head>
            <md-table-head md-sort-by='balanceInBtc'>In BTC</md-table-head>
            <md-table-head md-sort-by='balanceInUsdt'>In USDT</md-table-head>
          </md-table-row>
        </md-table-header>

        <md-table-body class='pointer'>
          <md-table-row :class='coin.shortName == currency.shortName ? "selected" : ""' class='pointer' v-for='(currency, index) in orderedCurrencies' :key='index' :name='currency.shortName' :md-item='currency'>
            <md-table-cell :class='getStatusColor(currency)'>
              <b>{{ index + 1 }}</b>
            </md-table-cell>

            <md-table-cell>
              <i class='icon' :class='getCurrencyIcon(currency.shortName)'></i>
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
import _ from 'lodash'

import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { getIcon } from './functions'

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
      'isAppVisible',
      'balances',
      'isBalanceChart'
    ]),
    ...mapGetters(['getCurrencies']),
    orderedCurrencies() {
      const currencies = this.getCurrencies.filter(currency => {
        if (this.isFiltered) return currency.balance !== 0
        else return true
      })

      return _.orderBy(currencies, this.orderField, this.direction)
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
.icon {
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
