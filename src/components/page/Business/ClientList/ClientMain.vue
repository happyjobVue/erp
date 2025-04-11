<script setup>
import axios from 'axios';

import { ref, watch } from 'vue';
import { useModalStore } from '../../../../stores/modalState';
import ClientDetailModal from './ClientDetailModal.vue';
import ClientRegisterModal from './ClientRegisterModal.vue';
const modalType = ref('');
const modalState = useModalStore();
const cPage = ref(1);
const clients = ref();
const clientListCnt = ref();
const selectedClient = ref();
const route = useRoute();

onMounted(() => {
    clientList();
});

//등록 모달 열기
const registerClientModal = () => {
    console.log('등록');
    modalType.value = 'register';
    modalState.setModalState(true);
};
// 모달이 성공적으로 닫힌 후 실행될 함수
const onPostSuccess = () => {
    modalState.setModalState(); // 모달 열기
    modalType.value = ''; // 모달 타입 초기화
    getAllEstimate(); // 목록 새로고침
};

const onModalClose = () => {
    console.log('모달 close');
};

//상세 보기 모달
const detailClient = client => {
    console.log('상세' + client);
    modalType.value = 'view';
    modalState.setModalState(true);
    selectedClient.value = client;
};

const clientList = () => {
    const param = {
        currentPage: cPage.value,
        pageSize: 5,
    };
    axios
        .post('/api/business/client-list/searchClientListBody.do', param)
        .then(res => {
            clients.value = res.data.clientList;
            clientListCnt.value = res.data.clientListCnt;
        });
};

// 검색된 견적서 목록 불러오는 함수
const searchClientList = () => {
    console.log('검색 로직 ');
    const param = {
        ...route.query,
        currentPage: cPage.value,
        pageSize: 5,
    };
    axios
        .post('/api/business/client-list/searchClientListBody.do', param)
        .then(res => {
            clients.value = res.data.clientList;
            clientListCnt.value = res.data.clientListCnt;
        });
};

watch(() => route.query, searchClientList);
</script>

<template>
    <div>
        <!-- 상세 보기 모달 -->
        <ClientDetailModal
            v-if="modalState.modalState && modalType === 'view'"
            :client="selectedClient"
            @modalClose="onModalClose"
            @postSuccess="onPostSuccess"
        />

        <!-- 등록 모달  -->
        <ClientRegisterModal
            v-if="modalState.modalState && modalType === 'register'"
            @postSucess="onPostSuccess"
            @modalClose="onModalClose"
        />
        <button @click="registerClientModal()">등록</button>
        <table>
            <thead>
                <tr>
                    <th scope="col">번호</th>
                    <th scope="col">등록 날짜</th>
                    <th scope="col">거래처</th>
                    <th scope="col">담당자</th>
                    <th scope="col">전화번호</th>
                    <th scope="col">핸드폰</th>
                    <th scope="col">이메일</th>
                    <th scope="col">주소</th>
                    <th scope="col">메모</th>
                </tr>
            </thead>
            <tbody>
                <template v-if="clients">
                    <template v-if="clientListCnt > 0">
                        <tr
                            v-for="client in clients"
                            :key="client.id"
                            @click="detailClient(client)"
                        >
                            <td>{{ client.id }}</td>
                            <td>{{ client.cust_update_date }}</td>
                            <td>{{ client.client_name }}</td>
                            <td>{{ client.person }}</td>
                            <td>{{ client.ph }}</td>
                            <td>{{ client.person_ph }}</td>
                            <td>{{ client.email }}</td>
                            <td>{{ client.addr }}</td>
                            <td>{{ client.memo }}</td>
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
            :totalItems="clientListCnt"
            :items-per-page="5"
            :max-pages-shown="5"
            :onClick="clientList"
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
