import Vue from 'vue'
import lowdb from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import _cloneDeep from 'lodash/cloneDeep'
import _find from 'lodash/find'
import _assign from 'lodash/assign'
import _findIndex from 'lodash/findIndex'
import _forEachRight from 'lodash/forEachRight'
import cryptoRandomString from 'crypto-random-string'

export default {
  namespaced: true, // 모듈이 독립적이거나 재사용이 가능하도록 할 때 명시
  // Data
  state: () => ({
    db: null,
    todos: [],
    filter: 'all'
  }),
  // Computed
  getters: {
    filteredTodos (state) {
      switch (state.filter) {
        case 'all':
        default:
          return state.todos

        case 'active': // 해야 할 항목
          return state.todos.filter(todo => !todo.done)

        case 'completed': // 완료된 항목
          return state.todos.filter(todo => todo.done)
      }
    },
    total (state) {
      return state.todos.length
    },
    activeCount (state) {
      return state.todos.filter(todo => !todo.done).length
    },
    completedCount (state, getters) {
      return getters.total - getters.activeCount
    }
  },
  // Methods
  // 실제 값을 변경할 수 있지만 비동기 처리 불가능
  mutations: {
    assignDB (state, db) { // mutation 안에서는 context 안에서 꺼내지 않아도 state로 접근 가능
      state.db = db
    },
    createDB (state, newTodo) {
      // DB insert
      state.db
        .get('todos') // lodash
        .push(newTodo) // lodash
        .write() // lowdb
    },
    updateDB (state, { todo, value }) {
      state.db
        .get('todos')
        .find({ id: todo.id })
        .assign(value)
        .write()
    },
    deleteDB (state, todo) {
      state.db
        .get('todos')
        .remove({ id: todo.id })
        .write()
    },
    assignTodos (state, todos) {
      state.todos = todos
    },
    pushTodo (state, newTodo) {
      state.todos.push(newTodo)
    },
    assignTodo (state, { foundTodo, value }) {
      _assign(foundTodo, value)
    },
    deleteTodo (state, foundIndex) {
      Vue.delete(state.todos, foundIndex) // this.$delete = Vue.delete()
    },
    updateTodo (state, { todo, key, value }) {
      todo[key] = value
    },
    updateFilter (state, filter) {
      state.filter = filter
    }
  },
  // Methods
  // 실제 값을 변경할 수 없지만 비동기 처리 가능 (일반적인 로직)
  actions: {
    initDB (context) {
      const { state } = context // 참조 관계의 객체들 중 state를 사용하겠다고 선언
      const { commit } = context
      const adapter = new LocalStorage('todo-app') // 'todo-app'이라는 이름으로 어댑터를 생성

      // state.db = lowdb(adapter); // 할당(실제 값을 변경)하는 로직은 actions에서 불가능 (mutation에서 처리)
      // commit을 통해서 mutations를 실행
      commit('assignDB', lowdb(adapter)) // 실행할 mutations의 이름에 매개변수를 전달

      const hasTodos = state.db.has('todos').value // lodash

      if (hasTodos) {
        // state.todos = _cloneDeep(state.db.getState().todos);    // 할당(실제 값을 변경)하는 로직은 actions에서 불가능 (mutation에서 처리)
        commit('assignTodos', _cloneDeep(state.db.getState().todos))
      } else {
        // Local DB 초기화
        state.db
          .defaults({ // lodash
            todos: [] // Collection
          })
          .write()
      }
    },
    createTodo ({ state, commit }, title) {
      const newTodo = {
        id: cryptoRandomString({ length: 10 }),
        title: title,
        createdAt: new Date(),
        updatedAt: new Date(),
        done: false
      }

      // DB insert
      commit('createDB', newTodo)

      // Create Client
      commit('pushTodo', newTodo)
    },
    updateTodo ({ state, commit }, { todo, value }) {
      // const { todo, value } = payload;

      // Update DB
      commit('updateDB', { todo, value })

      const foundTodo = _find(state.todos, { id: todo.id })
      commit('assignTodo', { foundTodo, value })
    },
    deleteTodo ({ state, commit }, todo) {
      // Delete DB
      commit('deleteDB', todo)

      const foundIndex = _findIndex(state.todos, { id: todo.id })

      // Delete Client
      commit('deleteTodo', foundIndex)
    },
    completeAll ({ state, commit }, checked) {
      // commit은 반환값을 만들어낼 수 없음
      const newTodos = state.db
        .get('todos')
        .forEach(todo => {
          // todo.done = checked;
          commit('updateTodo', {
            todo: todo,
            key: 'done',
            value: checked
          })
        })
        .write()

      // state.todos = _cloneDeep(newTodos)
      commit('assignTodos', _cloneDeep(newTodos))
    },
    clearCompleted ({ state, dispatch }) {
      _forEachRight(state.todos, todo => {
        if (todo.done) {
          // this.deleteTodo(todo);
          dispatch('deleteTodo', todo)
        }
      })
    }
  }
}
