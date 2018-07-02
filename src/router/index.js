import Vue from 'vue'
import Router from 'vue-router'
// import orderBuilder from 'bypass-ordering-sdk/dist/browser'
import Locations from '@/pages/Locations'
import Menu from '@/pages/Menu'
import Item from '@/pages/Item'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'locations',
      component: Locations
    },
    {
      path: '/menu/:category?',
      name: 'menu',
      component: Menu,
      beforeEnter: (to, from, next) => {
        // if (!orderBuilder.location) return next(false)
        next()
      }
    },
    {
      path: '/item/:id',
      name: 'item',
      component: Item,
      beforeEnter: (to, from, next) => {
        // if (!orderBuilder.menu) return next(false)
        next()
      }
    }
  ]
})
