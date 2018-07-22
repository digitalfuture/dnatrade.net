<template>
<md-card md-with-hover class='item large-margin-left hide background-dark'>
  <md-ink-ripple />
  <md-toolbar class='md-transparent'></md-toolbar>
      <md-toolbar class='md-transparent'>
        <h1 class='md-title'>
          <span class='lavender'>
            <b class='glow'>DNA</b>TRADE
          </span>
          <span class='dimmed'>.NET</span>
        </h1>

        <md-button class='md-icon-button' id='email' aria-label='Send an email'>
          <a href='mailto:mail@dnatrade.net?subject=DYNAMIC PORTFOLIO' target='_blank' rel='noopener' aria-label='Link to compose an email'>
            <md-icon class='lavender'>email</md-icon>
          </a>
          <md-tooltip md-direction="top">Email</md-tooltip>
        </md-button>

        <md-button class='md-icon-button' id='telegram' aria-label='Join to Telegram discussion'>
          <a href='https://t.me/joinchat/Co09SxC95-PvjhMVJEOoRQ' target='_blank' rel='noopener' aria-label='Link to telegram discussion group'>
            <md-icon class='lavender'>near_me</md-icon>
          </a>
          <md-tooltip md-direction='top'>Telegram</md-tooltip>
        </md-button>

        <md-button class='md-icon-button' aria-label='Dummy button'>
          <md-icon></md-icon>
        </md-button>
      </md-toolbar>
  
  <!-- <div class='dimmed'>
    <md-layout flex>
      <i v-for='(icon, name) of orderedCurrencies' :key='name' :class='getCurrencyIcon(name)'></i>
    </md-layout>
    <center class='hand-write glow'>
    </center>
  </div> -->
</md-card>
</template>
<script>
import _ from 'lodash'
import { getIcon } from './functions'
import { mapGetters } from 'vuex'

export default {
  name: 'currencies-card',
  computed: {
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
    getCurrencyIcon(name) {
      return getIcon(name)
    }
  }
}
</script>
<style scoped>
.background-dark {
  background: url(../images/background.jpg) black center/cover !important;
}
</style>