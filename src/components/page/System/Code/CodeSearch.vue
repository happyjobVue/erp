<template>
    <div class="search-box">
        공통코드명 :
        <input
            v-model.lazy="searchGroupName"
            placeholder="공통코드명을 입력해주세요."
        />
        비고 :
        <input
            v-model.lazy="searchGroupNote"
            placeholder="비고를 입력해주세요."
        />
        <button @click="handleSearch">검색</button>
        <button @click="setModalState">등록</button>
    </div>
</template>

<script setup>
import router from '@/router';
import { onMounted } from 'vue';
import { useModalStore } from '../../../../stores/modalState';
const { setModalState } = useModalStore();
const searchGroupName = ref('');
const searchGroupNote = ref('');

const handleSearch = () => {
    const query = [];
    !searchGroupName.value ||
        query.push(`searchGroupName=${searchGroupName.value}`);
    !searchGroupNote.value ||
        query.push(`searchGroupNote=${searchGroupNote.value}`);
    const queryString = query.length > 0 ? `?${query.join('&')}` : '';

    router.push(queryString);
};

onMounted(() => {
    window.location.search && router.replace(window.location.pathname);
});
</script>

<style lang="scss" scoped>
.search-box {
    margin-bottom: 10px;
    display: block;
    float: inline-end;
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
