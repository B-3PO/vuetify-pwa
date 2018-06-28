<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout row>

        <v-flex xs6 offset-xs3>
          <v-list>
            <template v-for="(item, index) in items">
              <v-subheader v-if="item.category">{{ item.name }}</v-subheader>
              <v-divider v-if="index > 0 && !item.category" inset></v-divider>
              <v-list-tile v-if="!item.category" :key="item.item.name" avatar ripple @click="viewMenuItem(item.id)">
                <v-list-tile-avatar>
                  <v-icon>home</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title v-html="item.item.name"></v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
        </v-flex>

      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
import orderBuilder from 'bypass-ordering-sdk/dist/browser'
import router from '../router'

export default {
  data () {
    return {
      selected: null,
      items: null
    }
  },

  methods: {
    viewMenuItem: (id) => {
      router.push({ name: 'item', params: { id: id } })
    }
  },

  created () {
    orderBuilder.getMenu().then(menu => {
      console.log(menu)
      this.items = menu.categories.reduce((a, b) => {
        b.category = true
        return a.concat(b).concat(b.menuItems)
      }, [])
    })
  }
}
</script>
