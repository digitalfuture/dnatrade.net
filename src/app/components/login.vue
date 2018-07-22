<template>
  <section id='login' class='top-2'>
    <transition name='fade'>
      <md-button v-if='isConnectionError' class='md-icon-button lavender cloud' aria-label='Error indicator'>
        <md-icon>cloud_off</md-icon>
      </md-button>
    </transition>

    <transition name='fade'>
      <md-button v-if='!isError && isValidating' class='md-icon-button lavender cloud animation-pulse' aria-label='Loading indicator'>
        <md-icon>cloud_queue</md-icon>
      </md-button>

      <md-button v-else v-show='!isError && isLogging' class='md-icon-button lavender cloud animation-pulse' aria-label='Loading indicator'>
        <md-icon>cloud_queue</md-icon>
      </md-button>
    </transition>
  
    <transition name='fade'>
      <md-button v-if='!isValidating' @click.passive='hideLogin' class='md-icon-button close' aria-label='Back to App'>
        <md-icon class='icon dimmed close'>clear</md-icon>
      </md-button>
    </transition>

    <!-- Social login -->
    <transition name='fade'>
      <div id='social-container' v-if='!isLogged && !isLogging && !isValidating'>
        <md-button class='md-icon-button social-button' @click.passive='authenticate("google")' aria-label='Log in with Google Plus'>
          <i class='icon glow social fab fa-google-plus-square'></i>
          <md-tooltip class='hide top-1' md-direction="top">Log in with Google Plus</md-tooltip>
        </md-button>
        
        <!-- <md-button class='md-icon-button social-button' @click.passive='authenticate("facebook")' aria-label='Log in with Facebook'>
          <i class='icon glow social fab fa-facebook-square'></i>
          <md-tooltip class='hide top-1' md-direction="top">Log in with Facebook</md-tooltip>        
        </md-button>
         -->
        <md-button class='md-icon-button social-button' @click.passive='authenticate("twitter")' aria-label='Log in with Twitter'>
          <i class='icon glow social fab fa-twitter-square'></i>
          <md-tooltip class='hide top-1' md-direction="top">Log in with Twitter</md-tooltip>
        </md-button>
      </div>

    <!-- Poloniex connection -->
      <div id='poloniex-api-container' v-else v-show='isLogged && !isAuthorization && !isValidating'>
        <form @submit.stop.prevent="submit">
          <md-input-container>
            <label class='dimmed'><b>POLONIEX</b> <span class='glow'>API KEY</span></label>
            <md-input v-model='poloniexKey' class='glow'></md-input>
            <span v-if='!isValidating' class='md-error poloniex-key-error lavender' :class='isError ? "visible" : ""'>Error</span>
          </md-input-container>
          
          <md-input-container>
            <label class='dimmed'><b>POLONIEX</b> <span class='glow'>API SECRET</span></label>
            <md-input v-model='poloniexSecret' class='glow'></md-input>
            <span v-if='!isValidating' class='md-error poloniex-secret-error lavender' :class='isError ? "visible" : ""'>Error</span>
          </md-input-container>

          <!-- Login button -->
          <transition name='fade'>
            <md-button v-show='isReadyToSubmit' id='authorize' @click.passive='submit'>
              <md-icon class='icon-big glow'>fingerprint</md-icon>
            </md-button>
          </transition>
          <!--  -->
        </form>
      </div>
    </transition>
  </section>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { authenticate, validateKeys } from '../services/auth-api'

export default {
  name: 'login',
  data: () => ({
    poloniexKey: '',
    poloniexSecret: '',
    isError: '',
    isValidating: false
  }),
  computed: {
    ...mapState([
      'isLogged',
      'isLogging',
      'isAuthorized',
      'isConnectionError',
      'isSheduledToUpdate',
      'isAuthorization'
    ]),
    isReadyToSubmit() {
      return this.poloniexKey.length == 35 && this.poloniexSecret.length > 0
    }
  },
  methods: {
    ...mapMutations([
      'hideLogin',
      'login',
      'authorizeApp',
      'startAuthorization',
      'startLogging',
      'showError',
      'hideError',
      'scheduleToUpdate'
    ]),
    authenticate(provider) {
      window.authenticateCallback = () => {
        this.startLogging()
      }

      window.open('/auth/' + provider)
    },
    submit() {
      this.hideError()
      this.isError = false
      this.isValidating = true

      if (this.poloniexKey.length === 35) {
        validateKeys(this.poloniexKey, this.poloniexSecret)
          .then(result => {
            // If keys are invalid, then show an error
            if (result.data == 0) {
              this.isError = true
              this.isValidating = false
            }

            // If keys are valid, then schedule to update
            if (result.data == 1) {
              this.isError = false
              this.scheduleToUpdate()
              this.hideLogin()
              this.isValidating = false
            }
          })
          .catch(e => {
            this.isValidating = false
            this.showError()
            console.error(e)
          })
      } else {
        this.isError = true
        this.isValidating = false
      }
    }
  }
}
</script>

<style scoped>
.cloud {
  position: absolute;
  left: 8px;
  top: 12px;
}

#login {
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

.icon {
  width: 24px;
  height: 24px;
}

.close {
  position: absolute;
  right: 8px;
  top: 12px;
}

.social-button {
  width: 76px;
  height: 76px;
}

.social {
  width: 60px;
  height: 60px;
}

#social-container {
  display: flex;
  justify-content: center;
  position: absolute;
  width: 100%;
}

#poloniex-api-container {
  width: 100%;
  margin: auto;
}

#poloniex-api-container form {
  display: flex;
  flex-direction: column;
  margin: auto;
  max-width: 600px;
}

input {
  -webkit-text-fill-color: initial !important;
  padding-left: 5px;
}

.md-input-container.md-input-focused:after {
  margin-bottom: 4px;
  opacity: 0.2;

  height: 25px !important;
  background-color: #9e9e9e;
  padding-left: 5px;
}

#authorize {
  margin: auto;
  border-radius: 50%;
  width: 96px;
  height: 96px;
  padding: 0;
  margin-top: 56px;
}

.icon-big {
  font-size: 96px;
  width: 96px;
  height: 96px;
  margin: auto;
  opacity: 0.2;
}

.visible {
  opacity: 1;
}
</style>
