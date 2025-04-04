<script setup>
import EmployeeSearchBar from '../../components/page/employee/EmployeeSearchBar.vue';
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import Pagination from '../../components/common/Pagination.vue';
import router from '../../router';
import EmployeeModal from '../../components/page/employee/EmployeeModal.vue';

const route = useRoute();
const personnelList = ref([]);
const cPage = ref(1);
const isModalOpen = ref(false);

/* 현재 재직상태 변경 */
const chEmplStatus = ref('');

const personnelSearchList = () => {
    console.log('쿼리 값:', route.query);

    const param = {
        ...route.query,
        pageSize: 5,
        currentPage: cPage.value,
    };

    axios
        .post('/api/personnel/employeeListBody', param, {
            headers: {
                'Content-Type': 'application/json', // JSON 형식으로 전송
            },
        })
        .then(res => {
            personnelList.value = res.data;
            console.log(res.data);
        })
        .catch(err => {
            console.error('에러 발생:', err);
        });
};

const GetEmplStatus = val => {
    chEmplStatus.value = val;
};

const OnEmplStatus = () => {
    //F W 재직 상태에 따라서 값 변경
    router.push({
        path: route.path,
        query: { ...route.query, emplStatus: chEmplStatus.value},
    });

    console.log(chEmplStatus.value);

    //다시 재 검색
    if(cPage.value !== 1){
        cPage.value =1;
    }
    personnelSearchList()

};

const NoqueryString = () => {
    window.location.search && router.replace(window.location.pathname);
};

//모달
const ModalOpening = (val) => {
    isModalOpen.value = val;    
}

const closeModal = (val) => {
  isModalOpen.value = val;
};

onMounted(() => {
    console.log('쿼리 값:', route.query);
    personnelSearchList();
    NoqueryString();
});

watch(() => route.query, () => {
    personnelSearchList();
});

</script>

<template>
    <EmployeeSearchBar

        @EmplStatus="GetEmplStatus"
        @OnEmplStatus="OnEmplStatus"
        @ModalOpening="ModalOpening"
    />

    <EmployeeModal 

        v-show="isModalOpen"
        @closeModal="closeModal"
    />

    <table>
        <thead>
            <td scope="col">사번</td>
            <td scope="col">사원명</td>
            <td scope="col">부서코드</td>
            <td scope="col">부서명</td>
            <td scope="col">직급</td>
            <td scope="col">입사일자</td>
            <td scope="col">휴직</td>
            <td scope="col">퇴직일자</td>
            <td scope="col">
                퇴직처리
            </td>
        </thead>

        <tr
            v-for="personnel in personnelList.employeeList"
            :key="personnel.employeeId"
        >
            <td>{{ personnel.number }}</td>
            <td>{{ personnel.employeeName }}</td>
            <td>{{ personnel.departmentCode }}</td>
            <td>{{ personnel.departmentDetailName }}</td>
            <td>{{ personnel.jobGradeCode }}</td>
            <td>{{ personnel.regDate }}</td>
            <td>{{ personnel.emplStatus }}</td>
            <td>{{ personnel.resignationDate }}</td>
            <td>               
                <button>
                    퇴직처리
                </button>
            </td>
        </tr>
    </table>
    <Pagination
        :totalItems="personnelSearchList?.employeeCnt"
        :items-per-page="5"
        :max-pages-shown="5"
        :onClick="personnelSearchList"
        v-model="cPage"
    />
</template>
<style>
/* 테이블 전체 스타일 */
table {
    width: 1240px;
    border-collapse: collapse;
    margin: 0 auto;
    margin-top: 15px;
    border: 2px solid #ccc; /* 테두리 추가 */
}

/* 테이블 헤더 스타일 */
th {
    background: #e9ecef;
    font-weight: bold;
    text-align: center;
    border: 2px solid #ccc;
    padding: 12px;
    white-space: nowrap; /* 텍스트 줄바꿈 방지 */
}

/* 테이블 셀 스타일 */
td {
    border: 2px solid #ddd;
    padding: 12px;
    text-align: center;
    white-space: nowrap;
}
</style>