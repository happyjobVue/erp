<script setup>
import axios from 'axios';
import { useRoute } from 'vue-router';
import { useUserInfo } from '../../../../stores/userInfo';
import { useModalStore } from '../../../../stores/modalState';
import { onMounted } from 'vue';
import SalesRegisterModal from './SalesRegisterModal.vue';
import SalesDetailModal from './SalesDetailModal.vue';
const salesPlanListData = ref();
const salesPlanListCnt = ref();
const userId = useUserInfo();
const modalState = useModalStore();
const planNum =ref(0);
const cPage = ref(1);
const route = useRoute();
const salesPlanDefaultList = () => {
    const param = {
        empId: userId.user.empId,
        pageSize: 5,
        currentPage: cPage.value,
    };
    axios.post('/api/business/sales-plan/getAllSalesPlan', param).then(res => {
        salesPlanListData.value = res.data.searchPlanList;
        salesPlanListCnt.value = res.data.salesPlanCnt;
    });
};

const searchList = () => {
    const param = new URLSearchParams({
        ...route.query,
        empId: userId.user.empId,
        pageSize: 5,
        currentPage: cPage.value,
    });
    axios
        .post('/api/business/sales-plan/getSearchSalesPlan', param)
        .then(res => {
            salesPlanListData.value = res.data.searchPlanList;
            salesPlanListCnt.value = res.data.salesPlanCnt;
        });
};

onMounted(() => {
    salesPlanDefaultList();
});

const onPostSuccess = () => {
    modalState.setModalState();
    salesPlanDefaultList();
};

const handlerModal = id =>{

    planNum.value =id; 
    modalState.setModalType('view');
    modalState.setModalState();
    console.log('모달 상태:', modalState.modalState.value);  // 상태 확인
    console.log('모달 타입:', modalState.modalType.value);  // 타입 확인
};



//첫번째 인자 데이터 , 두번째 인자 함수
watch(() => route.query, searchList);
</script>

<template>
    <div class="divSalesPlanList">
        <SalesDetailModal 
        v-if="modalState.modalState && modalState.modalType==='view'"
        :id="planNum"
        @modalClose="planNum = $event"
        @postSuccess=" onPostSuccess"/>
        <SalesRegisterModal 
        v-if="modalState.modalState && modalState.modalType==='register'"
        />
        
        <table>
            <thead>
                <th scope="col">목표날짜</th>
                <th scope="col">거래처 이름</th>
                <th scope="col">제조업체</th>
                <th scope="col">제품코드</th>
                <th scope="col">제품명</th>
                <th scope="col">목표수량</th>
                <th scope="col">비고란</th>
            </thead>
            <tbody>
                <template v-if="salesPlanListData">
                    <template v-if="salesPlanListCnt > 0">
                        <tr
                            v-for="plan in salesPlanListData"
                            :key="plan.plan_num"
                            @click ="handlerModal(plan.plan_num)"
                        >
                            <td>{{ plan.target_date }}</td>
                            <td>{{ plan.client_name }}</td>
                            <td>{{ plan.name }}</td>
                            <td>{{ plan.detail_code }}</td>
                            <td>{{ plan.product_name }}</td>
                            <td>{{ plan.goal_quanti }}</td>
                            <td>{{ plan.plan_memo }}</td>
                        </tr>
                    </template>
                </template>
                <template>
                    <tr>
                        <td colspan="7">일치하는 검색 결과가 없습니다</td>
                    </tr>
                </template>
            </tbody>
        </table>
        <Pagination
            :totalItems="salesPlanListCnt"
            :items-per-page="5"
            :max-pages-shown="5"
            :onClick="salesPlanDefaultList"
            v-model="cPage"
        />
    </div>
</template>
<style lang="scss" scoped>
table {
    width: 100%;
    border-collapse: collapse;
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
}
</style>
