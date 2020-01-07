<template lang="pug">
v-card
  v-card-text
    template(v-if="show")
      h2 Login
      v-form(
        ref="forms"
        v-model="valid"
        :lazy-validation="lazy"
      )
        v-text-field( 
          label="Username"
          v-model="form.username"
          required
          :rules="[rules.isNaN]"
          :counter="18" 
        )
        v-text-field( 
          v-if="!!(form.username && form.username.length === 18 && !isNaN(form.username))" 
          label="Password"
          v-model="form.password" 
          required
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" 
          :type="showPassword ? 'text' : 'password'"  
          @click:append="showPassword = !showPassword" 
          @keyup.enter="masuk"
        )
      p(v-if='response') Response: {{ response }}
      p(v-if="error" style="color:red;")
        strong Error {{ error.status }}
        br 
        | {{ error.data }}
    template(v-else)
      .headline.text-center Selamat datang
      hr.my-3
      blockquote.blockquote &#8220;Ini adalah aplikasi untuk approve ekin secara cepat.&#8221;
      .text-xs-right
        em
          small &mdash; kita &mdash;
  v-card-actions
    v-spacer
    v-btn(v-if="show" text @click="kembali") Kembali
    v-btn.ma-2(@click="masuk" color="primary") Masuk
</template>

<script>
export default {
  name: 'Example2',
  data: () => ({
    showPassword: false,
    show: false,
    lazy: false,
    valid: false,
    form: {
      username: null,
      password: null
    },
    rules: {
      isNaN: v => !isNaN(v) || 'input NIP',
    },
    response: false,
    error: null
  }),
  methods: {
    kembali(){
      this.$refs.forms.reset()
      this.$refs.forms.resetValidation()
      this.show = false
      this.response = false
    },
    async masuk() {
      if(!this.show) {
        this.show = true
        return
      }

      if (this.$refs.forms.validate()) {
        this.response = JSON.stringify(this.form)
        // try {
        //   const res = await this.$axios.$get(
        //     // `/.netlify/functions/hello-name?name=${name}`
        //   )
        //   this.response = JSON.stringify(this.form)
        //   this.error = null
        // } catch (e) {
        //   this.error = e.response
        //   this.response = '—'
        // }
      }
    }
  }
}
</script>
