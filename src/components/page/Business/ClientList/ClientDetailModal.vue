<script setup>
import { defineProps, onMounted, onUnmounted, ref } from 'vue';
import { useModalStore } from '../../../../stores/modalState';
const modalState = useModalStore();
const emit = defineEmits(['modalClose', 'postSuccess']);
const props = defineProps({
    client: {
        type: Object,
        required: true,
    },
});

onMounted(() => {
    console.log('디테일 컴포넌트 마운트 됨 ');
    if (props.client) {
        console.log('props' + props.client.client_name);
    }
});
</script>

<template>
    <div>
        <teleport to="body">
            <div class="backdrop">
                <div class="container">
                    <h2>거래처 상세</h2>
                    <table>
                        <tbody>
                            <!-- 사원 -->
                            <tr>
                                <th class="table-header">거래처</th>
                                <td>
                                    <input
                                        type="text"
                                        v-model="props.client.client_name"
                                    />
                                </td>
                                <th class="table-header">회사 연락처</th>
                                <td>
                                    <input
                                        type="text"
                                        v-model="props.client.ph"
                                    />
                                </td>
                            </tr>

                            <!-- 제조사 -->
                            <tr>
                                <th class="table-header">담당자</th>
                                <td>
                                    <input
                                        type="text"
                                        v-model="props.client.person"
                                    />
                                </td>
                                <th class="table-header">담당자 연락처</th>
                                <td>
                                    <input
                                        type="text"
                                        v-model="props.client.person_ph"
                                    />
                                </td>
                            </tr>

                            <!-- 거래처 -->
                            <tr>
                                <th class="table-header">우편번호</th>
                                <td>
                                    <input
                                        type="text"
                                        v-model="props.client.zip"
                                    />
                                </td>
                                <th class="table-header">주소</th>
                                <td>
                                    <input
                                        type="text"
                                        v-model="props.client.addr"
                                    />
                                </td>
                            </tr>

                            <!-- 메모 -->
                            <tr>
                                <th class="table-header">상세주소</th>
                                <td>
                                    <input
                                        type="text"
                                        v-model="props.client.detail_addr"
                                    />
                                </td>
                                <th class="table-header">사업자 번호</th>
                                <td>
                                    <input
                                        type="text"
                                        v-model="props.client.biz_num"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th class="table-header">은행</th>
                                <td>
                                    <input
                                        type="text"
                                        v-model="props.client.bank"
                                    />
                                </td>
                                <th class="table-header">메모</th>
                                <td>
                                    <input
                                        type="text"
                                        v-model="props.client.memo"
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="button-box">
                        <button>수정</button>
                        <button
                            type="button"
                            @click="modalState.setModalState()"
                        >
                            취소
                        </button>
                    </div>
                </div>
            </div>
        </teleport>
    </div>
</template>
<style lang="scss" scoped>
.backdrop {
    top: 0%;
    left: 0%;
    width: 100%;
    height: 100%;
    position: fixed;
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
}

.container {
    background: white;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
    width: 1000px;
    font-size: 14px;
}

h2 {
    font-size: 24px;
    margin-bottom: 20px;
    font-weight: bold;
    text-align: center;
    background-color: #f0f0f0; /* 회색 배경 */
    padding: 10px 0; /* 여백 추가 */
    border-bottom: 2px solid #ccc; /* 제목 아래 선 추가 */
}

table {
    width: 100%;
    border-spacing: 0;
    margin-bottom: 20px;
}

th.table-header {
    background-color: #f0f0f0;
    padding: 12px 15px;
    font-weight: bold;
    border-right: 2px solid #ccc; /* 선 추가 */
    text-align: left;
    width: 150px;
}

td {
    padding: 12px 15px;
}

input[type='text'],
input[type='date'],
select {
    width: 90%;
    padding: 10px;
    margin-top: 5px;
    margin-bottom: 10px;
    border-radius: 4px;
    border: 1px solid #ccc;
}

button {
    background-color: #3bb2ea;
    border: none;
    color: white;
    padding: 10px 22px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 10px 0;
    cursor: pointer;
    border-radius: 12px;
    box-shadow: 0 4px #999;
    transition: 0.3s;
    width: 30px;
}

button:hover {
    background-color: #45a049;
}

button:active {
    background-color: #3e8e41;
    box-shadow: 0 2px #666;
    transform: translateY(2px);
}

.button-box {
    display: flex;
    text-align: center;
    justify-content: space-between;
    margin-top: 20px;
    width: 300px;
}

.button-box button {
    width: 48%;
}

input[type='text']:focus,
input[type='date']:focus,
select:focus {
    border-color: #3bb2ea;
    outline: none;
}
</style>
