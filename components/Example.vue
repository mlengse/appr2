<template lang="pug">
  v-container
    template(v-if="open")
      h2 Puppeteer Demo
      v-text-field( v-model="form.url" placeholder="URL")
      v-btn.ma-2( @click="helloName" color="primary") Screenshot!
      v-btn.ma-2( @click="open=false") tutup
      p(v-if="!img") {{ response }}
      img(v-else :src="src")
      p(v-if="error" style="color:red;")
        strong Error {{ error.status }}
        br 
        | {{ error.data }}
    v-btn(v-else @click="open=true") Puppeteer Demo
</template>

<script>
export default {
  name: 'Example',
  data() {
    return {
      open: false,
      form: {
        url: 'https://bitsofco.de'
      },
      response: '',
      error: null,
      img:false,
      src:null
    }
  },
  computed: {
    option(){
      return {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ pageToScreenshot: this.form.url })
      }
    }
  },
  methods: {
    bufferToImageUrl(buffer) {
      let arrayBufferView = new Uint8Array( buffer );
      let blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
      let urlCreator = window.URL || window.webkitURL;
      let imageUrl = urlCreator.createObjectURL( blob );
      return imageUrl;
    },
    async helloName() {
      this.response = 'Please wait...'
      try {
        const resp = await fetch("/.netlify/functions/ekin", this.option)
        const res = await resp.json()
        if(!res.buffer) {
          this.response = 'Error capturing screenshot'
        } else {
          this.img = true
          this.src = this.bufferToImageUrl(res.buffer.data)
        }
        this.error = null
      } catch (e) {
        this.error = e.response
        this.response = `Error: ${e.toString()}`
      }
    }
  }
}
</script>
