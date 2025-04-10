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
        <label class="toggle-switch">
            <input
                type="checkbox"
                v-model="showInactive"
                true-value="true"
                false-value=""
            />
            <span class="slider"></span>
            <span class="status-text">
                {{ showInactive === 'true' ? '미사용 코드' : '사용 코드' }}
            </span>
        </label>
    </div>
</template>

<script setup>
import router from '@/router';
import { onMounted } from 'vue';
import { useModalStore } from '../../../../stores/modalState';
const { setModalState } = useModalStore();
const searchGroupName = ref('');
const searchGroupNote = ref('');
const showInactive = ref(false);

const handleSearch = () => {
    const query = [];
    !searchGroupName.value ||
        query.push(`searchGroupName=${searchGroupName.value}`);
    !searchGroupNote.value ||
        query.push(`searchGroupNote=${searchGroupNote.value}`);
    showInactive.value && query.push('showInactive=true');

    const queryString = query.length > 0 ? `?${query.join('&')}` : '';

    router.push(queryString);
};

onMounted(() => {
    window.location.search && router.replace(window.location.pathname);
});
watch(showInactive, () => {
    handleSearch();
});
</script>

<style lang="scss" scoped>
.toggle-switch {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    position: relative;
    margin-left: 10px;

    input {
        display: none;
    }

    .slider {
        position: relative;
        width: 40px;
        height: 20px;
        background-color: #ccc;
        border-radius: 34px;
        transition: 0.4s;
        margin-right: 8px;
    }

    .slider::before {
        content: '';
        position: absolute;
        height: 16px;
        width: 16px;
        left: 2px;
        bottom: 2px;
        background-color: white;
        border-radius: 50%;
        transition: 0.4s;
    }

    input:checked + .slider {
        background-color: #3bb2ea;
    }

    input:checked + .slider::before {
        transform: translateX(20px);
    }

    .status-text {
        font-size: 14px;
        width: 80px; /* 고정 너비 */
        text-align: center;
        display: inline-block;
    }
}

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
