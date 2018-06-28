// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import {
  Vuetify,
  VApp,
  VNavigationDrawer,
  VFooter,
  VList,
  VBtn,
  VIcon,
  VGrid,
  VToolbar,
  VSelect,
  VSubheader,
  VDivider,
  VDialog,
  VCard,
  VTextField,
  VForm,
  VMenu,
  transitions
} from 'vuetify'
import '../node_modules/vuetify/src/stylus/app.styl'
import { config } from 'bypass-ordering-sdk/dist/browser'
Vue.use(Vuetify, {
  components: {
    VApp,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VToolbar,
    VSelect,
    VSubheader,
    VDivider,
    VDialog,
    VCard,
    VTextField,
    VForm,
    VMenu,
    transitions
  }
})

Vue.config.productionTip = false
config.setEnvironment('integration')
config.configure({
  venueId: 86,
  locationId: 21549
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
