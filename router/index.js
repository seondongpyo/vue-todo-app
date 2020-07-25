import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '~/views/Home'
import About from '~/views/About'
import TodoApp from '~/views/TodoApp'

// vue-router 사용
Vue.use(VueRouter)

const routes = [
  // config
  {
    name: 'index',
    path: '/',
    component: Home
  },
  {
    name: 'about',
    path: '/about',
    component: About
  },
  {
    name: 'todos',
    path: '/todos',
    redirect: '/todos/all',
    component: TodoApp,
    children: [
      {
        name: 'todo-filter',
        path: ':id' // 전달 받을 파라미터를 설정
      }
    ]
  }
]

export default new VueRouter({
  routes: routes
})
