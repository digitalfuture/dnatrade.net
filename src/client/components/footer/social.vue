<template>
    <section id='social'>
    <!--  -->
    <md-toolbar class='md-transparent'>
      <!--  -->
      <h1 class='md-title flex-1'>
        <span class='lavender'>
          <b class='glow'>DNA</b>TRADE
        </span>
        <span class='dimmed'>.NET</span>
      </h1>
      <!--  -->
      <md-button class='md-icon-button' id='email' aria-label='Send an email'>
        <a href='mailto:mail@dnatrade.net?subject=DYNAMIC PORTFOLIO' target='_blank' rel='noopener' aria-label='Link to compose an email'>
          <md-icon class='icon lavender'>email</md-icon>
        </a>
      </md-button>
      <!--  -->
      <md-button class='md-icon-button' id='telegram' aria-label='Join to Telegram discussion'>
        <a href='https://t.me/joinchat/Co09SxC95-PvjhMVJEOoRQ' target='_blank' rel='noopener' aria-label='Link to telegram discussion group'>
          <i class="icon lavender fab fa-telegram-plane"></i>
        </a>
      </md-button>
      <!--  -->
      <md-button class='md-icon-button' aria-label='Dummy button'>
        <md-icon></md-icon>
      </md-button>
      <!--  -->
    </md-toolbar>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'social',
  computed: {
    // ...mapState(['isLogged']),
    ...mapGetters(['isCurrenciesReady'])
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 2s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.icon {
  width: 24px;
  height: 24px;
}
</style>