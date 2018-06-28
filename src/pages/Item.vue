<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout row>
        <h2>{{menuItem.name}}</h2>

      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
import orderBuilder from 'bypass-ordering-sdk/dist/browser'

export default {
  data () {
    return {
      menuItem: { }
    }
  },

  methods: {
  },

  async created () {
    this.menuItem = await orderBuilder.getMenuItem(this.$route.params.id)
  }
}
</script>
