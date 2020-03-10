<template lang="pug">
v-dialog(v-model="userDialog" width="500" v-cloak)
	template(v-slot:activator="{ on }")
		v-btn(text v-on="on" icon)
			v-avatar(v-if='user.fotoPeg || user.photoURL' size='36' color='Math.random()*0xFFFFFF<<0).toString(16)')
				img(:src="user.fotoPeg || user.photoURL" :alt="imageAlt")
			v-icon(v-else dark) mdi-account-circle
	v-card
		v-card-title.headline.grey.lighten-2(primary-title) Data Pengguna
		v-card-text 
			p
			p(v-if='user.fotoPeg || user.photoURL ') 
				v-avatar(v-if='user.fotoPeg || user.photoURL' size='90' color='Math.random()*0xFFFFFF<<0).toString(16)')
					img(:src="user.fotoPeg || user.photoURL" :alt="imageAlt")
			p(v-if='user.displayName') Nama: {{ user.displayName }}
			p(v-if='user.email') Email: {{ user.email }}
			p(v-if='user.phoneNumber') Nomor HP: {{ user.phoneNumber }}
			p(v-if='user.nip') NIP: {{ user.nip }}
			v-divider
			v-btn(v-if='!isPegawai' small text @click='showPegawaiCheck') hubungkan akun kepegawaian
			v-form(v-if="showPegawai" ref="forms" v-model="valid" :lazy-validation="lazy" )
				v-text-field( 
					label="NIP" 
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
				v-btn(
					v-if="!!(form.username && form.username.length === 18 && !isNaN(form.username) && form.password)" 
					small 
					outlined 
					color='primary' 
					@click='masuk'
				) hubungkan
			p(v-if='response') Response: {{ response }}
			p(v-if="error" style="color:red;")
				strong Error {{ error.status }}
				br 
				| {{ error.data }}
			v-btn(v-if='!isInternal' small text color='primary') Login Simpus 
		v-divider
		v-card-actions
			v-spacer
			v-btn(color="error" small @click="signOut") Sign Out
</template>

<script>
export default {
	data: () => ({
		userDialog: false,
		showPegawai: false,
		showPassword: false,
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
	computed: {
		isPegawai() {
			return this.$store.getters['users/isPegawai']
		},
		isInternal() {
			return this.$store.getters['users/isInternal']
		},
		user() {
			return this.$store.getters['users/user']
		},
		account() {
			return this.$store.getters['users/account']
		},
		imageAlt () {
			return `Profile image for ${this.user.displayName}`
		}
	},
	methods: {
		signOut () {
			this.$store.dispatch('users/userLogout')
				.then(() => {
					this.$router.go(0)
				})
				// .catch((error) => {
				// 	console.log(error)
				// })
		},
		async showPegawaiCheck(){
			let res = await this.$axios.get('/peg')
			if(res.data && res.data.nip) {
				this.showPegawai = false
				this.$store.dispatch('users/setUser', res.data)
			} else {
				this.showPegawai = true
			}
		},
		async masuk() {
      if (this.$refs.forms.validate()) {
        //this.response = JSON.stringify(this.form)
        try {
					const res = await this.$axios.post( '/peg', this.form)
					if(res.data && res.data.nip) {
						this.showPegawai = false
						this.$store.dispatch('users/setUser', res.data)
					} else {
						this.showPegawai = true
					}
          // this.response = res.data
          this.error = null
        } catch (e) {
          this.error = e.response
          this.response = '—'
        }
      }
    }

	}
}
</script>