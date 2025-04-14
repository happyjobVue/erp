<script setup>
import EmployeeSearchBar from '../../../components/page/personnel/employee/EmployeeSearchBar.vue';
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import Pagination from '../../../components/common/Pagination.vue';
import EmployeeModal from '../../../components/page/personnel/employee/EmployeeModal.vue';
import router from '../../../router';

const route = useRoute();
const personnelList = ref([]);
const cPage = ref(1);
const isModalOpen = ref(false);
//퇴직에 사용될 것 
const UserDetail = ref({});
//유저 상세보기
const employeeDetail = ref({});

/* 현재 재직상태 변경 */
const chEmplStatus = ref('');

//modal type별 정의 
const modalType = ref('');

const imgUrl = ref('');

//1. 인사 관리 리스트 조회  
const personnelSearchList = () => {
    console.log('쿼리 값:', route.query);

    const param = {
        ...route.query,
        pageSize: 5,
        currentPage: cPage.value,
    };

    AxiosRequest('employeeListBody',param ,personnelList);

};

//개인 조회 
const checkPerson = (personnel) => {
    modalType.value = 'update'
    
    const param = {
        employeeId: personnel.employeeId,
        jobGradeCode: personnel.jobGradeCode,
    }

    axios
        .post(`/api/personnel/employeeDetailBody`, param, {
            headers: {
                'Content-Type': 'application/json', // JSON 형식으로 전송
            },
        })
        .then(res => {
            employeeDetail.value = res.data.detail;
            OntotalSalary(employeeDetail.value.employeeName)
            console.log(employeeDetail.value);
            if (
                employeeDetail.value.profileFileExt === 'jpg' ||
                employeeDetail.value.profileFileExt === 'gif' ||
                employeeDetail.value.profileFileExt === 'png'
            ) {
                getFileImage(personnel.employeeId);

            } 

            isModalOpen.value = true;

        })
        .catch(err => {
            console.error('에러 발생:', err);
        });

}


//연봉 정보 불러오기 
const OntotalSalary = (val) => {

const param = {
    searchEmployeeName: val,
    pageSize: 1,
    currentPage: 1,
};

axios
    .post(`/api/personnel/salaryListBody`, param, {
        headers: {
            'Content-Type': 'application/json', // JSON 형식으로 전송
        },
    })
    .then(res => {
        console.log(res.data.salaryList[0].salary);
        employeeDetail.value.salary = res.data.salaryList[0].salary;
        console.log(employeeDetail.value);
    })
    .catch(err => {
        console.error('에러 발생:', err);
    });
}

const getFileImage = (val) => {
  const param = new URLSearchParams();
  param.append('employeeId', val);

  axios
    .post('/api/personnel/employeeDownloadVue.do', param, {
      responseType: 'blob',
    })
    .then(res => {
      if (res.status === 204 || res.data.size === 0) {
        imgUrl.value = '/images/default-profile.png'; // 기본 이미지 경로
        return;
      }

      const blob = new Blob([res.data], { type: res.headers['content-type'] });
      imgUrl.value = URL.createObjectURL(blob);
    })
    .catch(err => {
      console.error('이미지 요청 실패:', err);
      imgUrl.value = '/images/default-profile.png';
    });
};

//2. 재직자, 퇴직자의 따른 재 검색 
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

//3. 퇴직 모달창 열기 
const Onretire = (personnel) => {

    modalType.value = 'retire'


    const param = JSON.parse(JSON.stringify(personnel));

/*     AxiosRequest('employeeDetailBody', param, UserDetail);
 */

    axios
        .post(`/api/personnel/employeeDetailBody`, param, {
            headers: {
                'Content-Type': 'application/json', // JSON 형식으로 전송
            },
        })
        .then(res => {
            UserDetail.value = res.data;
            console.log(UserDetail.value);
            isModalOpen.value = true;
        })
        .catch(err => {
            console.error('에러 발생:', err);
        });

}

//모달창에서 상위컴포넌트에서 모달창 열리게하기
const OpenRetireModal = (val) => {
    modalType.value = 'retire'

    /*     AxiosRequest('employeeDetailBody', param, UserDetail);
    */

    const param = {
        employeeId: val.employeeId,
        jobGradeCode: val.jobGradeCode
    };

    axios
        .post(`/api/personnel/employeeDetailBody`, param, {
            headers: {
                'Content-Type': 'application/json', // JSON 형식으로 전송
            },
        })
        .then(res => {
            UserDetail.value = res.data;
            console.log(UserDetail.value);
            isModalOpen.value = true;
        })
        .catch(err => {
            console.error('에러 발생:', err);
        });

}


