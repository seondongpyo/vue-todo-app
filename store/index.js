import Vue from 'vue'
import Vuex from 'vuex'

import todoApp from './todoApp' // todoApp 모듈 가져오기

Vue.use(Vuex)

export default new Vuex.Store({
  // strict: true    // 배포 시에는 성능 이슈 때문에 false로 변경해야 함
  strict: process.env.NODE_ENV !== 'production', // 개발 또는 배포에 따라 값을 변경 (개발 - true, 배포 - false)
  modules: {
    todoApp: todoApp // todoApp 모듈 등록
  }
})
