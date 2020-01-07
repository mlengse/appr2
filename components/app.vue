<template lang="pug">
v-card
  v-card-text
    template(v-if="show")
      v-container
        template(v-if='open')
          h2 Hello, {name}
          v-text-field( v-model="form.name" placeholder="Your name")
          p Response: {{ response }}
          p(v-if="error" style="color:red;")
            strong Error {{ error.status }}
            br 
            | {{ error.data }}
    template(v-else)
      .headline.text-center Welcome
      hr.my-3
      blockquote.blockquote &#8220;First, solve the problem. Then, write the code.&#8221;
      .text-xs-right
        em
          small &mdash; John Leider &mdash;
  v-card-actions
    v-spacer
    v-btn(v-if="show" @click="show=false;open=false") Back
    v-btn.ma-2(@click="helloName(form.name)" color="primary") 👋 Say hello
</template>

<script>
export default {
  name: 'Example2',
  data() {
    return {
      show: false,
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
      if(!this.show) {
        this.show = true
        this.open = true
        return
      }
      if(!this.open) {
        this.open = true
        return
      }
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
