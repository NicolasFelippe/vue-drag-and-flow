import Vue from 'vue'
import Vuex from 'vuex'
import flow from './module-flow'
Vue.use(Vuex)

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      flow,
    },
    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.PROD
  })

  return Store
}