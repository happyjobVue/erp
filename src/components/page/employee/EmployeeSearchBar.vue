<script setup>
import { ref } from 'vue';
import router from '../../../router';

const searchName = ref('');
const searchRegDateStart = ref('');
const searchRegDateEnd = ref('');
const department = ref('');
const jobGrade = ref('');
const emplStatus = ref('');
const searchId = ref();

const emit = defineEmits(['emplStatusW','emplStatusF','ModalOpenStatus']);

const personnelDptOptions = ref([
    { value: '회계부', label: '회계부'},
    { value: '영업부', label: '영업부'},
    { value: '총무부', label: '총무부'},
    { value: '개발2부', label: '개발2부'},
    { value: '개발1부', label: '개발1부'},
    { value: '경영진', label: '경영진'},
]);

const personnelJbOptions = ref([
    { value: 'JGA', label: 'JGA'},
    { value: 'JGS', label: 'JGS'},
    { value: 'JGM', label: 'JGM'},
    { value: 'JGG', label: 'JGG'},
]);

const SetEmplStatus = (val) => {
    if (val === 'W') {
        emplStatus.value = 'W'
        emit('EmplStatus', emplStatus.value );
        emit('OnEmplStatus');

    } else {
        emplStatus.value = 'F'
        emit('EmplStatus', emplStatus.value);
        emit('OnEmplStatus');
    }
};

const handlerSearch = () => {
    const query = [];

    !searchName.value || query.push(`searchName=${searchName.value}`);
    !searchRegDateStart.value ||
        query.push(`searchRegDateStart=${searchRegDateStart.value}`);
    !searchRegDateEnd.value ||
        query.push(`searchRegDateEnd=${searchRegDateEnd.value}`);
    !department.value || query.push(`department=${department.value}`);
    !jobGrade.value || query.push(`jobGrade=${jobGrade.value}`);
    !emplStatus.value || query.push(`emplStatus=${emplStatus.value}`);
    !searchId.value || query.push(`searchId=${searchId.value}`);

    const queryString = query.length > 0 ? `?${query.join('&')}` : '';

    router.push(queryString);
};


//modal 코드

const isModalOpen = ref(false);

const openModal = () => {
  isModalOpen.value = true;
  emit('ModalOpening', isModalOpen.value);
};

const closeModal = () => {
  isModalOpen.value = false;
 
};


onMounted(() => {
    window.location.search && router.replace(window.location.pathname);
});
</script>

<template>
    <div class="breadcrumb-container" style="width: 1210px; margin: 0 auto;">
        <!-- 홈 아이콘 -->
        <i class="ph ph-house"></i>

        <!-- 경로 텍스트 -->
        <span class="breadcrumb">인사/급여</span>
        <span class="separator">/</span>
        <span class="breadcrumb active">인사 관리</span>

        <!-- 새로고침 버튼 -->
        <button class="refresh-btn">
            <i class="ph ph-arrow-clockwise"></i>
        </button>
    </div>
    
    <div class="container">
        <h3 class="title">인사 관리</h3>
        <div class="search-container">
            <div class="filter-group">
                <label>부서</label>
                <select v-model="department">
                    <option value="" selected>전체</option>
                    <option v-for="DpOtion in personnelDptOptions" :key="DpOtion.value">
                        {{ DpOtion.label }}
                    </option>
                </select>

                <label>직급</label>
                <select v-model="jobGrade">
                    <option value="" selected>전체</option>
                    <option v-for="JbOtion in personnelJbOptions" :key="JbOtion.value">
                        {{ JbOtion.label }}
                    </option>
                </select>

                <label>사번</label>
                <input type="text" v-model="searchId" />

                <label>이름</label>
                <input type="text" v-model="searchName" />
            </div>
        </div>

        <div class="actions">
            <div class="button-group">
                <button @click="() => SetEmplStatus('W')" class="btn">재직자</button>
                <button @click="() => SetEmplStatus('F')" class="btn">퇴직자</button>
            </div>
            <div>
                <label>입사일 조회</label>
                <input type="date" v-model="searchRegDateStart" />
                <input type="date" v-model="searchRegDateEnd" />
                <button @click="handlerSearch" class="btn search-btn">검색</button>
                <button class="btn register-btn" @click="openModal">사원 등록</button>
            </div>
        </div>
    </div>
