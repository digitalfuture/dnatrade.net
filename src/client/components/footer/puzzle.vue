<template>
  <section>
    <!-- Roadmap -->
    <div id='roadmap'>
      <!--  -->
      <!--  -->
      <transition name='fade'>
        <!-- Is Not Logged Puzzle -->
        <div v-if='!isLogged' class='puzzle-1 puzzle'>
          <!-- Background icon -->
          <md-icon class='puzzle-icon dimmed top-7 inactive'>extension</md-icon>
        </div>
        <!-- Is Logged Puzzle -->
        <div v-else class='puzzle-1 puzzle'>
          <!-- Background icon -->
          <md-icon class='puzzle-icon dimmed top-7'>extension</md-icon>
          <!-- Text -->
          <div class='puzzle-text-container top-6' @click.passive='showLogout'>
            <div class='glow'><b>LOGGED</b></div>
            <div class='lavender'><span class='hand-write'>in</span></div>
          </div>
        </div>
      </transition>
      <!--  -->
      <!--  -->
      <transition name='fade'>
        <!-- Is Not Authorized Puzzle -->
        <div v-if='!isAuthorized' class="puzzle-2 puzzle">
          <!-- Background icon -->
          <md-icon class='puzzle-icon dimmed top-7 inactive'>extension</md-icon>
        </div>
        <!-- Is authorized Puzzle -->
        <div v-else class="puzzle-2 puzzle">
          <!-- Background icon -->
          <md-icon class='puzzle-icon dimmed top-7'>extension</md-icon>
          <!-- Text -->
          <div class='puzzle-text-container top-6' @click.passive='showResetKeys'>
            <div class='glow'><b>KEYS</b></div> 
            <div class='lavender'><span class='hand-write'>presented</span></div>
          </div>
        </div>
      </transition>
      <!--  -->
      <!--  -->
      <!-- Is Not Logged Puzzle -->
      <div class="puzzle-3 puzzle inactive">
        <!-- Background icon -->
        <md-icon class='puzzle-icon dimmed top-6'>extension</md-icon>
      </div>
      <!-- Is Logged Puzzle --> 
    </div>
    <!--  -->
    <md-toolbar class='md-transparent remove-on-middle'></md-toolbar>
    <!--  -->
  </section>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'puzzle',
  computed: {
    ...mapState(['isLogged', 'isAuthorized']),
    ...mapGetters(['isCurrenciesReady'])
  },
  methods: {
    ...mapMutations(['showLogout', 'showResetKeys'])
  }
}
</script>
<style scoped>
.puzzle {
  margin-left: -35px;
  width: 150px;
  height: 150px;
}

.puzzle-icon {
  position: absolute;
  font-size: 210px;
  opacity: 0.4;
}

.inactive {
  cursor: default;
  opacity: 0.3;
}

.puzzle-text-container {
  position: absolute;
  display: flex;
  flex-direction: column;
  padding-left: 75px;
  padding-top: 60px;
  cursor: pointer;
}

#roadmap {
  margin: auto;
  display: grid;
}

.puzzle-1 {
  grid-row: 1;
  grid-column: 1;
}

.puzzle-2 {
  grid-row: 1;
  grid-column: 2;
}

/* Resonsive design */
@media only screen and (max-width: 600px) {
  #roadmap {
    width: 300px;
  }

  .puzzle-3 {
    grid-row: 2;
    grid-column: 2;
  }
}

@media only screen and (min-width: 601px) {
  #roadmap {
    width: 450px;
  }

  .puzzle-3 {
    grid-row: 1;
    grid-column: 3;
  }

  .remove-on-middle {
    display: none;
  }
}

@media only screen and (min-width: 961px) {
  #roadmap {
    width: 300px;
  }

  .puzzle-3 {
    grid-row: 2;
    grid-column: 2;
  }
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