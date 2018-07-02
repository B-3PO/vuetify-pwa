<template>
  <v-container fluid grid-list-md>
    <v-layout column wrap
      v-for="category in categories" :key="category.id"
    >
      <v-layout row style="padding: 40px 20px 20px 20px">
        <span class="headline" :id="`category-${fixCateogryId(category.name)}`">{{category.name}}</span>
      </v-layout>

      <v-layout row wrap>
        <v-flex xs3
          v-for="item in category.menuItems" :key="item.id"
        >
          <v-card>
            <v-card-media
              :src="item.image || 'https://a07979a954be8a315ca4-84a6e28d8f0f268ef46f6c136379af96.ssl.cf3.rackcdn.com/assets/shared/lazy-load-placeholder-e2089ac2957349687fcdad918b88fae8ce4d5c94be8023969bb6fb910212ba91.png'"
              height="200px"
            ></v-card-media>

            <v-card-title primary-title>
              <div class="title truncate">{{item.name}}</div>
            </v-card-title>
            <v-card-actions>
              <div class="headline" style="padding-left: 8px;">${{item.price}}</div>
              <v-spacer></v-spacer>
              <v-btn fab depressed color="primary" style="top: -4px; left: -4px;" @click="addToOrder(item)">
                <v-icon>add</v-icon>
              </v-btn>
            </v-card-actions>

          </v-card>
        </v-flex>
      </v-layout>
    </v-layout>
  </v-container>
</template>

<style>
.truncate {
  width: 95%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

<script>
import orderBuilder, { config } from 'bypass-ordering-sdk/dist/browser'
import router from '../router'

export default {
  data () {
    return {
      loaded: false,
      selected: null,
      categories: null
    }
  },

  methods: {
    viewMenuItem: (id) => {
      router.push({ name: 'item', params: { id: id } })
    },

    addToOrder: (item) => {
      orderBuilder.order.createLineItem(item)
      console.log(item.modifierGroups)
      if (item.modifierGroups.length) router.push({ name: 'item', params: { id: item.id } })
    },

    scrollToCateogry (category) {
      if (!category) category = this.categories && this.categories.length ? this.categories[0].name : undefined
      if (!category) return

      this.$nextTick(() => {
        let element = document.querySelector(`#category-${this.fixCateogryId(category)}`)
        let pos = element ? element.offsetTop - 150 : 0
        this.$vuetify.goTo(pos)
      })
    },

    fixCateogryId (category) {
      return category.replace(/\s/g, '_').replace(/&/g, '')
    }
  },

  created () {
    config.onConfigured(async () => {
      if (!config.location) {
        router.push('/')
        return
      }

      let menu = await orderBuilder.getMenu()
      if (!orderBuilder.order) orderBuilder.createOrder()
      this.categories = menu.categories
      this.scrollToCateogry(this.$router.history.current.params.category)
      router.afterEach(route => {
        this.scrollToCateogry(route.params.category)
      })
      this.loaded = true
    })
  }
}
</script>
