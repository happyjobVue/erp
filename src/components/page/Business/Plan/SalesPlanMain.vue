<script setup>
import axios from 'axios';
import { useUserInfo } from '../../../../stores/userInfo';
import { onMounted, watch, watchEffect } from 'vue';
// props로 전달받은 데이터
const props = defineProps({
    productId: {
        type: [String, Number],
        required: true,
    },
    industryCode: {
        type: String,
        required: true,
    },
    searchDate: {
        type: String,
        required: true,
    },
});
const salesPlanListData = ref();
const salesPlanListCnt = ref();
const userId = useUserInfo();
const cPage = ref(1);
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
    const param = {
        empId: userId.user.empId,
        pageSize: 5,
        currentPage: cPage.value,
        productId: props.productId,
        industryCode: props.industryCode,
        searchDate: props.searchDate,
    };
    axios.post('/api/business/sales-plan/getAllSalesPlan', param).then(res => {
        salesPlanListData.value = res.data.searchPlanList;
        salesPlanListCnt.value = res.data.salesPlanCnt;
    });
};

onMounted(() => {
    salesPlanDefaultList();
});

// productId, industryCode, searchDate가 변경될 때마다 searchList 실행
watch(
    [() => props.productId, () => props.industryCode, () => props.searchDate],
    () => {
        console.log('함수 실행 메인' + props.productId);
        searchList(); // 값이 변경되면 다시 검색 실행
    }
);
</script>

<template>
    <div class="divSalesPlanList">
        <!-- 현재 페이지 : {{ salesPlanListCnt }} -->
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
}
</style>
