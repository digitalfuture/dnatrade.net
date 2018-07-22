<template>
  <section id='reset-keys' class='top-2'>
    <transition name='fade'>
      <md-button @click.passive='hideResetKeys' class='md-icon-button close' aria-label='Back to App'>
        <md-icon class='icon dimmed close'>close</md-icon>
      </md-button>
    </transition>

    <div class="question-container">
      <md-button @click.passive='resetKeys' class='md-icon-button button glow' aria-label='Confirm Reset Keys'>
        <md-icon class='big-icon'>done</md-icon>
      </md-button>
      
      <br />
      <br />
      <div class='glow text'>RESET <b class='lavender'>KEYS</b></div>
      <br />

      <md-button @click.passive='hideResetKeys' class='md-icon-button button glow' aria-label='Cancel Reset Keys'>
        <md-icon class='big-icon'>close</md-icon>
      </md-button>
    </div>
  </section>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { resetKeys } from '../services/auth-api'

export default {
  name: 'reset-keys',
  methods: {
    ...mapMutations([
      'hideResetKeys'
    ]),
    reset() {
      resetKeys().then(() => location.reload())
    }
  }
}
</script>

<style scoped>
#reset-keys {
  position: fixed;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 20px;
  background: rgba(0, 0, 0, 0.95);
}

.close {
  position: absolute;
  right: 8px;
  top: 12px;
}

#question-container {
  display: flex;
  justify-content: center;
  position: absolute;
  width: 100%;
}

.text {
  text-align: center;  
}

.big-icon {
  font-size: 60px;
  width: 60px;
  height: 60px;
}

.button {
  width: 76px;
  height: 76px;
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
