<template>
  <section id='main' class='top-5'>
    <!-- Price page -->  
    <section v-if='charts.current === "prices"'>
      <prices />
    </section>

    <!-- Portfolio page -->
    <section v-if='charts.current === "portfolio"'>
      <portfolio v-if='isAuthorized' />
    </section>
    <!--  -->
  </section >
  <!--  -->
</template>

<script>
import { mapState } from 'vuex'

import prices from './prices/prices.vue'
import portfolio from './portfolio/portfolio.vue'

export default {
  name: 'app-main',
  components: {
    prices,
    portfolio
  },
  computed: {
    ...mapState(['charts', 'isAuthorized'])
  }
}
</script>

<style>
#background {
  position: fixed;
  width: 100%;
}

#main {
  margin-top: 64px;
  width: 100%;
  margin-bottom: calc(100vh - 70px);
}
</style>
