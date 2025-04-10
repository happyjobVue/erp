<script setup>
import { ref } from 'vue';
import router from '../../../../router';

const searchEmployeeName = ref('');
const department = ref('');
const jobGrade = ref('');
const searchPaymentMonth = ref('');
const searchPaymentStatus = ref('');

//급여 계산 날짜 
const saveSalaryDate = ref('');



const emit = defineEmits(['allPaymentStatusUpdate','saveSalaryDate']);



const salarySearch = () => {
    const query = [];

    !searchEmployeeName.value || query.push(`searchEmployeeName=${searchEmployeeName.value}`);
    !department.value ||
        query.push(`department=${department.value}`);
    !jobGrade.value ||
        query.push(`jobGrade=${jobGrade.value}`);
    !searchPaymentMonth.value || query.push(`searchPaymentMonth=${searchPaymentMonth.value}`);
    !searchPaymentStatus.value || query.push(`searchPaymentStatus=${searchPaymentStatus.value}`);

    const queryString = query.length > 0 ? `?${query.join('&')}` : '';

    router.push(queryString);
};


//일괄 지급 
const allPaymentStatusUpdate = () => {
    emit('allPaymentStatusUpdate', searchPaymentMonth.value);
}

//급여계산 
const salarySave = () => {
    emit('saveSalaryDate', saveSalaryDate.value);
}

const departmentGroupList = [
    { departmentDetailName: '회계부' },
    { departmentDetailName: '영업부' },
    { departmentDetailName: '총무부' },
    { departmentDetailName: '개발2부' },
    { departmentDetailName: '개발1부' },
    { departmentDetailName: '경영진' },
];

const jobGradeGroupList = [
    { jobGradeDetailName: '부장' },
    { jobGradeDetailName: '과장' },
    { jobGradeDetailName: '대리' },
    { jobGradeDetailName: '사원' },
];

</script>
<template>
    <div class="promotion-container">
        <div class="page-header">
        <div class="breadcrumb">
        <i class="icon-home" />
        <span class="divider">/</span>
        <span class="section">인사/급여</span>
        <span class="divider">/</span>
        <span class="current">급여 관리</span>
        </div>
        <button class="refresh-btn" @click="handleRefresh">
        <i class="icon-refresh" />
        </button>
    </div>
  
      <div class="section-title">
        급여 관리
        <span class="date-filter">
          <input type="month" v-model="saveSalaryDate" />
          <button class="btn search" @click="salarySave">급여계산</button>
        </span>
      </div>
  
      <div class="search-box">
        <div class="filters">
          <label>
            사원명
            <input type="text" v-model="searchEmployeeName" />
          </label>
          <label>
            급여년월
            <input type="month" v-model="searchPaymentMonth" />
          </label>
          <label>
            부서
            <select v-model="department">
              <option value="">전체</option>
                    <option
                        v-for="d in departmentGroupList"
                        :key="d.departmentDetailName"
                        :value="d.departmentDetailName"
                    >
                        {{ d.departmentDetailName }}
                    </option>
            </select>
          </label>
          <label>
            직급
            <select v-model="jobGrade">
                <option value="">전체</option>
                    <option
                        v-for="j in jobGradeGroupList"
                        :key="j.jobGradeDetailName"
                        :value="j.jobGradeDetailName"
                    >
                        {{ j.jobGradeDetailName }}
                    </option>
            </select>
          </label>
          <label>
            지급여부
            <select v-model="searchPaymentStatus">
              <option value="">전체</option>
              <option value="1">지급</option>
              <option value="0">미지급</option>
            </select>
          </label>
           <button class="btn search" @click="salarySearch">검색</button>
           <button class="btn search" @click="allPaymentStatusUpdate">일괄지급</button>
        </div>
      </div>
      </div>
</template>
