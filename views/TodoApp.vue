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
            @update-todo="updateTodo"
            @delete-todo="deleteTodo"
        />
        </div>

        <todo-creator 
            class="todo-app__creator"
            @create-todo="createTodo">
        </todo-creator>
    </div>
</template>

<script>
// 로컬 스토리지
import _findIndex from 'lodash/findIndex';
import _forEachRight from 'lodash/forEachRight';

// scroll
import scrollTo from 'scroll-to';

import TodoCreator from '~/components/TodoCreator';
import TodoItem from '~/components/TodoItem'

export default {
    components: {
        'todo-creator': TodoCreator,
        'todo-item': TodoItem
    },
    computed: {
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
        }
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
        deleteTodo (todo) {
            this.db
                .get('todos')
                .remove({ id: todo.id })
                .write();

            const foundIndex = _findIndex(this.todos, { id: todo.id });
            this.$delete(this.todos, foundIndex);
        },
        completeAll (checked) {
            // DB 갱신
            const newTodos = this.db
                .get('todos')
                .forEach(todo => {
                    todo.done = checked;
                })
                .write();

            // Local todos 갱신
            // this.todos.forEach(todo => {
            //     todo.done = checked
            // });
            this.todos = _cloneDeep(newTodos);
        },
        clearCompleted () {
            // 배열 요소를 앞에서부터 삭제할 경우 에러 발생 가능 (인덱스가 밀림)
            // this.todos.forEach(todo => {
            //     if (todo.done) {
            //         this.deleteTodo(todo);
            //     }
            // });

            // vanilla js
            // this.todos
            //     .reduce((list, todo, index) => {
            //         if (todo.done) {
            //             list.push(index);
            //         }

            //         return list;
            //     }, [])
            //     .reverse()
            //     .forEach(index => {
            //         this.deleteTodo(this.todos[index]);
            //     });

            // lodash
            _forEachRight(this.todos, todo => {
                if (todo.done) {
                    this.deleteTodo(todo);
                }
            });
        },
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