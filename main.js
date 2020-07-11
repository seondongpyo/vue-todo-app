import Vue from 'vue';
import App from './App.vue';

// 최상위 컴포넌트
new Vue({
    el: '#app',
    render: h => h(App)
    
    // 위와 동일함
    // render (createElement) {
    //     return createElement (App)
    // },
});