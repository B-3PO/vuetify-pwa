<template>
  <v-app>
    <v-toolbar
      app
      :extended="extendToolbar"
    >
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn depressed round small v-if="loaded && !signedIn" @click.native.stop="loginDialog = true">Sign-in</v-btn>
      <v-menu offset-y v-if="signedIn">
        <v-btn depressed round small slot="activator" color="primary" dark>{{ email }}</v-btn>
        <v-list>
          <v-list-tile @click="signout()">
            <v-list-tile-title>Sign-out</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>

      <v-toolbar-items v-if="extendToolbar" slot="extension">
        <v-layout row class="scroll-x" ref="category-scroll-container">
          <v-btn small v-for="category in categories" :key="category.id" :to="'/menu/'+category.name" @click="centerCategory($event)" flat ripple>{{category.name}}</v-btn>
        </v-layout>
      </v-toolbar-items>

    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
    <v-navigation-drawer
      width="400"
      persistent
      right
      v-model="rightDrawer"
      app
    >
      <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <v-icon>local_dining</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>Order</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-list class="pt-0" dense>
        <v-divider></v-divider>
        <v-list-tile v-for="item in lineItems" :key="item.id" @click="">
          <v-list-tile-action>
            <v-icon>fastfood</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.name }}</v-list-tile-title>
            <v-list-tile-sub-title v-for="selected in item.selectedOptions()" :key="selected.uuid">{{ selected.name }}  ${{ selected.price }}</v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-list-tile-action-text>${{ item.price }}</v-list-tile-action-text>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>

      <v-toolbar flat class="transparent" style="position: absolute; bottom: 0; left: 0; right: 0;" height="240">
        <v-list dense>
          <v-divider></v-divider>
          <v-list-tile>
            <v-list-tile-content><v-list-tile-title>Subtotal</v-list-tile-title></v-list-tile-content>
            <v-list-tile-action><v-list-tile-action-text>${{ calculations ? calculations.subtotal : 0 }}</v-list-tile-action-text></v-list-tile-action>
          </v-list-tile>

          <v-list-tile>
            <v-list-tile-content><v-list-tile-title>Tax total</v-list-tile-title></v-list-tile-content>
            <v-list-tile-action><v-list-tile-action-text>${{ calculations && calculations.combinedTaxes ? calculations.combinedTaxes.total : 0 }}</v-list-tile-action-text></v-list-tile-action>
          </v-list-tile>

          <v-list-tile>
            <v-list-tile-content><v-list-tile-title>Surcharge total</v-list-tile-title></v-list-tile-content>
            <v-list-tile-action><v-list-tile-action-text>${{ calculations && calculations.orderDiscount ? calculations.orderDiscount.amount : 0 }}</v-list-tile-action-text></v-list-tile-action>
          </v-list-tile>

          <v-list-tile>
            <v-list-tile-content><v-list-tile-title>Order discount</v-list-tile-title></v-list-tile-content>
            <v-list-tile-action><v-list-tile-action-text>${{ calculations && calculations.surcharges ? calculations.surcharges.total : 0 }}</v-list-tile-action-text></v-list-tile-action>
          </v-list-tile>

          <v-list-tile>
            <v-list-tile-content><v-list-tile-title>Gratuity</v-list-tile-title></v-list-tile-content>
            <v-list-tile-action><v-list-tile-action-text>${{ calculations && calculations.gratuity ? calculations.gratuity.total : 0 }}</v-list-tile-action-text></v-list-tile-action>
          </v-list-tile>

          <v-list-tile>
            <v-list-tile-content><v-list-tile-title style="font-size: 18px;"><b>Total</b></v-list-tile-title></v-list-tile-content>
            <v-list-tile-action><v-list-tile-action-text style="font-size: 20px;"><b>${{ calculations ? calculations.total : 0 }}</b></v-list-tile-action-text></v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-toolbar>
    </v-navigation-drawer>

    <v-dialog v-model="loginDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-form ref="signinForm" v-model="signinValid" lazy-validation>
        <v-toolbar flat color="white">
          <v-btn icon card @click.native="loginDialog = false"><v-icon>close</v-icon></v-btn>
          <v-toolbar-title>Sign-in</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>

        <v-divider></v-divider>

        <v-container fluid>
          <v-layout column align-center>
            <v-flex>
              <v-text-field
                style="width: 240px"
                v-model="email"
                :rules="[rules.required, rules.email]"
                label="E-mail"
              ></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field
                style="width: 240px"
                v-model="password"
                :append-icon="passwordToggle ? 'visibility' : 'visibility_off'"
                :append-icon-cb="() => (passwordToggle = !passwordToggle)"
                :type="passwordToggle ? 'password' : 'text'"
                label="Password"
                hint="At least 9 characters"
                min="9"
                counter
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat="flat" @click="signin(email, password)" :disabled="!signinValid">Sign-in</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<style>
.scroll-x {
  overflow-x: scroll;
}
</style>

<script>
import orderBuilder, { config } from 'bypass-ordering-sdk/dist/browser'
import router from './router'

export default {
  data () {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      items: [{
        icon: 'bubble_chart',
        title: 'Inspire'
      }],
      lineItems: [],
      total: 0,
      calculations: undefined,
      miniVariant: false,
      rightDrawer: false,
      title: 'Order',
      signedIn: false,
      loginDialog: false,
      passwordToggle: true,
      signinValid: null,
      password: null,
      email: null,
      loaded: false,
      extendToolbar: false,
      categories: [],
      rules: {
        required: (value) => !!value || 'Required.',
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        }
      }
    }
  },

  methods: {
    signin: function () {
      return config.signin(this.email, this.password)
        .then(() => {
          this.loginDialog = false
          this.signedIn = true
          this.password = ''
        })
        .catch(e => {
          console.error(e)
        })
    },

    signout: function () {
      config.signout()
      this.signedIn = false
      this.password = ''
      this.email = ''
    },

    centerCategory ($event) {
      let center = this.$refs['category-scroll-container'].getBoundingClientRect().width / 2
      let buttonCenter = $event.target.parentNode.offsetLeft + ($event.target.parentNode.getBoundingClientRect().width / 2)
      this.$refs['category-scroll-container'].scrollTo(buttonCenter - center, 0)
    },

    onScroll (e) {
      console.log('opkokok')
      // console.log(window.pageYOffset || document.documentElement.scrollTop)
      // this.offsetTop = window.pageYOffset || document.documentElement.scrollTop
    }
  },

  created () {
    config.onConfigured(() => {
      this.signedIn = config.signedin
      this.email = config.user ? config.user.email : undefined
      this.loaded = true
    })

    config.onChange(() => {
      this.signedIn = config.signedin
      this.email = config.user ? config.user.email : undefined
      this.loaded = true
    })

    this.onChangeDestroy = orderBuilder.onChange((message) => {
      this.rightDrawer = !!orderBuilder.order
      if (orderBuilder.order) {
        this.lineItems = orderBuilder.order.lineItems
        this.calculations = orderBuilder.order.calculations
        this.categories = orderBuilder.menu.categories
      } else {
        this.lineItems = []
        this.calculations = undefined
        this.categories = []
      }
    })

    router.onReady(() => {
      this.extendToolbar = router.history.current.name === 'menu'
    })
    router.afterEach(route => {
      this.extendToolbar = route.name === 'menu'
    })
  },

  destroyed () {
    this.onChangeDestroy()
  },

  name: 'App'
}
</script>
