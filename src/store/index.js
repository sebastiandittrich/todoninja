import Vue from 'vue';
import Vuex from 'vuex';
import feathersVuex from 'feathers-vuex';
import feathersClient from '@/assets/js/FeathersClient';
import Task from '@/assets/js/Models/Task'
import { state, getters, mutations, actions } from '@/store/serviceextension'

const { service, auth, FeathersVuex } = feathersVuex(feathersClient, { idField: 'id' });

Vue.use(Vuex);
Vue.use(FeathersVuex);

export default new Vuex.Store({
  state: {

  },
  mutations: {

  },
  actions: {

  },
  plugins: [
    service('tasks', {
      instanceDefaults: Task,
      state,
      getters,
      mutations,
      actions,
    }),
    service('tags', { state, getters, mutations, actions }),
    service('workspaces', { state, getters, mutations, actions }),
    service('users', { state, getters, mutations, actions }),
    // Setup the auth plugin.
    auth({ userService: 'users' }),
  ],
});