</template>
<style scoped>
/* 전체 컨테이너 */
.container {
    width: 100%;
    max-width: 1200px;
    margin: auto;
    padding: 20px;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 5px;
}

/* 제목 */
.title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 15px;
}

/* 검색 영역 */
.search-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border: 1px solid #ccc;
    background: #f8f9fa;
    border-radius: 5px;
}

/* 필터 그룹 (부서, 직급, 사번, 이름) */
.filter-group {
    display: flex;
    align-items: center;
    gap: 10px;
}

.filter-group label {
    font-weight: bold;
}

/* 입력창 & 셀렉트 박스 */
.filter-group select,
.filter-group input {
    padding: 6px;
    border: 1px solid #ccc;
    border-radius: 3px;
}

/* 버튼 그룹 */
.button-group {
    display: flex;
    gap: 5px;
}

/* 기본 버튼 스타일 */
.btn {
    padding: 8px 12px;
    border: none;
    border-radius: 3px;
    font-weight: bold;
    cursor: pointer;
    transition: 0.3s;
}

/* 검색 버튼 */
.search-btn {
    background: #007bff;
    color: white;
}

/* 사원 등록 버튼 */
.register-btn {
    background: #28a745;
    color: white;
}

/* 재직자 & 퇴직자 버튼 */
.button-group .btn {
    width: 80px;
    background: #e9ecef;
    font-size: 14px;
    font-weight: bold;
}

/* 입사일 조회 영역 */
.actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;
}

/* 입사일 조회 입력 및 버튼 그룹 */
.date-group {
    display: flex;
    align-items: center;
    gap: 10px; /* 간격 조정 */
}


/* 짝수 행 배경색 */
tr:nth-child(even) {
    background: #f9f9f9;
}

/* 특정 행 강조 (빨간 테두리 효과 가능) */
tr.highlight {
    border: 3px solid red;
}

/* 퇴직 처리 버튼 */
.retire-btn {
    background: #dc3545;
    color: white;
    border-radius: 3px;
    padding: 6px 12px;
    font-size: 13px;
    cursor: pointer;
    text-align: center;
    display: inline-block; /* 버튼 크기 고정 */
}

/* 전체 테이블을 감싸는 div */
.table-container {
    margin-top: 20px;
    overflow-x: auto; /* 테이블 가로 스크롤 가능 */
}

/* 페이지네이션 스타일 */
.pagination {
    display: flex;
    justify-content: center;
    margin-top: 15px;
}

.pagination button {
    padding: 6px 10px;
    margin: 2px;
    border: 1px solid #ccc;
    background: white;
    cursor: pointer;
}

.pagination button.active {
    background: #007bff;
    color: white;
    border-color: #007bff;
}

.breadcrumb-container {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 15px;
    background: #f8f9fa;
    border-radius: 5px;
    font-size: 14px;
    font-weight: 500;
    color: #333;
}

/* 아이콘 스타일 */
.breadcrumb-container i {
    font-size: 16px;
    color: #555;
}

/* 경로 텍스트 스타일 */
.breadcrumb {
    color: #666;
}

/* 현재 페이지 (활성화) */
.breadcrumb.active {
    font-weight: bold;
    color: #000;
}

/* 경로 구분자 */
.separator {
    color: #aaa;
}

/* 새로고침 버튼 */
.refresh-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 5px;
    margin-left: auto; /* 오른쪽 정렬 */
}

.refresh-btn i {
    font-size: 18px;
    color: #666;
    transition: transform 0.3s ease;
}

.refresh-btn:hover i {
    color: #000;
    transform: rotate(180deg);
} 

</style>

