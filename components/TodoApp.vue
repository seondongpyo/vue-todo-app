<template>
    <div>
        <todo-item
            v-for="todo in todos"
            :key="todo.id"
            :todo="todo"
            @update-todo="updateTodo"
            @delete-todo="deleteTodo"
        />

        <hr>

        <todo-creator @create-todo="createTodo"></todo-creator>
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

// id용 임의의 문자열 생성
import cryptoRandomString from 'crypto-random-string';

import TodoCreator from './TodoCreator';
import TodoItem from './TodoItem'

export default {
    components: {
        'todo-creator': TodoCreator,
        'todo-item': TodoItem
    },
    data () {
        return {
            db: null,
            todos: []
        }
    },
    created () {
        this.initDB();
    },
    methods: {
        initDB () {
            const adapter = new LocalStorage('todo-app');   // 'todo-app'이라는 이름으로 어댑터를 생성
            this.db = lowdb(adapter);

            const hasTodos = this.db.has('todos').value //lodash

            if (hasTodos) {
                this.todos = _cloneDeep(this.db.getState().todos);

            } else {
                // Local DB 초기화
                this.db
                    .defaults({ // lodash
                        todos: []   // Collection
                    })
                    .write();
            }
        },
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
        }
    }
}
</script>

<style scoped>

</style>