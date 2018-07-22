<template>
  <md-table-card class='md-with-hover item hide large-margin-left'>
    <md-table class='flex-1'>    
      <md-table-header>
        <md-table-row>
          <md-table-head></md-table-head>
          <md-table-head></md-table-head>
          <md-table-head>Amount</md-table-head>
          <md-table-head class='show-larger'>Price</md-table-head>
          <md-table-head class='show-larger'></md-table-head>
        </md-table-row>
      </md-table-header>

      <md-table-body>
        <md-table-row v-for='(trade, index) of history' :key='index' :md-item='trade' class='pointer'>
          <md-table-cell>
            {{ trade.date }}
          </md-table-cell>
          <md-table-cell class='hand-write'>
            {{ trade.type }}
          </md-table-cell>
          <md-table-cell>
            {{ trade.amount }}
          </md-table-cell>
          <md-table-cell class='show-larger'>
            {{ trade.price }}
          </md-table-cell>
          <md-table-cell class='show-larger'>
            <b class='dimmed'>{{ trade.base }}</b>
          </md-table-cell>
        </md-table-row>
      </md-table-body>
    </md-table>

    <section class='container flex-0'>
      <md-card-header>
        <div class='md-title hide light overlay'><b>{{ coin.fullName.toUpperCase() }}</b> <span class='dimmed'>HISTORY</span></div>
      </md-card-header>

      <md-table-pagination
        :md-total='linesTotal'
        :md-size='pageSize'
        :md-page='pageNumber'
        md-separator='of'
        :md-page-options='false'
        @pagination='onPagination'>
      </md-table-pagination>
    </section>
  </md-table-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'currency-history',
  data: () => ({
    pageNumber: 1,
    pageSize: 6
  }),
  watch: {
    coin: function() {
      this.pageNumber = 1
    }
  },
  computed: {
    ...mapState(['coin']),
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
    onPagination(event) {
      this.pageNumber = event.page
    }
  }
}
</script>
<style scoped>
.overlay {
  position: absolute;
  margin-top: 0px !important;
  margin-left: 17px;
}
</style>
