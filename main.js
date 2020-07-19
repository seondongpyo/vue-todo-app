import Vue from 'vue';
import App from './App';
import router from './router/index';

// 최상위 컴포넌트
new Vue({
    el: '#app',
    router: router, // 라우터 추가
    render: h => h(App)
    
    // 위와 동일함
    // render (createElement) {
    //     return createElement (App)
    // },
});