<template>
    <teleport to="body">
        <div class="backdrop">
            <div class="modal-container">
                <table class="modal-table">
                    <tr>
                        <td class="label">계정대분류명</td>
                        <td>
                            <select v-model="searchAccount.group_code">
                                <option value="">선택</option>
                                <option value="AC01">온라인매출</option>
                                <option value="AC02">영업매출</option>
                                <option value="AC03">온라인지출</option>
                                <option value="AC04">영업지출</option>
                                <option value="AC05">유동자산</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td class="label">계정세부명</td>
                        <td>
                            <input
                                type="text"
                                v-model="searchAccount.detail_name"
                                placeholder="계정세부명 입력"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td class="label">상세내용</td>
                        <td>
                            <input
                                type="text"
                                v-model="searchAccount.content"
                                placeholder="상세내용 입력"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td class="label">수입/지출 구분</td>
                        <td>
                            <select v-model="searchAccount.code_type">
                                <option value="">선택</option>
                                <option value="수입">수입</option>
                                <option value="지출">지출</option>
                            </select>
                        </td>
                    </tr>
                    <tr v-if="!id">
                        <td class="label">사용여부</td>
                        <td>
                            <select v-model="searchAccount.use_yn">
                                <option value="Y">사용</option>
                                <option value="N">미사용</option>
                            </select>
                        </td>
                    </tr>
                </table>
                <div class="button-box">
                    <button @click="id ? manageUpdate() : manageSave()">
                        {{ id ? '수정' : '등록' }}
                    </button>
                    <button v-if="id" @click="manageDelete">삭제</button>
                    <button @click="setModalState">나가기</button>
                </div>
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
    if (
        !searchAccount.value.group_code ||
        searchAccount.value.group_code.trim() === ''
    ) {
        alert('계정대분류명을 입력해주세요.');
        return;
    }
    if (
        !searchAccount.value.detail_name ||
        searchAccount.value.detail_name.trim() === ''
    ) {
        alert('계정세부명을 입력해주세요.');
        return;
    }
    if (
        !searchAccount.value.content ||
        searchAccount.value.content.trim() === ''
    ) {
        alert('상세내용을 입력해주세요.');
        return;
    }
    if (
        !searchAccount.value.code_type ||
        searchAccount.value.code_type.trim() === ''
    ) {
        alert('수입/지출을 입력해주세요.');
        return;
    }
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
        const res = await axios.post('/api/account/manageDelete.do', {
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

<style scoped>
.backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}
.modal-container {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
    width: 700px;
}
.modal-table {
    width: 100%;
    border-collapse: collapse;
}
.modal-table td {
    border: 1px solid #ccc;
    padding: 10px;
}
.modal-table td.button-box {
    border: none;
}
.radio-group {
    display: flex;
    gap: 20px;
    align-items: center;
}
.radio-group input[type='radio'] {
    display: inline-block;
    margin-right: 5px;
}
.label {
    background: #f0f0f0;
    font-weight: bold;
    text-align: left;
    width: 150px;
}
input:not([type='radio']),
select,
textarea {
    display: block;
    width: 100%;
    color: black;
    opacity: 1;
    box-sizing: border-box;
    padding: 8px;
    margin-top: 5px;
    margin-bottom: 5px;
    border-radius: 4px;
    border: 1px solid #ccc;
}
textarea {
    min-height: 80px;
    resize: vertical;
}
.button-box {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
}
button {
    flex: 1;
    background-color: #3bb2ea;
    border: none;
    color: white;
    padding: 10px;
    margin: 0 5px;
    font-size: 16px;
    cursor: pointer;
    border-radius: 6px;
    box-shadow: 0 2px #999;
    transition: 0.3s;
}
button:hover {
    background-color: #45a049;
}
button:active {
    background-color: #3e8e41;
    box-shadow: 0 2px #666;
    transform: translateY(2px);
}
</style>
