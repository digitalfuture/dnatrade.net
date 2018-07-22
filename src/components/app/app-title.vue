<template>
  <section>
    <section v-if='!isAppVisible'>
      <md-toolbar class='md-transparent initial'>
        <h1 class='md-title'></h1>
        <md-button v-if='!isError' class='md-icon-button lavender cloud' aria-label='Loading indicator'>
          <md-icon>cloud_queue</md-icon>
        </md-button>
      </md-toolbar>
    </section>

    <transition name='fade'>
      <section v-if='isAppVisible'>
        <md-toolbar class='md-transparent'>
          <h1 class='md-title lavender'>
            <a @click.passive='switchToPricesAction' class='title' aria-label='Back to home page'>
              <b class='glow'> DYNAMIC</b> PORTFOLIO
            </a>
          </h1>
          
          <transition name='fade'>
            <md-button v-if='isError' class='md-icon-button lavender' aria-label='Error indicator'>
              <md-icon>cloud_off</md-icon>
            </md-button>
          </transition>

          <transition name='fade'>
            <md-button v-if='!isError' class='md-icon-button lavender cloud' aria-label='Loading indicator'>
              <md-icon>cloud_queue</md-icon>
            </md-button>
          </transition>

          <transition name='fade'>
            <span v-if='isAuthorized'>
              <!--  Large screen -->
              <md-button v-if='charts.current === "prices"' @click.passive='switchToPortfolioAction' class='hide lavender'>SWITCH TO <b class='glow'>PORTFOLIO</b> &nbsp;
                <md-icon>trending_up</md-icon>
              </md-button>
              
              <!-- Small screen -->
              <md-button v-if='charts.current === "prices"'  @click.passive='switchToPortfolioAction' class='md-icon-button hide-large lavender' aria-label='Switch to portfolio'>
                <md-icon>trending_up</md-icon>
              </md-button>

              <!--  Large screen -->              
              <md-button v-if='charts.current==="portfolio"' @click.passive='switchToPricesAction' class='hide lavender'>SWITCH TO <b class='glow'>PRICES</b> &nbsp;
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
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  name: 'app-title',
  computed: {
    ...mapState([
      'coin',
      'charts',
      'currencies',
      'isAppVisible',
      'isAuthorized',
      'isError'
    ])
  },
  methods: {
    ...mapMutations(['hideError']),
    ...mapActions(['switchToPricesAction', 'switchToPortfolioAction'])
  }
}
</script>

<style scoped>
.md-title {
  flex: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.cloud {
  opacity: 0;
}

.title {
  cursor: pointer;
  text-decoration: none !important;
}
</style>
