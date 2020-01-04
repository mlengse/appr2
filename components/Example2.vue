<template lang="pug">
  v-container
    template(v-if='open')
      h2 Hello, {name}
      v-text-field( v-model="form.name" placeholder="Your name")
      v-btn.ma-2( @click="helloName(form.name)" color="primary") 👋 Say hello
      v-btn.ma-2( @click="open=false") tutup
      p Response: {{ response }}
      p(v-if="error" style="color:red;")
        strong Error {{ error.status }}
        br 
        | {{ error.data }}
    v-btn(v-else @click='open=true') say hello
</template>

<script>
export default {
  name: 'Example2',
  data() {
    return {
      open: false,
      form: {
        name: ''
      },
      response: '—',
      error: null
    }
  },
  methods: {
    async helloName(name) {
      try {
        const res = await this.$axios.$get(
          `/.netlify/functions/hello-name?name=${name}`
        )
        this.response = res
        this.error = null
      } catch (e) {
        this.error = e.response
        this.response = '—'
      }
    }
  }
}
</script>
