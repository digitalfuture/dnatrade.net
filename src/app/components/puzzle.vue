<template>
  <section>
    <!--  -->
    <md-toolbar class='md-transparent'></md-toolbar>
    <!-- Road map -->
    <div id='roadmap'>
      <div class='puzzle-1 puzzle'>
        <!-- Background icon -->
        <md-icon class='puzzle-icon dimmed top-6'>extension</md-icon>
        <!-- Text -->
        <div class='puzzle-text-container top-5'>
          <div class='glow'><b>LOGGED</b></div>
          <div class='lavender'><span class='hand-write'>in</span></div>
        </div>
      </div>
      <!--  -->
      <div class="puzzle-2 puzzle">
        <!-- Background icon -->
        <md-icon class='puzzle-icon dimmed top-6'>extension</md-icon>
        <!-- Text -->
        <div class='puzzle-text-container top-5'>
          <div class='glow'><b>KEYS</b></div> 
          <div class='lavender'><span class='hand-write'>presented</span></div>
        </div>
      </div>
      <!--  -->
      <div class="puzzle-3 puzzle inactive">
        <!-- Background icon -->
        <md-icon class='puzzle-icon dimmed top-6'>extension</md-icon>
        <!-- Text -->
        <div class='puzzle-text-container top-5'>
          <div class='glow'></div> 
          <div class='lavender'><span class='hand-write'></span></div>
        </div>
      </div>
    </div>
    <!--  -->
    <md-toolbar class='md-transparent'></md-toolbar>
    <!--  -->
  </section>  
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'puzzle',
  computed: {
    ...mapState(['isLogged']),
    ...mapGetters(['isCurrenciesReady'])
  }
}
</script>

<style scoped>
#roadmap {
  margin: auto;
  width: 300px;
  display: grid;
}

.puzzle {
  margin-left: -35px;
  cursor: pointer;
  width: 150px;
  height: 150px;
}

.puzzle-icon {
  position: absolute;
  font-size: 210px;
  opacity: 0.5;
}

.inactive {
  cursor: default;
  opacity: 0.2;
}

.puzzle-text-container {
  position: absolute;
  display: flex;
  flex-direction: column;
  padding-left: 75px;
  padding-top: 60px;
  width: 400px;
}

.puzzle-1 {
  grid-row: 1;
  grid-column: 1;
}

.puzzle-2 {
  grid-row: 1;
  grid-column: 2;
}

.puzzle-3 {
  grid-row: 2;
  grid-column: 2;
}
</style>