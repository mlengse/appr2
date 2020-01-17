<template lang="pug">
v-dialog(v-model="userDialog" width="500" v-cloak)
	template(v-slot:activator="{ on }")
		v-btn(text v-on="on") {{ user.email || user.phoneNumber }}
	v-card
		v-card-title.headline.grey.lighten-2(primary-title) {{ user.displayName || user.phoneNumber }}
		v-card-text 
			p(v-if='user.photoURL') 
				a.d-inline-block(:href="user.photoURL" target="_blank" title="Click To View")
					img(:src="user.photoURL" width="100" height="100" :alt="imageAlt")
		v-divider
		v-card-actions
			v-spacer
			v-btn(color="error" @click="signOut") Sign Out
</template>

<script>
export default {
	data: () => ({
		userDialog: false
	}),
	computed: {
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
				.catch((error) => {
					console.log(error)
				})
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
