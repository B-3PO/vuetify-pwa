<template>
  <v-container fluid>
    <v-card flat>
      <v-card-media
        :src="lineItem.image || 'https://a07979a954be8a315ca4-84a6e28d8f0f268ef46f6c136379af96.ssl.cf3.rackcdn.com/assets/shared/lazy-load-placeholder-e2089ac2957349687fcdad918b88fae8ce4d5c94be8023969bb6fb910212ba91.png'"
        height="200px"
      ></v-card-media>

      <v-card-title primary-title>
        <div>
          <h3 class="headline mb-0">{{lineItem.name}}</h3>
          <div>{{lineItem.description}}</div>
        </div>
      </v-card-title>

      <v-card-actions>
        <v-btn v-if="lineItem.order" flat color="orange" @click="lineItem.remove()">remove from order</v-btn>
        <v-btn v-if="!lineItem.order" flat color="primary" @click="addToOrder()">add to order</v-btn>
      </v-card-actions>
    </v-card>
    <v-divider></v-divider>
    <v-list
      subheader
    >
      <template v-for="(group, index) in modifiers">
        <v-subheader v-if="group.group">{{ group.name }}</v-subheader>

        <v-list-tile v-if="!group.group" :key="group.id" @click="">
          <v-list-tile-action>
            <v-icon v-if="group.selected" color="primary">remove_circle</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{group.name}}</v-list-tile-title>
          </v-list-tile-content>

          <v-list-tile-action>
            <v-list-tile-action-text style="font-size: 18px; font-weight: bold;">${{ group.price }}</v-list-tile-action-text>
          </v-list-tile-action>
          <v-list-tile-action>
            <v-btn icon ripple @click="group.select()">
              <v-icon color="grey lighten-1">add</v-icon>
            </v-btn>
          </v-list-tile-action>
          <v-list-tile-action>
            <v-btn icon ripple @click="group.select()">
              <v-icon color="grey lighten-1">remove</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </template>
    </v-list>
  </v-container>
</template>

<style>
.text-shadow {
  text-shadow: 0px 0px 10px #000000bf
}
</style>

<script>
import orderBuilder from 'bypass-ordering-sdk/dist/browser'

export default {
  data () {
    return {
      lineItem: { },
      modifiers: []
    }
  },

  methods: {
    addToOrder: function () {
      orderBuilder.order.addLineItem(this.lineItem)
    }
  },

  async created () {
    if (!orderBuilder.location) {
      let locations = await orderBuilder.getLocations()
      await orderBuilder.setLocation(locations[0])
      await orderBuilder.getMenu()
    }

    this.lineItem = await orderBuilder.getLineItem(this.$route.params.id)
    console.log(this.lineItem)
    this.modifiers = this.lineItem.modifierGroups.reduce((a, b) => {
      b.group = true
      return a.concat(b).concat(b.modifierOptions)
    }, [])
  }
}
</script>
