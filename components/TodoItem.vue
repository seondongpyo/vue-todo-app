<template>
    <div class="todo-item">

        <div
            v-if="isEditMode" 
            class="item__inner item--edit">

            <input 
                ref="titleInput"
                :value="editedTitle"
                type="text"
                @input="editedTitle = $event.target.value"
                @keypress.enter="editedTodo"
                @keypress.esc="offEditMode"
            >

            <div class="item__actions">
                <button 
                    key="complete"
                    @click="editedTodo">완료</button>
                <button 
                    key="cancel"
                    @click="offEditMode">취소</button>
            </div>
        </div>

        <div 
            v-else
            class="item__inner item--normal">
            
            <input 
                v-model="done"
                type="checkbox"
            >

            <div class="item__title-wrap">
                <div class="item__title">
                    {{ todo.title }}
                </div>
                <div class="item__date">
                    {{ date }}
                </div>
            </div>

            <div class="item__actions">
                <button 
                    key="update"
                    @click="onEditMode">수정</button>
                <button 
                    key="delete"
                    @click="deleteTodo">삭제</button>
            </div>
        </div>

    </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
    props: {
        todo: Object
    },
    data () {
        return {
            isEditMode: false,
            editedTitle: '' // 수정용 임시 데이터
        }
    },
    computed: {
        done: {
            get () {
                return this.todo.done;
            },
            set (done) {
                this.updateTodo({
                    done: done
                });
            }
        },
        date () {
            const date = dayjs(this.todo.createdAt);
            const isSame = date.isSame(this.todo.updateAt);

            if (isSame) {
                return date.format('YYYY년 MM월 DD일');

            } else {
                return `${date.format('YYYY년 MM월 DD일')} (edited)`;
            }
        }
    },
    methods: {
        editedTodo () {
            // 실제로 수정이 일어난 경우 = 기존 타이틀과 수정 시 입력한 타이틀이 다른 경우
            if (this.todo.title !== this.editedTitle) {
                this.updateTodo({
                    title: this.editedTitle,
                    updatedAt: new Date()
                });
            }

            this.offEditMode();
        },
        onEditMode () {
            // 수정 모드
            this.isEditMode = true;
            this.editedTitle = this.todo.title;

            // 화면 렌더링 이후 input 태그에 포커스 부여
            this.$nextTick(() => {
                this.$refs.titleInput.focus();
            });
        },
        offEditMode () {
            this.isEditMode = false;
        },
        updateTodo (value) {
            this.$emit('update-todo', this.todo, value);
        },
        deleteTodo () {
            this.$emit('delete-todo', this.todo);
        }
    }
}
</script>