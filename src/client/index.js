import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'
import VueMaterial from 'vue-material'

import app from './app.vue'
import store from './store/store'

// Vue.config.devtools = true

// Vue MAterial
Vue.use(VueMaterial.MdCore) //Required to boot vue material
Vue.use(VueMaterial.MdButton)
Vue.use(VueMaterial.MdIcon)
Vue.use(VueMaterial.MdImage)
Vue.use(VueMaterial.MdToolbar)
Vue.use(VueMaterial.MdButton)
Vue.use(VueMaterial.MdCard)
Vue.use(VueMaterial.MdLayout)
Vue.use(VueMaterial.MdSwitch)
Vue.use(VueMaterial.MdTable)
Vue.use(VueMaterial.MdTooltip)
Vue.use(VueMaterial.MdInputContainer)

Vue.material.registerTheme('shades', {
  primary: {
    color: 'grey',
    hue: 500
  },
  accent: {
    color: 'blue-grey',
    hue: 500
  }
})

Vue.material.setCurrentTheme('shades')

//
//
const vm = new Vue({
  store,
  el: '#app',
  components: { app },
  render: h => h('app')
})

Vue.config.errorHandler = (err, vm, info) => {
  // vm.$store._mutations.showError()
  console.log('vm:', vm)
  console.log('Error:', err)
  console.log('Info:', info)
}

// Vue.config.silent = true

if (vm) {
  console.log('Dev mode')
}
