import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    // strict: true    // 배포 시에는 성능 이슈 때문에 false로 변경해야 함
    strict: process.env.NODE_ENV !== 'production'   // 개발 또는 배포에 따라 값을 변경
});