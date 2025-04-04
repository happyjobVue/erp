<template>
    <teleport to="body">
        <div class="backdrop">
            <div class="modal-container">
                <table class="modal-table">
                    <tr>
                        <td class="label">결의번호</td>
                        <td>
                            <input
                                type="text"
                                v-model="expenseDetail.id"
                                readonly
                            />
                        </td>
                        <td class="label">신청일자</td>
                        <td>
                            <input
                                type="date"
                                v-model="expenseDetail.req_date"
                                readonly
                            />
                        </td>
                    </tr>
                    <tr>
                        <td class="label">사용일자</td>
                        <td>
                            <input
                                type="date"
                                v-model="expenseDetail.use_date"
                                readonly
                            />
                        </td>
                        <td class="label">사번</td>
                        <td>
                            <input
                                type="text"
                                v-model="expenseDetail.emp_no"
                                readonly
                            />
                        </td>
                    </tr>
                    <tr>
                        <td class="label">사원명</td>
                        <td>
                            <input
                                type="text"
                                v-model="expenseDetail.name"
                                readonly
                            />
                        </td>
                        <td class="label">사용부서</td>
                        <td>
                            <input
                                type="text"
                                v-model="expenseDetail.use_department"
                                readonly
                            />
                        </td>
                    </tr>
                    <tr>
                        <td class="label">계정대분류명</td>
                        <td>
                            <select v-model="expenseDetail.group_name" disabled>
                                <option value="온라인매출">온라인매출</option>
                                <option value="영업매출">영업매출</option>
                                <option value="온라인지출">온라인지출</option>
                                <option value="영업지출">영업지출</option>
                                <option value="유동자산">유동자산</option>
                            </select>
                        </td>
                        <td class="label">계정과목</td>
                        <td>
                            <select
                                v-model="expenseDetail.detail_name"
                                disabled
                            >
                                <option
                                    v-for="item in expenseDetailName"
                                    :key="item.detail_name"
                                    :value="item.detail_name"
                                >
                                    {{ item.detail_name }}
                                </option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td class="label">거래처명</td>
                        <td>
                            <select
                                v-model="expenseDetail.client_name"
                                disabled
                            >
                                <option
                                    v-for="client in clientList"
                                    :key="client.id"
                                    :value="client.clientName"
                                >
                                    {{ client.clientName }}
                                </option>
                            </select>
                        </td>
                        <td class="label">결의금액</td>
                        <td>
                            <input
                                type="text"
                                v-model="expenseDetail.expense_payment"
                                readonly
                            />
                        </td>
                    </tr>
                    <tr>
                        <td class="label">승인여부</td>
                        <td>
                            <span>{{
                                approvalMap[expenseDetail.is_approval]
                            }}</span>
                        </td>
                        <td class="label">승인일자</td>
                        <td>
                            <input
                                type="date"
                                v-model="expenseDetail.approval_date"
                                readonly
                            />
                        </td>
                    </tr>
                    <tr>
                        <td class="label">첨부파일</td>
                        <td colspan="3">
                            <button @click="downloadFileImage">
                                <img v-if="imgUrl" :src="imgUrl" />다운로드
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td class="label">비고</td>
                        <td colspan="3">
                            <textarea
                                v-model="expenseDetail.memo"
                                readonly
                            ></textarea>
                        </td>
                    </tr>
                </table>
                <div class="button-box">
                    <button @click="setModalState">나가기</button>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useModalStore } from '../../../../stores/modalState';
import axios from 'axios';

const { setModalState } = useModalStore();
const expenseDetail = ref({});
const clientList = ref([]);
const expenseDetailName = ref([]);
const { id } = defineProps(['id']);

const approvalMap = computed(() => ({
    W: '검토 대기',
    F: '승인 대기',
    S: '승인',
    N: '반려',
    C: '취소',
}));

const searchDetail = async () => {
    try {
        const response = await axios.post('/api/account/expenseDetail.do', {
            id,
        });
        expenseDetail.value = response.data.expenseDetail;
        clientList.value = response.data.clientList;
        expenseDetailName.value = response.data.expenseDetailName;
    } catch (e) {
        console.error(e);
    }
};

const downloadFileImage = async () => {
    const expenseSeq = expenseDetail.value.id;
    const param = new URLSearchParams();
    param.append('id', id);
    param.append('expenseSeq', expenseSeq);

    try {
        const res = await axios.post('/api/account/expenseDownload.do', param, {
            responseType: 'blob',
        });
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', expenseDetail.value.file_name);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (e) {
        console.error(e);
    }
};

onMounted(() => {
    if (id) searchDetail();
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
.label {
    background: #f0f0f0;
    font-weight: bold;
    text-align: left;
    width: 150px;
}
input,
select,
span,
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