//퇴직 처리 하기 
const handleRetireInfo = (retireData) => {
  console.log("퇴직 정보:", retireData);

  // 예: 개별로 꺼낼 수도 있음
  const { resignationReason, resignationDate, severancePay, salary, employeeId } = retireData;
  
  //퇴직사유나 퇴직급여 입력 유효성 검사 
  if(resignationReason !== '' && severancePay !== '' && resignationDate !== ''){

    //응답형이 @RequestParam임 
    const params = new URLSearchParams();

    params.append('employeeId', employeeId);
    params.append('emplStatus', 'F');
    params.append('resignationReason', resignationReason );
    params.append('resignationDate', resignationDate );
    params.append('severancePay',severancePay  );
    params.append('salary',salary);

    axios
        .post(`/api/personnel/emplStatusUpdate.do`, params)
        .then(res => {
            console.log(res.data);
            closeModal();
            personnelSearchList();
        })
        .catch(err => {
            console.error('에러 발생:', err);
        });
  }else {
    alert("퇴직사유나 퇴직급여를 입력해주세요");
  }

};


//Axios 요청 함수 
const AxiosRequest =  (UrlInfo, param, valueName) => {
    axios
        .post(`/api/personnel/${UrlInfo}`, param, {
            headers: {
                'Content-Type': 'application/json', // JSON 형식으로 전송
            },
        })
        .then(res => {
            valueName.value = res.data;
            console.log(res.data);
        })
        .catch(err => {
            console.error('에러 발생:', err);
        });
}

//queryString 제거 
const NoqueryString = () => {
    window.location.search && router.replace(window.location.pathname);
};

//모달 열기 / 모달 창한개로 modalType으로 각각 불러옴 
const ModalOpening = ({ isModalOpen : isModalOpenval, modalType : modalTypeval  }) => {
  
    modalType.value = modalTypeval;
    isModalOpen.value = isModalOpenval; 
    

}


//모달 닫기 
const closeModal = (val) => {
  isModalOpen.value = val;
  personnelSearchList();
};


onMounted(() => {
    console.log('쿼리 값:', route.query);
    personnelSearchList();
    NoqueryString();
});

watch(() => route.query, () => {
    cPage.value = 1;
    personnelSearchList();
});

computed(() => UserDetail.value.detail?.employeeName || "이름 없음");

</script>

<template>

    <!-- 사원 검색 바  -->
    <EmployeeSearchBar

        @EmplStatus="GetEmplStatus"
        @OnEmplStatus="OnEmplStatus"
        @ModalOpening="ModalOpening($event)"
    />

    <!-- 공통 모달  -->
    <div v-show="isModalOpen">
        <EmployeeModal 

        :modalType="modalType"
        :UserDetail="UserDetail"
        :employeeDetail="employeeDetail"
        :imgUrl="imgUrl"

        @closeModal="closeModal"
        @update-retire-info="handleRetireInfo"
        @OpenRetireModal="OpenRetireModal"

        />
    </div> 


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
            @click="() => checkPerson(personnel)"
        >
            <td>{{ personnel.number }}</td>
            <td>{{ personnel.employeeName }}</td>
            <td>{{ personnel.departmentCode }}</td>
            <td>{{ personnel.departmentDetailName }}</td>
            <td>{{ personnel.jobGradeDetailName }}</td>
            <td>{{ personnel.regDate }}</td>
            <td>{{ personnel.emplStatus }}</td>
            <td>{{ personnel.resignationDate }}</td>
            <td>               
                <button @click.stop="() => Onretire(personnel)" :disabled="!!personnel.resignationDate">
                    퇴직처리
                </button>
            </td>
        </tr>
    </table>
    <Pagination
        :totalItems="personnelList?.employeeCnt"
        :items-per-page="5"
        :max-pages-shown="5"
        :onClick="personnelSearchList"
        v-model="cPage"
    />
</template>
<style scoped>
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

table tr:hover {
  background-color: #f0f8ff; /* 연한 파란 배경 */
  cursor: pointer; /* 마우스 커서 바꾸기 */
    }  
</style>