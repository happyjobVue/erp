<template>
    <div class="divNoticeList">
        <ManageModal
            v-if="modal.modalState"
            :id="id"
            @modalClose="id = $event"
            @postSuccess="onPostSuccess"
        />
        <table>
            <colgroup>
                <col width="10%" />
                <col width="15%" />
                <col width="10%" />
                <col width="15%" />
                <col width="10%" />
                <col width="30%" />
                <col width="10%" />
            </colgroup>

            <thead>
                <tr>
                    <th scope="col">결의번호</th>
                    <th scope="col">신청일자</th>
                    <th scope="col">사용일자</th>
                    <th scope="col">계정대분류명</th>
                    <th scope="col">계정과목</th>
                    <th scope="col">사용부서</th>
                    <th scope="col">결의금액</th>
                    <th scope="col">승인여부</th>
                </tr>
            </thead>
            <tbody>
                <template v-if="expenseList">
                    <tr
                        v-for="expense in expenseList.expense"
                        :key="expense.id"
                        @click="handlerModal(expense.id)"
                    >
                        <td>{{ expense.id }}</td>
                        <td>{{ expense.req_date }}</td>
                        <td>{{ expense.use_date }}</td>
                        <td>{{ expense.group_name }}</td>
                        <td>{{ expense.detail_name }}</td>
                        <td>{{ expense.use_department }}</td>
                        <td>{{ expense.expense_payment }}</td>
                        <td>{{ approvalMap[expense.is_approval] }}</td>
                    </tr>
                </template>
                <template v-else>
                    <tr>
                        <td colspan="7">일치하는 검색 결과가 없습니다</td>
                    </tr>
                </template>
            </tbody>
        </table>
        <Pagination
            :totalItems="expenseList?.expenseCnt"
            :items-per-page="5"
            :max-pages-shown="10"
            :onClick="searchList"
            v-model="cPage"
        />
    </div>
</template>

<script setup>
import axios from 'axios';
import { watch } from 'vue';
import { useModalStore } from '../../../../stores/modalState';
import { computed } from 'vue';
const modal = useModalStore();
const cPage = ref(1);
const route = useRoute();
const expenseList = ref();

const approvalMap = computed(() => ({
    W: '검토 대기',
    F: '승인 대기',
    S: '승인',
    N: '반려',
    C: '취소',
}));

const searchList = async () => {
    console.log('onMounted');
    const param = new URLSearchParams({
        ...route.query,
        pageSize: 5,
        currentPage: cPage.value,
    });

    try {
        const response = await axios.post('/api/account/expenseList.do', param);
        expenseList.value = response.data;
    } catch (e) {
        console.error('Axios Error:', e);
    }
};

onMounted(() => {
    console.log('onMounted');
    searchList();
});

watch(() => route.query, searchList);
</script>

<style lang="scss" scoped>
table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0px 0px 0px;
    font-size: 18px;

    th,
    td {
        padding: 8px;
        border: 1px solid #ddd;
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
