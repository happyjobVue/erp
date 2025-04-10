<template>
    <teleport to="body">
        <div class="backdrop">
            <div class="modal-container">
                <table class="modal-table">
                    <tr>
                        <td class="label">공통코드</td>
                        <td>
                            <input
                                type="text"
                                v-model="groupDetail.groupCode"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td class="label">공통코드명</td>
                        <td>
                            <input
                                type="text"
                                v-model="groupDetail.groupName"
                            />
                        </td>
                    </tr>
                    <tr v-if="!id">
                        <td class="label">사용여부</td>
                        <td>
                            <select v-model="groupDetail.useYn">
                                <option value="Y">사용</option>
                                <option value="N">미사용</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td class="label">비고</td>
                        <td>
                            <input type="text" v-model="groupDetail.note" />
                        </td>
                    </tr>
                </table>
                <div class="button-box">
                    <button
                        @click="id ? groupDetailUpdate() : groupDetailSave()"
                    >
                        {{ id ? '수정' : '저장' }}
                    </button>
                    <button v-if="id" @click="groupDetailDelete">삭제</button>
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
const groupDetail = ref({
    groupCode: '',
    groupName: '',
    note: '',
    useYn: 'Y',
});

const searchDetail = async () => {
    try {
        const response = await axios.post('/api/system/groupDetailBody.do', {
            groupCode: id,
        });
        const detail = response.data.detail;
        detail.oldGroupCode = detail.groupCode;
        groupDetail.value = response.data.detail;
    } catch (e) {
        console.error(e);
    }
};

const groupDetailSave = async () => {
    if (
        !groupDetail.value.groupCode ||
        groupDetail.value.groupCode.trim() === ''
    ) {
        alert('공통코드를 입력해주세요.');
        return;
    }
    if (
        !groupDetail.value.groupName ||
        groupDetail.value.groupName.trim() === ''
    ) {
        alert('공통코드명을 입력해주세요.');
        return;
    }

    const param = new FormData();
    param.append('groupCode', groupDetail.value.groupCode);
    param.append('groupName', groupDetail.value.groupName);
    param.append('groupNote', groupDetail.value.note);
    param.append('use_yn', groupDetail.value.useYn);
    try {
        const res = await axios.post('/api/system/groupSave.do', param);
        console.log(res);
        if (res.data.result === 'success') {
            emit('postSuccess');
        } else {
            if (res.data.message === '미사용 코드입니다.') {
                alert(res.data.message);
                emit('postSuccess');
                emit('searchGroupCode', groupDetail.value.groupCode);
            } else {
                alert(res.data.message);
            }
        }
    } catch (e) {
        console.error(e);
    }
};

const groupDetailUpdate = async () => {
    const param = new FormData();
    param.append('oldGroupCode', groupDetail.value.oldGroupCode);
    param.append('newGroupCode', groupDetail.value.groupCode);
    param.append('groupName', groupDetail.value.groupName);
    param.append('groupNote', groupDetail.value.note);
    param.append('groupUseYn', groupDetail.value.useYn);
    try {
        const res = await axios.post('/api/system/groupUpdate.do', param);
        if (res.data.result === 'success') {
            emit('postSuccess');
        } else {
            if (res.data.message === '미사용 코드입니다.') {
                alert(res.data.message);
                emit('postSuccess');
                emit('searchGroupCode', groupDetail.value.groupCode);
            } else {
                alert(res.data.message);
            }
        }
    } catch (e) {
        console.error(e);
    }
};

const groupDetailDelete = async () => {
    try {
        const res = await axios.post('/api/system/detailDelete.do', {
            groupCode: id,
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
