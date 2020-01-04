<template lang="pug">
  v-card
    h2 2. Hello, {name}
    v-text-field( v-model="form.name" placeholder="Your name")
    v-btn( @click="helloName(form.name)" color="primary") 👋 Say hello
    p Response: {{ response }}
    p(v-if="error" style="color:red;")
      strong Error {{ error.status }}
      br 
      | {{ error.data }}
</template>

<script>
export default {
  name: 'Example2',
  data() {
    return {
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
