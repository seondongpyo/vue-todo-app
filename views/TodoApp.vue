<template>
    <div class="todo-app">
        <div class="todo-app__actions">
            <div class="filters">
                <router-link tag="button" to="all">  <!-- all = /todos/all -->
                    모든 항목 ({{ total }})
                </router-link>
                <router-link tag="button" to="active">
                    해야 할 항목 ({{ activeCount }})
                </router-link>
                <router-link tag="button" to="completed">
                    완료된 항목 ({{ completedCount }})
                </router-link>
            </div>

            <div class="actions clearfix">
                <div class="float--left">
                    <label>
                        <input
                           v-model="allDone"
                            type="checkbox"
                        />
                        <span class="icon">
                            <i class="material-icons">done_all</i>
                        </span>
                    </label>
                </div>
                <div class="float--right clearfix">
                    <button
                        class="btn float--left"
                        @click="scrollToTop"
                    >
                        <i class="material-icons">expand_less</i>
                    </button>
                    <button
                        class="btn float--left"
                        @click="scrollToBottom"
                    >
                        <i class="material-icons">expand_more</i>
                    </button>
                    <button
                        class="btn btn--danger float--left"
                        @click="clearCompleted"
                    >
                        <i class="material-icons">delete_sweep</i>
                    </button>
                </div>
            </div>
        </div>

        <div class="todo-app__list">
            <todo-item
                v-for="todo in filteredTodos"
                :key="todo.id"
                :todo="todo"
            />
        </div>

        <todo-creator
            class="todo-app__creator"
        />
    </div>
</template>

<script>
// scroll
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import scrollTo from 'scroll-to'

import TodoCreator from '~/components/TodoCreator'
import TodoItem from '~/components/TodoItem'

export default {
  components: {
    'todo-creator': TodoCreator,
    'todo-item': TodoItem
  },
  computed: {
    // Helpers
    ...mapState('todoApp', [ // mapState('namespace', ['가지고 올 state명'])
      'todos'
    ]),
    ...mapGetters('todoApp', [ // mapGetters('namespace', ['가지고 올 getters명'])
      'filteredTodos',
      'total',
      'activeCount',
      'completedCount'
    ]),
    allDone: {
      get () {
        return this.total === this.completedCount && this.total > 0
      },
      set (checked) {
        this.completeAll(checked)
      }
    }
  },
  watch: {
    $route () { // route가 변경된 경우 다음 함수를 실행
      // state.filter = this.$route.params.id;    // 직접적인 데이터 변경 불가능, mutations 도움 필요함
      // this.$store.commit('todoApp/updateFilter', this.$route.params.id);   // mapMutations로 대체 가능
      this.updateFilter(this.$route.params.id)
    }
  },
  created () {
    this.initDB()
  },
  methods: {
    // Helpers
    ...mapMutations('todoApp', [
      'updateFilter'
    ]),
    ...mapActions('todoApp', [
      'initDB',
      'completeAll',
      'clearCompleted'
    ]),
    scrollToTop () {
      scrollTo(0, 0, {
        ease: 'linear'
        // duration: 1  // default
      })
    },
    scrollToBottom () {
      scrollTo(0, document.body.scrollHeight, {
        ease: 'linear'
      })
    }
  }
}
</script>

<style lang="scss">
    @import "scss/style";

    .filters button.router-link-active {
        background: royalblue;
        color: white;
    }
</style>
