import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import exercise from "./modules/exercise"

export default new Vuex.Store({
  modules:{
    exercise
  },
  state: {
    loading:false,
    
  },
  mutations: {

  },
  actions: {

  }
})
