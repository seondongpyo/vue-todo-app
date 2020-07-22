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
import lowdb from 'lowdb';
import LocalStorage from 'lowdb/adapters/LocalStorage';
import _cloneDeep from 'lodash/cloneDeep';
import _find from 'lodash/find';
import _assign from 'lodash/assign';
import _findIndex from 'lodash/findIndex';
import _forEachRight from 'lodash/forEachRight';

// scroll
import scrollTo from 'scroll-to';

// id용 임의의 문자열 생성
import cryptoRandomString from 'crypto-random-string';

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
        total () {
            return this.todos.length;
        },
        activeCount () {
            return this.todos.filter(todo => !todo.done).length;
        },
        completedCount () {
            return this.total - this.activeCount;
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
    },
    methods: {
        createTodo (title) {
            const newTodo = {
                id: cryptoRandomString({ length: 10 }),
                title: title,
                createdAt: new Date(),
                updatedAt: new Date(),
                done: false
            };

            // DB insert
            this.db
                .get('todos')   // lodash
                .push(newTodo)  // lodash
                .write();   // lowdb

            // Create Client
            this.todos.push(newTodo);
        },
        updateTodo (todo, value) {
            this.db
                .get('todos')
                .find({ id: todo.id })
                .assign(value)
                .write();

            const foundTodo = _find(this.todos, { id: todo.id });
            _assign(foundTodo, value);

        },
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