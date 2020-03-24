import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    viewModel:'Dating'
  },
  mutations: {
    SET_STATE:(state, { key, val} ) =>{
      if(state.hasOwnProperty(key)){
        state[key] = val
      }
    }
  },
  actions: {
    toggleView({commit},val){
      commit('SET_STATE',{ key:'viewModel',val } )
    }
  },
  modules: {

  }
})
