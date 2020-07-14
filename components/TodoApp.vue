<template>
    <div>
        <todo-item></todo-item>
        <todo-creator></todo-creator>
    </div>
</template>

<script>
import TodoCreator from './TodoCreator';
import TodoItem from './TodoItem'

export default {
    components: {
        'todo-creator': TodoCreator,
        'todo-item': TodoItem
    }
}
</script>

<style scoped>

</style>