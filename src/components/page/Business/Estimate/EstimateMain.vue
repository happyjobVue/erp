<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useModalStore } from '../../../../stores/modalState';
import EstimateDetailModal from './EstimateDetailModal.vue';
import EstimateRegisModal from './EstimateRegisModal.vue';

const estimateList = ref();
const estimateCnt = ref();
const cPage = ref(1);
const modalType = ref('');
const modalState = useModalStore();
const selectedEstimateId = ref(null);
const selectedClientId = ref(null);
onMounted(() => {
    getAllEstimate();
});

//거래거 목록 조회
const getAllEstimate = () => {
    const param = {
        currentPage: cPage.value,
        pageSize: 5,
    };
    axios
        .post('/api/business/estimate-list/estimateListBody.do', param)
        .then(res => {
            estimateList.value = res.data.estimateList;
            estimateCnt.value = res.data.estimateCnt;
        });
};

// 모달이 성공적으로 닫힌 후 실행될 함수
const onPostSuccess = () => {
    modalState.setModalState(); // 모달 열기
    modalType.value = ''; // 모달 타입 초기화
    getAllEstimate(); // 목록 새로고침
};

//등록 모달 열기
const registerEstiModal = () => {
    console.log('등록 모달 로직');
    modalType.value = 'register';
    modalState.setModalState(true);
};

//상세 보기 모달
const detailEst = (clientId, id) => {
    console.log('상세 모달 로직');
    modalType.value = 'view';
    modalState.setModalState(true);

    // 전달받은 clientId와 estimateId를 모달에 넘겨주기
    selectedEstimateId.value = id;
    selectedClientId.value = clientId;
};

const onModalClose = () => {
    console.log('모달 close');
};
</script>

<template>
    <div>
        <!-- 상세 보기 모달 -->
        <EstimateDetailModal
            v-if="modalState.modalState && modalType === 'view'"
            :estimateId="selectedEstimateId"
            :clientId="selectedClientId"
            @modalClose="onModalClose"
            @postSuccess="onPostSuccess"
        />

        <!-- 등록 모달  -->
        <EstimateRegisModal
            v-if="modalState.modalState && modalType === 'register'"
            @postSucess="onPostSuccess"
        />
        <!-- 신규 등록 버튼 -->
        <button @click="registerEstiModal()">거래처 등록</button>
        <table>
            <thead>
                <tr>
                    <th scope="col">담당자</th>
                    <th scope="col">날짜</th>
                    <th scope="col">거래처</th>
                    <th scope="col">제품</th>
                    <th scope="col">납기일자</th>
                    <th scope="col">납품수량</th>
                    <th scope="col">공급가액</th>
                    <th scope="col">세액</th>
                    <th scope="col">영역구분</th>
                    <th scope="col">상세조회</th>
                </tr>
            </thead>
            <tbody>
                <template v-if="estimateList">
                    <template v-if="estimateCnt > 0">
                        <tr v-for="est in estimateList" :key="est.id">
                            <td>{{ est.estimateEmpName }}</td>
                            <td>{{ est.estimateDate }}</td>
                            <td>{{ est.clientName }}</td>
                            <td>{{ est.productName }}</td>
                            <td>{{ est.deliveryDate }}</td>
                            <td>{{ est.totalDeliveryCount }}</td>
                            <td>{{ est.totalSupplyPrice }}</td>
                            <td>{{ est.totalTax }}</td>
                            <td>{{ est.salesArea }}</td>
                            <td>
                                <button
                                    @click="detailEst(est.clientId, est.id)"
                                >
                                    상세조회
                                </button>
                            </td>
                        </tr>
                    </template>
                    <template v-else>
                        <tr>
                            <td colspan="7">일치하는 검색 결과가 없습니다</td>
                        </tr>
                    </template>
                </template>
            </tbody>
        </table>
        <!-- 페이징 -->
        <Pagination
            :totalItems="estimateCnt"
            :items-per-page="5"
            :max-pages-shown="5"
            :onClick="getAllEstimate"
            v-model="cPage"
        />
    </div>
</template>
<style lang="scss" scoped>
table {
    width: 100%;

    margin: 20px 0px 0px 0px;
    font-size: 18px;
    text-align: left;

    th,
    td {
        padding: 8px;
        text-align: left;
        border-bottom: 1px solid #ddd;
        text-align: center;
    }

    th {
        background-color: #2676bf;
        color: #ddd;
    }

    /* 테이블 올렸을 때 */
    tbody tr:hover {
        background-color: #d3d3d3;
        opacity: 0.9;
        cursor: pointer;
    }
}

button {
    text-align: center;
    text-decoration: none;
    display: inline-block;
    border: none;
    color: white;
    width: 70px;
    padding-top: 8px;
    padding-bottom: 8px;
    font-size: 12px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 12px;
    box-shadow: 0 4px #999;
    background-color: #3bb2ea;

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
