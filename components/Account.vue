<template lang="pug">
v-dialog(v-model="userDialog" width="500" v-cloak)
	template(v-slot:activator="{ on }")
		v-btn(text v-on="on" icon)
			v-avatar(v-if='user.photoURL' size='36' color='Math.random()*0xFFFFFF<<0).toString(16)')
				img(:src="user.photoURL" :alt="imageAlt")
			v-icon(v-else dark) mdi-account-circle
	v-card
		v-card-title.headline.grey.lighten-2(primary-title) Data Pengguna
		v-card-text 
			p
			p(v-if='user.photoURL') 
				a.d-inline-block(:href="user.photoURL" target="_blank" title="Click To View")
					img(:src="user.photoURL" width="100" height="100" :alt="imageAlt")
			p(v-if='user.displayName') Nama: {{ user.displayName }}
			p(v-if='user.email') Email: {{ user.email }}
			p(v-if='user.phoneNumber') Nomor HP: {{ user.phoneNumber }}
			v-btn(v-if='!isPegawai' small text color='primary') Login Pegawai 
			v-btn(v-if='!isInternal' small text color='primary') Login Simpus 
		v-divider
		v-card-actions
			v-spacer
			v-btn(color="error" small @click="signOut") Sign Out
</template>

<script>
export default {
	data: () => ({
		userDialog: false
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
		}
	}
}
</script>

<style lang="css" scoped>
	.profile-image img {
		border-radius: 100px;
		overflow: hidden;
		border: 2px solid #b2b1b0;
	}
</style>
