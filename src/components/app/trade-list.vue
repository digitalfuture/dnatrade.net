<template>
  <transition name='fade'>
    <md-card class='item hide large-margin-left' v-if='isBalanceChart'>
      <md-table>
        <md-table-row>
          <md-table-head>Date</md-table-head>
          <md-table-head>Amount</md-table-head>
          <md-table-head>Type</md-table-head>
          <md-table-head>Price</md-table-head>
        </md-table-row>
        <md-table-body>
          <md-table-row v-for='(trade, index) of currencyTrades' :key='index' :md-item='trade'>
            <md-table-cell>
              <b>trade.date</b>
            </md-table-cell>
            <md-table-cell>
              <b>trade.amount</b>
            </md-table-cell>
            <md-table-cell>
              <b>trade.type</b>
            </md-table-cell>
            <md-table-cell>
              <b>trade.rate</b>
            </md-table-cell>
          </md-table-row>
        </md-table-body>
      </md-table>
    </md-card>
  </transition>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'trade-list',
  computed: {
    ...mapState(['isBalanceChart']),
    ...mapGetters(['currencyTrades'])
  }
}
</script>
<style scoped>

</style>
