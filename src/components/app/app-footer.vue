<template>
  <transition name='fade'>
    <section class='footer' v-if='isAppVisible'>
      <md-toolbar class='md-transparent'></md-toolbar>
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
    </section>
  </transition>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'app-footer',
  computed: {
    ...mapState([
      'isAppVisible'
    ])
  }
}
</script>

<style scoped>
.md-title {
  flex: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s
}

.fade-enter,
.fade-leave-to {
  opacity: 0
}
</style>
