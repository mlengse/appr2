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
        )
        v-text-field( 
          label="Password"
          v-model="form.password" 
          required
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" 
          :type="showPassword ? 'text' : 'password'"  
          @click:append="showPassword = !showPassword" 
          @keyup.enter="masuk"
        )
      p(v-if='response && !html') Response: {{ response }}
      p(v-if='response && html' v-html="response")
      p(v-if="error" style="color:red;")
        strong Error {{ error.status }}
        br 
        | {{ error.data }}
    template(v-else)
      .headline.text-center Selamat datang
      hr.my-3
      blockquote.blockquote &#8220;Ini adalah aplikasi bantu untuk simpus.&#8221;
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
    html:false,
    showPassword: false,
    show: false,
    lazy: false,
    valid: false,
    form: {
      username: null,
      password: null
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
      this.error = false
    },
    async masuk() {
      if(!this.show) {
        this.show = true
        return
      }

      if (this.$refs.forms.validate()) {
        // this.response = JSON.stringify(this.form)
        try {
          this.response = await this.$axios.$post(`/.netlify/functions/simpus`, this.form)
          if(this.response.includes('><')) {
            this.html = true
          }
          this.error = null
        } catch (e) {
          this.error = e.response
          this.response = false
        }
      }
    }
  }
}
</script>
