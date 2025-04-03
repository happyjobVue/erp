<template>
    <teleport to="body">
        <div class="backdrop">
            <div class="container">
                <label>
                    계정대분류명 :
                    <select v-model="searchAccount.group_code">
                        <option value="">선택</option>
                        <option value="AC01">온라인매출</option>
                        <option value="AC02">영업매출</option>
                        <option value="AC03">온라인지출</option>
                        <option value="AC04">영업지출</option>
                        <option value="AC05">유동자산</option>
                    </select>
                </label>
                <label
                    >계정세부명 :
                    <input type="text" v-model="searchAccount.detail_name" />
                </label>
                <label
                    >상세내용 :
                    <input type="text" v-model="searchAccount.content" />
                </label>
                <label>
                    수입/지출 구분 :
                    <select v-model="searchAccount.code_type">
                        <option value="">선택</option>
                        <option value="수입">수입</option>
                        <option value="지출">지출</option>
                    </select>
                </label>
                <label v-if="id">
                    사용여부 :
                    <select v-model="searchAccount.use_yn">
                        <option value="">선택</option>
                        <option value="Y">Y</option>
                        <option value="N">N</option>
                    </select>
                </label>
                <button @click="id ? manageUpdate() : manageSave()">
                    {{ id ? '수정' : '등록' }}
                </button>
                <button v-if="id" @click="manageDelete">삭제</button>
                <button @click="setModalState">나가기</button>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useModalStore } from '../../../../stores/modalState';
import axios from 'axios';

const { setModalState } = useModalStore();
const { id } = defineProps(['id']);
const emit = defineEmits(['modalClose', 'postSuccess']);
const searchAccount = ref({
    group_code: '',
    detail_name: '',
    content: '',
    code_type: '',
    use_yn: 'Y',
});

const searchDetail = async () => {
    try {
        const response = await axios.post('/api/account/accountGroupList.do', {
            detail_code: id,
        });
        searchAccount.value = response.data.accountGroupList[0];
    } catch (e) {
        console.error(e);
    }
};

const manageSave = async () => {
    const param = new URLSearchParams(searchAccount.value);

    try {
        const res = await axios.post('/api/account/accountSave.do', param);
        if (res.data.result === 'success') {
            emit('postSuccess');
        } else {
            alert('저장 실패');
        }
    } catch (e) {
        console.error(e);
    }
};

const manageUpdate = async () => {
    const param = new URLSearchParams(searchAccount.value);

    try {
        const res = await axios.post('/api/account/accountUpdate.do', param);

        if (res.data.result === 'success') {
            emit('postSuccess');
        } else {
            alert('저장 실패');
        }
    } catch (e) {
        console.error(e);
    }
};

const manageDelete = async () => {
    try {
        const res = await axios.post('/api/account/accountDelete.do', {
            detail_code: id,
        });

        if (res.data.result === 'success') {
            emit('postSuccess');
        } else {
            alert('삭제 실패');
        }
    } catch (e) {
        console.error(e);
    }
};

onMounted(() => {
    id && searchDetail();
});

onUnmounted(() => {
    emit('modalClose', 0);
});
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

select,
input[type='text'] {
    padding: 8px;
    margin-top: 5px;
    margin-bottom: 5px;
    border-radius: 4px;
    border: 1px solid #ccc;
}

select:disabled,
input[readonly] {
    color: black;
    background-color: white;
    opacity: 1;
    cursor: not-allowed;
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
    margin-top: 5px;
    border-radius: 10px;
    width: 100%;
    max-height: 400px;
    height: auto;
    object-fit: cover;
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
