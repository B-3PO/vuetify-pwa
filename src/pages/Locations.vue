<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout row>
        <!-- <h2>Select Location</h2> -->
        <v-flex xs6 offset-xs3>
          <v-list>
            <v-subheader>Select Location</v-subheader>
            <template v-for="(item, index) in items">
              <v-divider v-if="index > 0" inset></v-divider>
              <v-list-tile :key="item.name" avatar ripple @click="select(item)">
                <v-list-tile-avatar>
                  <v-icon>home</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title v-html="item.name"></v-list-tile-title>
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
import orderBuilder, { config } from 'bypass-ordering-sdk/dist/browser'
import router from '../router'

export default {
  data () {
    return {
      loaded: false,
      selected: null,
      items: null
    }
  },

  methods: {
    select: async (item) => {
      this.selected = item
      await orderBuilder.setLocation(item)
      router.push('menu')
    }
  },

  created () {
    config.onConfigured(async () => {
      if (config.location) {
        router.push('menu')
        return
      }
      this.items = await orderBuilder.getLocations()
      this.loaded = true
    })
  }
}
</script>
