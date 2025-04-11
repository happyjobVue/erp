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
                        <td class="label">사번</td>
                        <td>
                            <input
                                type="text"
                                v-model="expenseDetail.emp_no"
                                readonly
                            />
                        </td>
                        <td class="label">사용일자</td>
                        <td>
                            <input
                                type="date"
                                v-model="expenseDetail.use_date"
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
                            <template v-if="isEditMode">
                                <input
                                    type="text"
                                    v-model="expenseDetail.group_name"
                                    readonly
                                />
                            </template>
                            <template v-else>
                                <select v-model="expenseDetail.group_name">
                                    <option value="온라인매출">
                                        온라인매출
                                    </option>
                                    <option value="영업매출">영업매출</option>
                                    <option value="온라인지출">
                                        온라인지출
                                    </option>
                                    <option value="영업지출">영업지출</option>
                                    <option value="유동자산">유동자산</option>
                                </select>
                            </template>
                        </td>
                        <td class="label">거래처명</td>
                        <td>
                            <template v-if="isEditMode">
                                <input
                                    type="text"
                                    v-model="expenseDetail.client_name"
                                    readonly
                                />
                            </template>
                            <template v-else>
                                <select v-model="expenseDetail.client_name">
                                    <option
                                        v-for="client in clientList"
                                        :key="client.id"
                                        :value="client.clientName"
                                    >
                                        {{ client.clientName }}
                                    </option>
                                </select>
                            </template>
                        </td>
                    </tr>
                    <tr>
                        <td class="label">차변계정과목</td>
                        <td>
                            <template v-if="isEditMode">
                                <input
                                    type="text"
                                    v-model="expenseDetail.detail_name"
                                    readonly
                                />
                            </template>
                            <template v-else>
                                <select v-model="expenseDetail.detail_name">
                                    <option
                                        v-for="item in expenseDetailName"
                                        :key="item.detail_name"
                                        :value="item.detail_name"
                                    >
                                        {{ item.detail_name }}
                                    </option>
                                </select>
                            </template>
                        </td>
                        <td class="label">대변계정과목</td>
                        <td>
                            <template v-if="isEditMode">
                                <input
                                    type="text"
                                    v-model="expenseDetail.credit_name"
                                    readonly
                                />
                            </template>
                            <template v-else>
                                <select v-model="expenseDetail.crebit_code">
                                    <option
                                        v-for="item in expenseDetailName"
                                        :key="item.crebit_code"
                                        :value="item.crebit_code"
                                    >
                                        {{ item.crebit_code }}
                                    </option>
                                </select>
                            </template>
                        </td>
                    </tr>
                    <tr>
                        <td class="label">승인여부</td>
                        <td>
                            <div v-if="showRadio" class="radio-group">
                                <label style="margin-right: 10px">
                                    <input
                                        type="radio"
                                        value="S"
                                        v-model="expenseDetail.is_approval"
                                    />
                                    승인
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value="N"
                                        v-model="expenseDetail.is_approval"
                                    />
                                    반려
                                </label>
                            </div>
                            <div v-else>
                                <input
                                    type="text"
                                    :value="
                                        approvalMap[expenseDetail.is_approval]
                                    "
                                    readonly
                                />
                            </div>
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
                        <td class="button-box">
                            <button @click="downloadFileImage">다운로드</button>
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
                    <button
                        v-if="showSubmitButton"
                        @click="expenseReviewUpdate()"
                    >
                        승인완료
                    </button>
                    <button
                        v-if="originalApproval !== 'F'"
                        @click="goToPrintPage"
                    >
                        지출결의서 출력
                    </button>
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
const emit = defineEmits(['modalClose', 'postSuccess']);
const { setModalState } = useModalStore();
const expenseDetail = ref({});
const clientList = ref([]);
const expenseDetailName = ref([]);
const { id } = defineProps(['id']);
const originalApproval = ref('');
const showRadio = ref(false);
const showSubmitButton = ref(false);
const isEditMode = computed(() => !!id);

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
        originalApproval.value = response.data.expenseDetail.is_approval;
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

const expenseReviewUpdate = async () => {
    if (!['S'].includes(expenseDetail.value.is_approval)) {
        alert('승인여부를 선택해주세요. (승인대기 또는 반려)');
        return;
    }
    if (
        !expenseDetail.value.crebit_code ||
        expenseDetail.value.crebit_code.trim() === ''
    ) {
        alert('대변과목을 입력해주세요.');
        return;
    }
    const param = new URLSearchParams();
    param.append('checkApproval', expenseDetail.value.is_approval);
    param.append('detail_code', expenseDetail.value.crebit_code);
    param.append('exp_id', expenseDetail.value.id);

    try {
        const res = await axios.post(
            '/api/account/expenseLastUpdate.do',
            param
        );
        console.log('서버 응답:', res.data);
        if (res.data.result === 'success') {
            emit('postSuccess');
        } else {
            alert('저장 실패');
        }
    } catch (e) {
        console.error('저장 중 오류:', e);
        alert('저장 중 오류가 발생했습니다.');
    }
};

const goToPrintPage = () => {
    const id = expenseDetail.value.id;
    localStorage.setItem(
        'printExpenseData',
        JSON.stringify(expenseDetail.value)
    );
    const url = `/expense-review/print/${id}`;
    window.open(url, '_blank');
};

onMounted(() => {
    if (id) {
        searchDetail().then(() => {
            if (expenseDetail.value.is_approval === 'F') {
                showRadio.value = true;
                showSubmitButton.value = true;
            }
        });
    }
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
    display: table-cell !important;
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
    text-align: center;
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
