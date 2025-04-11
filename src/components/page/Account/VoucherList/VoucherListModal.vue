<template>
    <teleport to="body">
        <div class="backdrop">
            <div class="modal-container">
                <table class="modal-table">
                    <tr>
                        <td class="label">전표번호</td>
                        <td>
                            <input
                                type="text"
                                v-model="voucherDetail.voucher_no"
                                readonly
                            />
                        </td>
                        <td class="label">구분</td>
                        <td>
                            <input
                                type="text"
                                v-model="voucherDetail.account_type"
                                readonly
                            />
                        </td>
                        <td class="label">담당자</td>
                        <td>
                            <input
                                type="text"
                                v-model="voucherDetail.emp_name"
                                readonly
                            />
                        </td>
                        <td class="label">일자</td>
                        <td>
                            <input
                                type="date"
                                v-model="voucherDetail.voucher_date"
                                readonly
                            />
                        </td>
                    </tr>
                    <tr>
                        <td class="label">거래처</td>
                        <td>
                            <input
                                type="date"
                                v-model="voucherDetail.client_name"
                                readonly
                            />
                        </td>
                        <td class="label">주문번호</td>
                        <td>
                            <input
                                type="text"
                                v-model="voucherDetail.order_id"
                                readonly
                            />
                        </td>
                        <td class="label">지출번호</td>
                        <td>
                            <input
                                type="text"
                                v-model="voucherDetail.exp_id"
                                readonly
                            />
                        </td>
                    </tr>
                </table>
                <table class="content-table">
                    <thead>
                        <tr>
                            <th>계정과목</th>
                            <th>차변</th>
                            <th>대변</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <input
                                    type="text"
                                    v-model="voucherDetail.debit_name"
                                    readonly
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    :value="
                                        numberWithCommas(
                                            voucherDetail.voucher_amount
                                        )
                                    "
                                    readonly
                                />
                            </td>
                            <td>
                                <input />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <input
                                    type="text"
                                    v-model="voucherDetail.crebit_name"
                                    readonly
                                />
                            </td>
                            <td>
                                <input />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    :value="
                                        numberWithCommas(
                                            voucherDetail.voucher_amount
                                        )
                                    "
                                    readonly
                                />
                            </td>
                        </tr>
                        <tr class="row-table">
                            <td>합계</td>
                            <td>
                                <input
                                    type="text"
                                    :value="
                                        numberWithCommas(
                                            voucherDetail.voucher_amount
                                        )
                                    "
                                    readonly
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    :value="
                                        numberWithCommas(
                                            voucherDetail.voucher_amount
                                        )
                                    "
                                    readonly
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="button-box">
                    <div class="print-page" id="pdf-content">
                        <button class="button" @click="downloadPdf">
                            PDF 저장
                        </button>
                    </div>
                    <button class="button" @click="printPage">인쇄</button>
                    <button @click="setModalState">나가기</button>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import { onMounted } from 'vue';
import { useModalStore } from '../../../../stores/modalState';
import html2pdf from 'html2pdf.js/dist/html2pdf.bundle.min';

const emit = defineEmits(['modalClose', 'postSuccess']);
const { setModalState } = useModalStore();
const { voucherDetail } = defineProps({
    voucherDetail: {
        type: Object,
        required: true,
    },
});

const setModalAndClose = () => {
    console.log('✅ 나가기 버튼 클릭됨 - setModalState 호출');
    setModalState();
};

// 숫자 천 단위 쉼표
const numberWithCommas = x => {
    if (typeof x !== 'number') return '';
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const printPage = () => {
    window.print();
};

const downloadPdf = () => {
    const element = document.getElementById('pdf-content');
    const opt = {
        margin: 0.5,
        filename: '지출결의서.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' },
    };
    html2pdf().set(opt).from(element).save();
};

// onMounted(() => {
//     searchDetail();
// });

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
    width: 90vw;
    max-width: 1000px;
    overflow-x: auto;
}

.modal-table,
.content-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 15px;
}

.content-table th,
tr.row-table {
    background: #f4f4f4;
    font-weight: bold; /* 굵게 */
    text-align: center; /* 가운데 정렬 */
    font-size: 14px; /* 글자 크기 */
}

.label {
    background: #f0f0f0;
    font-weight: bold;
    text-align: left;
}

input {
    display: block;
    width: 100%;
    box-sizing: border-box;
    padding: 8px;
    margin: 5px 0;
    border-radius: 4px;
    border: 1px solid #ccc;
    font-size: 14px;
    background-color: #fdfdfd;
}

.button-box {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
}

button {
    background-color: #3bb2ea;
    border: none;
    color: white;
    padding: 10px 20px;
    margin-left: 10px;
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
@media print {
    @page {
        size: landscape;
    }
}
</style>
