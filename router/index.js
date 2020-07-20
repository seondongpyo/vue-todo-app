import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '~/views/Home'
import About from '~/views/About'
import TodoApp from '~/views/TodoApp'

// vue-router 사용
Vue.use(VueRouter);

const routes = [
    // config
    {
        path: '/',
        component: Home
    },
    {
        path: '/about',
        component: About
    },
    {
        path: '/todos',
        component: TodoApp
    }
]

export default new VueRouter({
    routes: routes
});

