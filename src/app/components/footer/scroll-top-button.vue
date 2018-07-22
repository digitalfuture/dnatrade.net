<template>
  <transition name="fade">
    <md-button v-show='isScrolled' @click='scrollToTop' class='md-fab md-fab-bottom-right md-raised' aria-label='Scroll to top'>
      <md-icon>keyboard_arrow_up</md-icon>
    </md-button>
  </transition>
</template>

<script>
import Vue from 'vue'
import { mapActions } from 'vuex'

export default {
  name: 'scroll-top-button',
  data: () => ({
    isScrolled: false
  }),
  methods: {
    ...mapActions(['scrollToTop']),
    handleScroll() {
      const fromBottom = document.body.clientHeight - window.scrollY
      this.isScrolled = window.scrollY > 500 && fromBottom > 741
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll, { passive: true })
  }
}
</script>
<style scoped>
.md-fab-bottom-right {
  position: fixed;
  bottom: 60px;
  right: 60px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
