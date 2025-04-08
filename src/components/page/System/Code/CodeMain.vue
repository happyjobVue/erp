<template>
    <div class="divNoticeList">
        <CodeModal
            v-if="modal.modalState"
            :id="groupCode"
            @modalClose="groupCode = $event"
            @postSuccess="onPostSuccess"
        />
        <table>
            <thead>
                <tr>
                    <th scope="col">공통코드</th>
                    <th scope="col">공통코드명</th>
                    <th scope="col">비고</th>
                </tr>
            </thead>
            <tbody>
                <template v-if="groupList">
                    <template v-if="groupList.groupCnt > 0">
                        <tr
                            v-for="groupCodeList in groupList.groupList"
                            :key="groupCodeList.groupCode"
                            @click="handlerModal(groupCode.groupCode)"
                        >
                            <td>{{ groupCodeList.groupCode }}</td>
                            <td>{{ groupCodeList.groupName }}</td>
                            <td>{{ groupCodeList.note }}</td>
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
        <Pagination
            :totalItems="groupList?.groupCnt"
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
const route = useRoute();
const modal = useModalStore();
const groupList = ref();
const groupCode = ref(0);
const cPage = ref(1);

const searchList = async () => {
    const param = new URLSearchParams({
        ...route.query,
        pageSize: 5,
        currentPage: cPage.value,
    });

    try {
        const response = await axios.post(
            '/api/system/commonCodeListBody.do',
            param
        );
        groupList.value = response.data;
    } catch (e) {
        console.error(e);
    }
};

const handlerModal = id => {
    groupCode.value = id;
    modal.setModalState();
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
