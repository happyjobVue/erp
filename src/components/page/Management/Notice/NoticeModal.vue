<template>
    <teleport to="body">
        <div class="backdrop">
            <div class="container">
                <label> 제목 :<input type="text" v-model="noticeDetail.title" /> </label>
                <label>
                    내용 :
                    <textarea v-model="noticeDetail.content" class="textContent"></textarea>
                </label>
                파일 :<input type="file" style="display: none" id="fileInput" />
                <label class="img-label" htmlFor="fileInput">
                    파일 첨부하기
                </label>
                <div>
                    <div>
                        <label>미리보기</label>
                        <img />
                    </div>
                </div>
                <div class="button-box">
                    <button @click="id ? noticeUpdate() : noticeSave()">{{ id ? '수정' : '저장' }}</button>
                    <button v-if="id" @click="noticeDelete">삭제</button>
                    <button @click="setModalState">나가기</button>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useModalStore } from '../../../../stores/modalState'
import axios from 'axios'
const { setModalState } = useModalStore();
const { id } = defineProps(['id'])
const emit = defineEmits(['modalClose', 'postSuccess'])
const noticeDetail = ref({})

const searchDetail = async () => {

    try {
        const response = await axios.post('/api/management/noticeDetailJson.do', { noticeId: id })
        noticeDetail.value = response.data.detailValue
    } catch (e) {
        console.error(e);
    }
}

const noticeSave = async () => {
    const param = new URLSearchParams(noticeDetail.value)
    try {
        const res = await axios.post('/api/management/noticeSave.do', param)
        if (res.data.result === 'success') {
            emit('postSuccess')
        } else {
            alert("저장 실패")
        }
    } catch (e) {
        console.error(e);
    }

}

const noticeUpdate = async () => {
    const param = new URLSearchParams(noticeDetail.value)
    param.append("noticeId", id)
    try {
        const res = await axios.post('/api/management/noticeUpdate.do', param)
        if (res.data.result === 'success') {
            emit('postSuccess')
        } else {
            alert("업데이트 실패")
        }
    } catch (e) {
        console.error(e);
    }
}

const noticeDelete = async () => {
    try {
        const res = await axios.post('/api/management/noticeDeleteJson.do', { noticeId: id })
        if (res.data.result === 'success') {
            emit('postSuccess')
        } else {
            alert("삭제 실패")
        }
    } catch (e) {
        console.error(e);
    }
}


onMounted(() => {
    id && searchDetail()
})

onUnmounted(() => {
    emit('modalClose', 0)
})

</script>

<style lang="scss" scoped>
.textContent {
    padding: 10px;
    margin-top: 5px;
    margin-bottom: 5px;
    border-radius: 4px;
    font-size: 13px;
    box-sizing: border-box;
    min-height: 150px;
    width: 100%;
    resize: vertical;
    overflow-wrap: anywhere;
    word-wrap: break-word;
    word-break: break-word;
    white-space: pre-wrap;
    overflow: auto;
    border: 1px solid #ccc;
    display: block;
}

.backdrop {
    top: 0%;
    left: 0%;
    width: 100%;
    height: 100%;
    position: fixed;
    display: flex;
    flex-flow: row wrep;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
    font-weight: bold;
}

label {
    display: flex;
    flex-direction: column;
}

input[type='text'] {
    padding: 8px;
    margin-top: 5px;
    margin-bottom: 5px;
    border-radius: 4px;
    border: 1px solid #ccc;
}

.container {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
    position: relative;
    width: 400px;
}

img {
    width: 100px;
    height: 100px;
}

.img-label {
    margin-top: 10px;
    padding: 6px 25px;
    background-color: #ccc;
    border-radius: 4px;
    color: rgba(0, 0, 0, 0.9);
    cursor: pointer;

    &:hover {
        background-color: #45a049;
        color: white;
    }

    &:active {
        background-color: #3e8e41;
        box-shadow: 0 2px #666;
        transform: translateY(2px);
    }
}

.button-box {
    text-align: right;
    margin-top: 10px;
}

button {
    background-color: #3bb2ea;
    border: none;
    color: white;
    padding: 10px 22px;
    text-align: right;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 12px;
    box-shadow: 0 4px #999;
    transition: 0.3s;

    &:hover {
        background-color: #45a049;
    }

    &:active {
        background-color: #3e8e41;
        box-shadow: 0 2px #666;
        transform: translateY(2px);
    }
}
</style>
