<template>
  <md-table-card class='item hide large-margin-left'>
    <md-table class='flex1'>    
      <md-table-header>
        <md-table-row>
          <md-table-head>Date</md-table-head>
          <md-table-head>Amount</md-table-head>
          <md-table-head>Type</md-table-head>
          <md-table-head class='show-larger'>Price</md-table-head>
          <md-table-head class='show-larger'>Currency</md-table-head>
        </md-table-row>
      </md-table-header>

      <md-table-body>
        <md-table-row v-for='(trade, index) of history' :key='index' :md-item='trade'>
          <md-table-cell>
            {{ historyTime(trade.date) }}
          </md-table-cell>
          <md-table-cell>
            {{ trade.amount }}
          </md-table-cell>
          <md-table-cell class='hand-write'>
            {{ trade.type }}
          </md-table-cell>
          <md-table-cell class='show-larger'>
            {{ trade.price }}
          </md-table-cell>
          <md-table-cell class='show-larger'>
            {{ trade.base }}
          </md-table-cell>
        </md-table-row>
      </md-table-body>
    </md-table>

    <md-table-pagination class='flex0'
      :md-total='linesTotal'
      :md-size='pageSize'
      :md-page='pageNumber'
      md-separator='of'
      :md-page-options='false'
      @pagination='onPagination'>
    </md-table-pagination>
  </md-table-card>
</template>

<script>
import moment from 'moment'

import { mapState, mapGetters } from 'vuex'

export default {
  name: 'currency-history',
  data: () => ({
    pageNumber: 1,
    pageSize: 6
  }),
  computed: {
    ...mapGetters(['currencyHistory']),
    linesTotal() {
      return this.currencyHistory.length
    },
    history() {
      return this.currencyHistory.slice(
        (this.pageNumber - 1) * this.pageSize,
        (this.pageNumber - 1) * this.pageSize + this.pageSize
      )
    }
  },
  methods: {
    historyTime(time) {
      return moment
        .utc(time)
        .clone()
        .format('D MMM')
    },
    onPagination(event) {
      this.pageNumber = event.page
    }
  }
}
</script>
<style scoped>

</style>
