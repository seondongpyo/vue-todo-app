<template>
    <div>
        <todo-item></todo-item>
        <todo-creator></todo-creator>
    </div>
</template>

<script>
// 로컬 스토리지
import lowdb from 'lowdb';
import LocalStorage from 'lowdb/adapters/LocalStorage';

import TodoCreator from './TodoCreator';
import TodoItem from './TodoItem'

export default {
    components: {
        'todo-creator': TodoCreator,
        'todo-item': TodoItem
    },
    data () {
        return {
            db: null
        }
    },
    created () {
        this.initDB();
    },
    methods: {
        initDB () {
            const adapter = new LocalStorage('todo-app');   // 'todo-app'이라는 이름으로 어댑터를 생성
            this.db = lowdb(adapter);

            // Local DB 초기화
            this.db
                .defaults({
                    todos: []   // Collection
                })
                .write();
        }
    }
}
</script>

<style scoped>

</style>