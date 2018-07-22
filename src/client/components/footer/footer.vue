<template>
  <section id='app-footer'>
    <md-toolbar class='md-transparent'></md-toolbar>

    <!-- Puzzle app roadmap -->
    <transition name='fade'>
      <puzzle v-show='isLogged && isScrolled' />
    </transition>

    <transition name='fade'>
      <md-toolbar v-show='isScrolled' class='md-transparent'></md-toolbar>
    </transition>

    <!-- Social connections -->
    <transition name='fade'>
      <social v-if='isCurrenciesReady && isScrolled' />
    </transition>
    <!--  -->
  </section>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import puzzle from './puzzle.vue'
  import social from './social.vue'

  export default {
    name: 'app-footer',
    components: {
      puzzle,
      social
    },
    data: () => ({
      isScrolled: false
    }),
    computed: {
      ...mapState(['isLogged']),
      ...mapGetters(['isCurrenciesReady'])
    },
    methods: {
      handleScroll() {
        this.isScrolled = window.scrollY > 164
      }
    },
    mounted() {
      window.addEventListener('scroll', this.handleScroll)
    }
  }
</script>

<style scoped>
  #app-footer {
    position: fixed;
    width: 100%;
    bottom: 0;
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