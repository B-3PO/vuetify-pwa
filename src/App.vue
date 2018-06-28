<template>
  <v-app>
    <v-toolbar
      app
    >
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn depressed round small v-if="!loading && !signedIn" @click.native.stop="loginDialog = true">Sign-in</v-btn>
      <v-menu offset-y v-if="signedIn">
        <v-btn depressed round small slot="activator" color="primary" dark>{{ email }}</v-btn>
        <v-list>
          <v-list-tile @click="signout()">
            <v-list-tile-title>Sign-out</v-list-tile-title>
          </v-list-tile>
        </v-list>
    </v-menu>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
    <v-navigation-drawer
      width="500"
      persistent
      right
      :mini-variant="miniVariant"
      :clipped="false"
      v-model="rightDrawer"
      fixed
      app
    >
      <v-list>
        <v-list-tile
          value="true"
          v-for="(item, i) in items"
          :key="i"
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
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

<script>
import orderBuilder, { config } from 'bypass-ordering-sdk/dist/browser'

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
      miniVariant: false,
      rightDrawer: false,
      title: 'Order',
      signedIn: false,
      loginDialog: false,
      passwordToggle: true,
      signinValid: null,
      password: null,
      email: null,
      loading: true,
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
      return config.signout()
        .then(() => {
          this.signedIn = false
          this.password = ''
          this.email = ''
        })
        .catch(e => {
          console.error(e)
        })
    }
  },

  created () {
    config.onLoad(() => {
      this.signedIn = config.signedin
      this.email = config.email
      this.loading = false
    })

    this.onChangeDestroy = orderBuilder.onChange((message) => {
      this.rightDrawer = !!orderBuilder.order
    })
  },

  destroyed () {
    this.onChangeDestroy()
  },

  name: 'App'
}
</script>
