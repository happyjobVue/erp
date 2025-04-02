<template>
    <div class="divNoticeList">
        <NoticeModal v-if="modal.modalState" :id="noticeId" @modalClose="noticeId = $event"
            @postSuccess="onPostSuccess" />
        <table>
            <colgroup>
                <col width="10%" />
                <col width="50%" />
                <col width="30%" />
                <col width="10%" />
            </colgroup>

            <thead>
                <tr>
                    <th scope="col">번호</th>
                    <th scope="col">제목</th>
                    <th scope="col">작성일</th>
                    <th scope="col">작성자</th>
                </tr>
            </thead>
            <tbody>
                <template v-if="noticeList">
                    <template v-if="noticeList.noticeCnt > 0">
                        <tr v-for="notice in noticeList.noticeList" :key="notice.noticeId"
                            @click="handlerModal(notice.noticeId)">
                            <td>{{ notice.noticeId }}</td>
                            <td>{{ notice.title }}</td>
                            <td>{{ notice.createdDate.substr(0, 10) }}</td>
                            <td>{{ notice.author }}</td>
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
        <Pagination :totalItems="noticeList?.noticeCnt" :items-per-page="5" :max-pages-shown="10" :onClick="searchList"
            v-model="cPage" />
    </div>
</template>

<script setup>
import axios from 'axios'
import { watch } from 'vue'
import { useModalStore } from '../../../../stores/modalState'
const route = useRoute()
const noticeList = ref()
const modal = useModalStore()
const noticeId = ref(0)
const cPage = ref(1)

const searchList = async () => {
    const param = new URLSearchParams({
        ...route.query,
        pageSize: 5,
        currentPage: cPage.value,
    })

    try {
        const response = await axios.post('/api/management/noticeListBody.do', param)
        noticeList.value = response.data
    } catch (e) {
        console.error(e);
    }
}

const handlerModal = (id) => {
    noticeId.value = id
    modal.setModalState();
}

const onPostSuccess = () => {
    modal.setModalState()
    searchList()
}

onMounted(() => {
    searchList()
})

watch(() => route.query, searchList)

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
