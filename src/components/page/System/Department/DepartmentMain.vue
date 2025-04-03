<template>
    <div>
        <DepartmentModal v-if="modal.modalState" :detailCode="detailCode" @modalClose="detailCode = $event"
            @saveSuccess="onSaveSuccess" />
        <table>
            <colgroup>
                <col width="50%" />
                <col width="50%" />
            </colgroup>

            <thead>
                <tr>
                    <th scope="col">부서코드</th>
                    <th scope="col">부서명</th>
                </tr>
            </thead>
            <tbody>
                <template v-if="dpList">
                    <template v-if="dpList.departmentCnt > 0">
                        <tr v-for="dp in dpList.departmentList" :key="dp.detailCode
                            " @click="handlerModal(dp.detailCode)">
                            <td>{{ dp.detailCode }}</td>
                            <td>{{ dp.detailName }}</td>
                        </tr>
                    </template>
                    <template v-else>
                        <tr>
                            <td colspan="2">일치하는 검색 결과가 없습니다</td>
                        </tr>
                    </template>
                </template>
            </tbody>
        </table>
        <Pagination :totalItems="dpList?.departmentCnt" :items-per-page="5" :max-pages-shown="10" :onClick="searchDp"
            v-model="cPage" />
    </div>
</template>
<script setup>
import axios from 'axios';
import { useModalStore } from '../../../../stores/modalState';
import { onMounted, watch } from 'vue';

const route = useRoute()
const dpList = ref()
const modal = useModalStore()
const detailCode = ref("")
const cPage = ref(1)

const searchDp = async () => {
    const param = {
        ...route.query,
        pageSize: 5,
        currentPage: cPage.value
    }

    try {
        const res = await axios.post('/api/system/departmentListBody', param)
        dpList.value = res.data
    } catch (e) {
        console.error(e)
    }
}

const handlerModal = (code) => {
    detailCode.value = code
    modal.setModalState()
}

const onSaveSuccess = () => {
    modal.setModalState()
    searchDp()
}

onMounted(() => {
    searchDp()
})

watch(() => route.query, searchDp)


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