<template>
    <div>
        <button @click="createTodo">
            <i class="material-icons">add</i>
        </button>
        <input 
            :value="title"
            :placeholder="placeholder"
            type="text"
            @input="title = $event.target.value"
            @keypress.enter="createTodo"
        >
    </div>
</template>

<script>
export default {
    data () {
        return {
            title: '',
            placeholder: '할 일을 추가하세요!'
        }
    },
    methods: {
        createTodo () {
            const validatedTitle = this.title && this.title.trim();

            if (!validatedTitle) {
                alert('유효하지 않은 제목입니다!');
                this.title = this.title.trim();
                return;
            }

            // this.$emit('create-todo', this.title);   // 더 이상 부모로 이벤트를 보내지 않아도 된다
            this.$store.dispatch('todoApp/createTodo', this.title); // namespace인 todoApp 추가 입력 주의
            this.title = '';

            this.$nextTick(() => {
                window.scrollTo(0, document.body.scrollHeight);
            });
        }
    }
}
</script>