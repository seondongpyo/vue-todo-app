export default {
    namespaced: true,
    // Data
    state: () => ({
        a: 123,
        b: []
    }),
    // Computed
    getters: {
        someGetter1 (state, getters) {
            return state.a + 1;
        },
        someGetter2 (state, getters) {
            return state.a + getters.someGetter1;
        }
    },
    // Methods (실제 값 변경 가능, 비동기 불가능)
    mutations: {
        someMutation (state, payload) { // payload : mutation이 실행될 때 전달받은 값
            state.a = 789;
            state.b.push(payload);
        }
    },
    // Methods (실제 값 변경 불가능, 비동기 가능)
    actions: {
        someAction1 ({ state, getters, commit, dispatch }, payload) {
            state.a = 789;   // error 발생, actions에서는 실제 값을 변경할 수 없음
            state.b.push(payload);  // error 발생, actions에서는 실제 값을 변경할 수 없음

            const { commit } = context;
            commit('someMutation', payload);
        },
        someAction2 (context, payload) {    // context : { state, getters, commit(mutations를 참조해서 실행), dispatch(actions를 참조해서 실행) }
            context.commit('someMutation');
            context.dispatch('someAction1', payload);   // actions 내부의 또 다른 action을 호출
        }
    }
}