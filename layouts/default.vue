<template lang="pug">
  v-app
    v-navigation-drawer(app v-model='drawer' temporary)
      v-list-item(link to='/')
        v-list-item-content
          v-list-item-title.title Aplikasi
          v-list-item-subtitle Puskesmas Jayengan
      v-divider
      v-list(v-if="user" dense nav)
        v-list-item(v-for="item in items" :key="item.title" link :to="item.link")
          v-list-item-icon
            v-icon {{ item.icon }}
          v-list-item-content
            v-list-item-title {{ item.title }}
    v-app-bar(app dense color='primary' dark)
      v-app-bar-nav-icon(@click="()=> drawer = !drawer")
      v-toolbar-title Puskesmas Jayengan
      v-spacer
      Account(v-if="user")
      Login(v-else)
    v-content
      v-container(fluid)
        nuxt(v-if='user')
        v-layout( v-else column justify-center align-center)
          v-flex.text-center( xs12 sm8 md6)
            p Silahkan login terlebih dahulu
</template>

<script>
export default {
  components: {
		Login: () => import('~/components/Login-Google.vue'),
		Account: () => import('~/components/Account.vue'),
	},
	data() {
		return {
      drawer: null,
      items: [
        {
          title: 'Data Stok Obat',
          icon: 'mdi-clipboard-file-outline',
          link: '/stok_obat'
        },{
          title: 'Data Obat Masuk',
          icon: 'mdi-clipboard-file-outline',
          link: '/obat_masuk'
        },{
          title: 'Data Obat Keluar',
          icon: 'mdi-clipboard-text-multiple-outline',
          link: '/obat_keluar'
        }
      ]
		}
  },
  methods: {
		closeLogin() {
			this.$store.commit('users/closeLogin')
		},
		openLogin() {
			this.$store.commit('users/openLogin')
		},
	},
	watch: {
		login: function(val) {
			this.loginShow = val
		},
		loginShow: function(val) {
			this.$store.commit('users/toggleLogin', val)
		}
	},
	computed: {
		login(){
			return this.$store.getters['users/login']
		},
		user(){
			return this.$store.getters['users/user']
		}
	}
}
</script>