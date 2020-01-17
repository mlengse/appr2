<template lang="pug">
v-dialog(v-model="loginDialog" width="500")
  template(v-slot:activator="{ on }")
    v-btn(text v-on="on" ) Masuk
  v-card
    v-container
      client-only
        #firebaseui-auth-container  
</template>

<script>

export default {
	middleware: 'anonymous',
	watch: {
		user (to, from) {
			this.$emit('close')
    },
    async loginDialog(val) {
      if(val){
        let vm = this
        try{
          const { auth } = await import('firebase/app')
          await import('firebase/auth')
          const authProviders = {
            Google: auth.GoogleAuthProvider.PROVIDER_ID,
            // Facebook: auth.FacebookAuthProvider.PROVIDER_ID,
            // Twitter: auth.TwitterAuthProvider.PROVIDER_ID,
            Email: auth.EmailAuthProvider.PROVIDER_ID,
            Phone: auth.PhoneAuthProvider.PROVIDER_ID,
          }

          const firebaseui = await import('firebaseui')

          let ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth())
          const config = {
            signInFlow: 'popup',
            signInOptions: [
              authProviders.Google,
              // authProviders.Facebook,
              // authProviders.Twitter,
              authProviders.Email,
              {
                provider: authProviders.Phone,
                defaultCountry: 'ID',
                whitelistedCountries: ['ID', '+62']
              },
            ],
            tosUrl: '/tos',
            privacyPolicyUrl: '/privacy-policy',
            callbacks: {
              signInSuccessWithAuthResult(authResult) {
                vm.$store.commit('users/setUser', JSON.parse(JSON.stringify(authResult.user)))
                vm.$nuxt.$loading.finish()
                // vm.$toast.success('login sukses')
                
                return false
              },
              signInFailure(error) {
                // vm.$toast.error('ada error')
                return false;
              },
            }
          }

          ui.start('#firebaseui-auth-container', config)
        }catch(err){
          throw err
        }
      }
    }
  },
  data: () => ({
    loginDialog: false
  }),
	computed: {
		user(){
			return this.$store.getters['users/user']
		}
	},
  async mounted() {
  }
}
</script>

<style src='~/node_modules/firebaseui/dist/firebaseui.css'>

</style>
