<template>
  <section id='app-header' class='top-3'>
    <md-toolbar class='md-transparent'>
      <!--  -->
      <!-- Title -->
      <transition name='fade'>
        <h1 v-if='isAuthorized' class='md-title flex-1 lavender'>
          <a @click.passive='switchToPortfolioAction' class='title pointer lavender' aria-label='Back to home page'>
            <b class='glow'> DYNAMIC</b> PORTFOLIO
          </a>
        </h1>
        <!--  -->
        <h1 v-else v-show='isAppStarted' class='md-title flex-1 lavender'>
          <a class='title pointer lavender' aria-label='Back to home page'>
            <b class='glow'> DYNAMIC</b> PORTFOLIO
          </a>
        </h1>
      </transition>
      <!--  -->
      <!-- Indicators -->      
      <!--  -->
      <!-- Error indicator -->
      <template v-if='isConnectionError'>
        <md-button class='md-icon-button lavender' aria-label='Error indicator'>
          <md-icon>cloud_off</md-icon>
        </md-button>        
      </template>
      
      <!--  -->
        <!-- Loading indicator -->            
      <template v-else-if='isLoading || isAuthorization'>
        <md-button class='md-icon-button lavender cloud animation-pulse' aria-label='Loading indicator'>
          <md-icon>cloud_queue</md-icon>
        </md-button>
      </template>
      <!--  -->
      <!-- Schedule indicator -->
      <template v-else-if='isScheduledToUpdate'>
        <md-button v-if='isScheduledToUpdate' class='md-icon-button lavender animation-pulse' aria-label='Scheduler indicator'>
          <md-icon>schedule</md-icon>
        </md-button>
      </template>
      <!--  -->
      <!--  -->
      <!-- Buttons -->
      <!-- Login and Authorization buttons -->
      <template v-else>
        <!-- Login buttons -->
        <span v-if='!isLogged && isAuthChecked'>
          <!--  Large screen -->
          <md-button @click.passive='showLogin' class='hide lavender' aria-label='Log in'>
            LOG <b class='glow'>IN</b>
          </md-button>
          <!-- Small screen -->
          <md-button @click.passive='showLogin' class='md-icon-button hide-large lavender' aria-label='Log in'>
            <md-icon>fingerprint</md-icon>
          </md-button>
        </span>
        <!--  -->
        <!-- Authorization buttons -->
        <span v-else-if='!isAuthorized && isAuthChecked'>
          <!--  Large screen -->
          <md-button @click.passive='showLogin' class='hide lavender' aria-label='Connect to Poloniex'>
            CONNECT TO <b class='glow'>POLONIEX</b>
          </md-button>
          <!-- Small screen -->
          <md-button @click.passive='showLogin' class='md-icon-button hide-large lavender' aria-label='Connect to Poloniex'>
            <md-icon>fingerprint</md-icon>
          </md-button>
        </span>

        <!-- Switch page buttons -->
        <template v-else>
          <!--  Large screen -->
          <md-button v-if='charts.current === "prices" && isAuthChecked' @click.passive='switchToPortfolioAction' class='hide lavender' aria-label='Switch to portfolio'>SWITCH TO <b class='glow'>PORTFOLIO</b> &nbsp;
            <md-icon>trending_up</md-icon>
          </md-button>
          <!-- Small screen -->
          <md-button v-if='charts.current === "prices" && isAuthChecked'  @click.passive='switchToPortfolioAction' class='md-icon-button hide-large lavender' aria-label='Switch to portfolio'>
            <md-icon>trending_up</md-icon>
          </md-button>
          <!--  Large screen -->
          <md-button v-if='charts.current==="portfolio" && isAuthChecked' @click.passive='switchToPricesAction' class='hide lavender'  aria-label='Switch to prices'>SWITCH TO <b class='glow'>PRICES</b> &nbsp;
            <md-icon>timeline</md-icon>
          </md-button>
          <!-- Small screen -->
          <md-button v-if='charts.current==="portfolio" && isAuthChecked' @click.passive='switchToPricesAction' class='md-icon-button hide-large lavender' aria-label='Switch to prices'>
            <md-icon>timeline</md-icon>
          </md-button>
        </template>
      </template>
      <!--  -->
    </md-toolbar>
  </section>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  name: 'app-header',
  data: () => ({
    isAppStarted: false
  }),
  computed: {
    ...mapState([
      'isLoading',
      'coin',
      'charts',
      'currencies',
      'isConnectionError',
      'isLogged',
      'isAuthorized',
      'isAuthorization',
      'isScheduledToUpdate',
      'isAuthChecked'
    ])
  },
  methods: {
    ...mapMutations(['hideError', 'showLogin']),
    ...mapActions(['switchToPricesAction', 'switchToPortfolioAction'])
  },
  mounted() {
    this.isAppStarted = true // For transition effect
  }
}
</script>

<style scoped>
#app-header {
  background: black;
  height: 64px;
  width: 100%;
  top: 0;
  position: fixed;
}

.title {
  text-decoration: none !important;
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 2s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
