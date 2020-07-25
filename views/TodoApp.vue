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
                        >
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
        >
        </todo-creator>
    </div>
</template>

<script>
// scroll
import { mapState, mapGetters } from 'vuex';
import scrollTo from 'scroll-to';

import TodoCreator from '~/components/TodoCreator';
import TodoItem from '~/components/TodoItem'

export default {
    components: {
        'todo-creator': TodoCreator,
        'todo-item': TodoItem
    },
    computed: {
        ...mapState('todoApp', [    // mapState('namespace', ['가지고 올 state명'])
            'todos'
        ]),
        ...mapGetters('todoApp', [  // mapGetters('namespace', ['가지고 올 getters명'])
            'total',
            'activeCount',
            'completedCount'
        ]),
        filteredTodos () {
            switch (this.$route.params.id) {
                case 'all':
                default:
                    return this.todos;

                case 'active':  // 해야 할 항목
                    return this.todos.filter(todo => !todo.done);

                case 'completed':   // 완료된 항목
                    return this.todos.filter(todo => todo.done);
            }
        },
        allDone: {
            get () {
                return this.total === this.completedCount && this.total > 0;
            },
            set (checked) {
                this.completeAll(checked);
            }
        },
        // total () {
        //     return this.$store.getters.todoApp.total;
        // },
        // activeCount () {
        //     return this.$store.getters.todoApp.activeCount;
        // },
        // completedCount () {
        //     return this.$store.getters.todoApp.completedCount;
        // }
    },
    created () {
        this.initDB();
        // this.$store.dispatch('todoApp/updateTodo', {
        //     todo: todo,
        //     value: value
        // }); 
        // → store에 있는 actions들 중 하나를 호출할 건데 todoApp 모듈에 있는 updateTodo를 실행하겠다
        // 전달할 값은 2개 이상이 불가능하므로 객체에 담아서 전달
    },
    methods: {
        scrollToTop () {
            scrollTo(0, 0, {
                ease: 'linear',
                // duration: 1  // default
            });
        },
        scrollToBottom () {
            scrollTo(0, document.body.scrollHeight, {
                ease: 'linear'
            });
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