import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

Vue.use(Vuex)

export function createStore () {
  return new Vuex.Store({
    state: {
      constants: {
        PLAID_CLIENT_ID: "5a150929bdc6a46838fe6677",
        PLAID_SECRET: "ebff980409fe8fa1a922c93a679c9d",
        PLAID_PUBLIC_KEY: "c9968cf932e1aee4ae2d3b776b2231",
        PLAID_ENV: "sandbox",
        GOOGLE_CUSTOM_SEARCH_KEY: "AIzaSyBHaKiNHrMsH__GK5tkNfaQ01UDcTsCCCc"
      },
      activeType: null, 
      itemsPerPage: 20,
      items: {/* [id: number]: Item */},
      users: {/* [id: string]: User */},
      lists: {
        top: [/* number */],
        new: [],
        show: [],
        ask: [],
        job: []
      }
    },
    actions,
    mutations,
    getters
  })
}
