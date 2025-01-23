// store.js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isAdminLoggedIn: false,
    showContactModal: false,
    showAccountModal: false,
    isDetailsVisible: false,
  },
  mutations: {
    setAdminLoggedIn(state, status) {
      state.isAdminLoggedIn = status;
    },
    openModal(state, modalName) {
      state[modalName] = true;
    },
    closeModal(state, modalName) {
      state[modalName] = false;
    },
  },
  actions: {
    toggleModal({ commit }, { modalName, status }) {
      commit(status ? 'openModal' : 'closeModal', modalName);
    },
  },
});
