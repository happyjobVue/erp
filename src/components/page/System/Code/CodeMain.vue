<template>
    <div class="divCode">
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
                <template v-if="groupCodeList">
                    <template v-if="groupCodeList.groupCnt > 0">
                        <tr
                            v-for="groupCode in groupCodeList.groupList"
                            :key="groupCode.groupCode"
                            @click="handlerModal(groupCode.groupCode)"
                        >
                            <td>{{ groupCode.groupCode }}</td>
                            <td>{{ groupCode.groupName }}</td>
                            <td>{{ groupCode.note }}</td>
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
            :totalItems="groupCodeList?.groupCnt"
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
const groupCodeList = ref();
const groupCode = ref(0);
const cPage = ref(1);

const searchList = async () => {
    console.log('route.query:', route.query);
    const param = new URLSearchParams({
        ...route.query,
        pageSize: 5,
        currentPage: cPage.value,
    });

    try {
        const response = await axios.post(
            '/api/system/groupCodeListBody.do',
            param
        );
        groupCodeList.value = response.data;
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
watch(cPage, searchList);
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
