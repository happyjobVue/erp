<template>
    <teleport to="body">
        <div class="backdrop">
            <div class="container">
                <label>
                    공통코드 :<input
                        type="text"
                        v-model="groupDetail.groupCode"
                    />
                </label>
                <label>
                    공통코드명 :<input
                        type="text"
                        v-model="groupDetail.groupName"
                    />
                </label>
                <label>
                    사용여부 :
                    <select v-model="groupDetail.useYn">
                        <option value="Y">사용</option>
                        <option value="N">미사용</option>
                    </select>
                </label>
                <label>
                    비고 :<input type="text" v-model="groupDetail.note" />
                </label>
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
    param.append('use_yn', groupDetail.value.use_yn);
    try {
        const res = await axios.post('/api/system/groupSave.do', param);
        console.log(res);
        if (res.data.result === 'success') {
            emit('postSuccess');
        } else {
            alert(res.data.message);
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
            alert('업데이트 실패');
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
    /* or vh 단위 사용 */
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
    display: flex;
    justify-content: space-between;
    text-align: right;
    margin-top: 10px;
}

button {
    flex: 1;
    margin: 0 5px;
    background-color: #3bb2ea;
    border: none;
    color: white;
    padding: 10px 22px;
    text-align: center;
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
