export const state = () => ({
  user: null,
  account: null,
  login: false,
})

export const getters = {
  login:({login}) => login,
  isAuthenticated: ({ user }) => !!user,
  isPegawai: ({ user }) => !!user.nip,
  isInternal: ({ user }) => !!user.simpusUser,
  user: ({user}) => user,
  account: ({ account }) => account,
  idToken: ({ user }) =>  user.stsTokenManager ? user.stsTokenManager.accessToken : user.token
}

export const actions = {
  setUser({ commit }, user){
    commit('setUser', user)
    this.$axios.defaults.headers.common['token'] = user.stsTokenManager ? user.stsTokenManager.accessToken : user.token
  },
  async userLogout({ commit }) {
    let firebase = await import('firebase/app')
    await import('firebase/auth')
    await firebase.auth().signOut()
    this.$axios.defaults.headers.common['token'] = undefined
    return commit('resetUser')
  },
}

export const mutations = {
  closeLogin(state){
    state.login = false
  },
  openLogin(state){
    state.login = true
  },
  toggleLogin(state, val){
    state.login = val
  },
  setUser(state, newUser) {
    state.user = newUser
  },
  resetUser(state) {
    state.user = null
  },
}