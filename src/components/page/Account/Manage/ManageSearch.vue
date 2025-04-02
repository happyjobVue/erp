<script setup>
import router from '@/router';
import { onMounted } from 'vue';
import { useModalStore } from '../../../../stores/modalState';
const { setModalState } = useModalStore();
const searchTitle = ref('');
const searchStDate = ref('');
const searchEdDate = ref('');
const searchGroup = ref('');
const searchDetail = ref('');
const searchCodeType = ref('');
const searchUseYn = ref('');

const handleSearch = () => {
    const query = [];
    !searchTitle.value || query.push(`searchTitle=${searchTitle.value}`);
    !searchStDate.value || query.push(`searchStDate=${searchStDate.value}`);
    !searchEdDate.value || query.push(`searchEdDate=${searchEdDate.value}`);
    !searchGroup.value || query.push(`searchGroup=${searchGroup.value}`);
    !searchDetail.value || query.push(`searchDetail=${searchDetail.value}`);
    !searchCodeType.value ||
        query.push(`searchCodeType=${searchCodeType.value}`);
    !searchUseYn.value || query.push(`searchUseYn=${searchUseYn.value}`);
    const queryString = query.length > 0 ? `?${query.join('&')}` : '';

    router.push(queryString);
};
const groupOptions = [
    { label: '전체', value: '' },
    { label: '온라인매출', value: 'A' },
    { label: '영업매출', value: 'B' },
    { label: '온라인지출', value: 'B' },
    { label: '영업지출', value: 'B' },
    { label: '유동자산', value: 'B' },
];

const codeTypeOptions = [
    { label: '전체', value: '' },
    { label: '수입', value: 'type1' },
    { label: '지출', value: 'type2' },
];

const useYnOptions = [
    { label: '전체', value: '' },
    { label: 'Y', value: 'Y' },
    { label: 'N', value: 'N' },
];

onMounted(() => {
    window.location.search && router.replace(window.location.pathname);
});
</script>

<template>
    <div class="search-container">
        <!-- 첫 번째 줄 -->
        <div class="search-box">
            <label>그룹 선택:</label>
            <select v-model="searchGroup">
                <option
                    v-for="option in groupOptions"
                    :key="option.value"
                    :value="option.value"
                >
                    {{ option.label }}
                </option>
            </select>

            <label>코드 유형:</label>
            <select v-model="searchCodeType">
                <option
                    v-for="option in codeTypeOptions"
                    :key="option.value"
                    :value="option.value"
                >
                    {{ option.label }}
                </option>
            </select>

            <label>사용 여부:</label>
            <select v-model="searchUseYn">
                <option
                    v-for="option in useYnOptions"
                    :key="option.value"
                    :value="option.value"
                >
                    {{ option.label }}
                </option>
            </select>

            <input v-model.lazy="searchTitle" placeholder="검색어 입력" />
            <input type="date" v-model="searchStDate" />
            <input type="date" v-model="searchEdDate" />
            <button @click="handleSearch">검색</button>
        </div>

        <!-- 두 번째 줄 (오른쪽 끝에 등록 버튼) -->
        <div class="register-box">
            <button @click="setModalState">등록</button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
/* 검색 전체 컨테이너 */
.search-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

/* 첫 번째 줄 검색 영역 */
.search-box {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    background-color: #e0e0e0;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 12px 15px;
    margin: 10px 0;
}

/* "등록" 버튼을 우측 정렬 */
.register-box {
    display: flex;
    justify-content: flex-end;
}

select,
input {
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
}

button {
    width: 70px;
    padding: 8px;
    font-size: 12px;
    cursor: pointer;
    border-radius: 12px;
    box-shadow: 0 4px #999;
    background-color: #3bb2ea;
    color: white;
    border: none;

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
