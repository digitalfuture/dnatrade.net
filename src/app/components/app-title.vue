<template>
  <section>
    <transition name='fade'>
      <section id='header' v-if='isAppStarted' class='top-3'>
        <md-toolbar class='md-transparent'>
          <transition name='fade'>
            <h1 v-if='isAuthorized' class='md-title flex-1 lavender'>
              <a @click.passive='switchToPortfolioAction' class='title pointer lavender' aria-label='Back to home page'>
                <b class='glow'> DYNAMIC</b> PORTFOLIO
              </a>
            </h1>
          
            <h1 v-if='!isAuthorized' class='md-title flex-1 lavender'>
              <a class='title pointer lavender' aria-label='Back to home page'>
                <b class='glow'> DYNAMIC</b> PORTFOLIO
              </a>
            </h1>
          </transition>

          <transition name='fade'>
            <md-button v-if='isScheduledToUpdate' class='md-icon-button lavender animation-pulse' aria-label='Scheduler indicator'>
              <md-icon>schedule</md-icon>
            </md-button>
          </transition>
          
          <!-- Error indicator -->
          <md-button v-if='isConnectionError' class='md-icon-button lavender' aria-label='Error indicator'>
            <md-icon>cloud_off</md-icon>
          </md-button>

          <!-- Loading indicator -->
          <md-button v-if='!isConnectionError && isLoading' class='md-icon-button lavender cloud animation-pulse' aria-label='Loading indicator'>
            <md-icon>cloud_queue</md-icon>
          </md-button>

          <transition name='fade'>
            <!-- Login buttons -->
            <span v-if='!isScheduledToUpdate && !isLogged && !isAuthorized && !isAuthorization && !isLoading && appInitialized'>
              <!--  Large screen -->
              <md-button @click.passive='showLogin' class='hide lavender' aria-label='Log in'>
                LOG <b class='glow'>IN</b>
              </md-button>

              <!-- Small screen -->
              <md-button @click.passive='showLogin' class='md-icon-button hide-large lavender' aria-label='Log in'>
                <md-icon>fingerprint</md-icon>
              </md-button>
            </span>
            
            <!-- Authorize buttons -->
            <span v-if='!isScheduledToUpdate && isLogged && !isAuthorized && !isAuthorization && !isLoading'>
              <!--  Large screen -->
              <md-button @click.passive='showLogin' class='hide lavender' aria-label='Connect to Poloniex'>
                CONNECT TO <b class='glow'>POLONIEX</b>
              </md-button>

              <!-- Small screen -->
              <md-button @click.passive='showLogin' class='md-icon-button hide-large lavender' aria-label='Connect to Poloniex'>
                <md-icon>fingerprint</md-icon>
              </md-button>
            </span>
            
            <!-- Swith charts buttons -->
            <span v-if='isAuthorized && !isLoading && !isScheduledToUpdate'>
              <!--  Large screen -->
              <md-button v-if='charts.current === "prices"' @click.passive='switchToPortfolioAction' class='hide lavender' aria-label='Switch to portfolio'>SWITCH TO <b class='glow'>PORTFOLIO</b> &nbsp;
                <md-icon>trending_up</md-icon>
              </md-button>
              
              <!-- Small screen -->
              <md-button v-if='charts.current === "prices"'  @click.passive='switchToPortfolioAction' class='md-icon-button hide-large lavender' aria-label='Switch to portfolio'>
                <md-icon>trending_up</md-icon>
              </md-button>

              <!--  Large screen -->              
              <md-button v-if='charts.current==="portfolio"' @click.passive='switchToPricesAction' class='hide lavender'  aria-label='Switch to prices'>SWITCH TO <b class='glow'>PRICES</b> &nbsp;
                <md-icon>timeline</md-icon>
              </md-button>

              <!-- Small screen -->              
              <md-button v-if='charts.current==="portfolio"' @click.passive='switchToPricesAction' class='md-icon-button hide-large lavender' aria-label='Switch to prices'>
                <md-icon>timeline</md-icon>
              </md-button>
            </span>
          </transition>
        </md-toolbar>
      </section>
    </transition>
  </section>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  name: 'app-title',
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
      'appInitialized'
    ]),
    ...mapGetters(['isCurrenciesReady'])
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
#header {
  background: black;
  height: 64px;
  width: 100%;
  top: 0;
  position: fixed;
}

.title {
  text-decoration: none !important;
}
</style>
