<script setup>
import axios from 'axios';
import { watch } from 'vue';
import { useModalStore } from '../../../../stores/modalState';
const route = useRoute();
const accountList = ref();
const modal = useModalStore();
const cPage = ref(1);

const searchList = async () => {
    const param = new URLSearchParams({
        ...route.query,
        pageSize: 5,
        currentPage: cPage.value,
    });

    try {
        const response = await axios.post('/api/account/accountList.do', param);
        accountList.value = response.data;
    } catch (e) {
        console.error('Axios Error:', e);
    }
};

const onPostSuccess = () => {
    modal.setModalState();
    searchList();
};

onMounted(() => {
    searchList();
});

watch(() => route.query, searchList);
</script>

<template>
    <div class="divNoticeList">
        <ManageModal
            v-if="modal.modalState"
            :id="detailCode"
            @modalClose="detailCode = $event"
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
                    <th scope="col">계정대분류코드</th>
                    <th scope="col">계정대분류명</th>
                    <th scope="col">계정세부코드</th>
                    <th scope="col">계정세부명</th>
                    <th scope="col">구분</th>
                    <th scope="col">상세내용</th>
                    <th scope="col">사용여부</th>
                </tr>
            </thead>
            <tbody>
                <template v-if="accountList">
                    <tr
                        v-for="account in accountList.account"
                        :key="account.detail_code"
                    >
                        <td>{{ account.group_code }}</td>
                        <td>{{ account.group_name }}</td>
                        <td>{{ account.detail_code }}</td>
                        <td>{{ account.detail_name }}</td>
                        <td>{{ account.code_type }}</td>
                        <td>{{ account.content }}</td>
                        <td>{{ account.use_yn }}</td>
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
            :totalItems="accountList?.accountCnt"
            :items-per-page="5"
            :max-pages-shown="10"
            :onClick="searchList"
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
