<template>
<md-card md-with-hover class='item large-margin-left hide background-dark card-ripple'>
  <md-ink-ripple />
  <md-toolbar class='md-transparent info'>
    <h1 class='md-title flex-1'>
      <span class='lavender'>
        <b class='glow'>DNA</b>TRADE
      </span>
      <span class='dimmed'>.NET</span>
    </h1>

    <md-button class='md-icon-button' id='email' aria-label='Send an email'>
      <a href='mailto:mail@dnatrade.net?subject=DYNAMIC PORTFOLIO' target='_blank' rel='noopener' aria-label='Link to compose an email'>
        <md-icon class='icon lavender'>email</md-icon>
      </a>
      <md-tooltip md-direction="left">Email</md-tooltip>
    </md-button>

    <md-button class='md-icon-button' id='telegram' aria-label='Join to Telegram discussion'>
      <a href='https://t.me/joinchat/Co09SxC95-PvjhMVJEOoRQ' target='_blank' rel='noopener' aria-label='Link to telegram discussion group'>
        <i class="icon lavender fab fa-telegram-plane"></i>
      </a>
      <md-tooltip md-direction='right'>Telegram</md-tooltip>
    </md-button>
  </md-toolbar>
</md-card>
</template>
<script>
import _ from 'lodash'
import { getIcon } from './functions'

export default {
  name: 'info-card'
}
</script>
<style scoped>
.info {
  margin-right: 60px;
}
.background-dark {
  background: url(../images/background.jpg) black center/cover !important;
}
.icon {
  width: 24px;
  height: 24px;
}
</style>