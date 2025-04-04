<template>
    <div class="search-box">
        <span class="search-span">부서명</span>
        <input v-model="searchDepartmentName" placeholder="부서명을 입력하세요" />
        <button @click="handleSearch">조회</button>
        <button @click="setModalState">등록</button>
    </div>
</template>

<script setup>
import router from '@/router';
import { ref, onMounted } from 'vue';
import { useModalStore } from '../../../../stores/modalState';

// modal 상태를 제어하는 store 함수 가져오기
const { setModalState } = useModalStore();

// 부서명 검색을 위한 reactive 상태
const searchDepartmentName = ref('');

// 검색 처리 함수
const handleSearch = () => {
    const query = [];
    if (searchDepartmentName.value) {
        query.push(`searchDepartmentName=${searchDepartmentName.value}`);
    }

    // 쿼리 문자열이 있을 때만 URL에 추가
    const queryString = query.length > 0 ? `?${query.join('&')}` : '';

    // 라우터로 이동 (queryString이 비어 있지 않으면 추가)
    router.push(queryString);
};

// 페이지가 새로 고침될 때 쿼리 파라미터 제거
onMounted(() => {
    if (window.location.search) {
        router.replace(window.location.pathname); // 쿼리 파라미터를 지우고 페이지를 리프레시
    }
});
</script>

<style lang="scss" scoped>
.search-box {
    margin-bottom: 10px;
    display: block;
    float: inline-end;
}

.search-span {
    font-size: 13px;
    margin-right: 5px;
}

input {
    padding: 8px;
    margin-top: 5px;
    margin-bottom: 5px;
    margin-right: 5px;
    border-radius: 4px;
    border: 1px solid #ccc;
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
