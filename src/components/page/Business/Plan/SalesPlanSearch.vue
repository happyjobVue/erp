<script setup>
import { ref, onMounted } from 'vue';
import {
    fetchManufacturers,
    fetchProductsByManufacturer,
} from '../../../../common/selectBoxApi';
import router from '@/router';
import { useModalStore } from '../../../../stores/modalState';
const manufacturers = ref(''); // 제조사 목록
const productList = ref([]);
const modalState = useModalStore();
const selectedManufacturer = ref(''); // 선택된 제조사
const selectedProduct = ref(); // 선택된 제품
const searchStDate = ref(''); // 선택된 날짜

async function handleManufacturerChange() {
    if (selectedManufacturer.value) {
        productList.value = await fetchProductsByManufacturer(
            selectedManufacturer.value
        );
    }
}

const handlerSearch = () => {
    const query = [];
    !selectedManufacturer.value ||
        query.push(`industryCode=${selectedManufacturer.value}`);
    !selectedProduct.value || query.push(`productId=${selectedProduct.value}`);
    !searchStDate.value || query.push(`searchStDate=${searchStDate.value}`);
    const queryString = query.length > 0 ? `?${query.join('&')}` : '';
    console.log(queryString);

    router.push(queryString);
};

onMounted(() => {
    window.location.search && router.replace(window.location.pathname);
});

// 컴포넌트가 마운트될 때 제조사 목록을 가져오기
onMounted(async () => {
    manufacturers.value = await fetchManufacturers();
});
</script>

<template>
    <div class="search-box">
        <!-- 제조사 셀렉트 박스 -->
        <select
            v-model="selectedManufacturer"
            @change="handleManufacturerChange"
        >
            <option value="" disabled>제조사</option>
            <option
                v-for="manufacturer in manufacturers"
                :key="manufacturer.manufacturer_id"
                :value="manufacturer.industryCode"
            >
                {{ manufacturer.industryName }}
            </option>
        </select>

        <!-- 제품 목록 -->
        <select v-model="selectedProduct">
            <option value="" disabled>제품</option>
            <option
                v-for="product in productList"
                :key="product.id"
                :value="product.id"
            >
                {{ product.name }}
            </option>
        </select>
        <input type="date" v-model="searchStDate" />
    </div>
    <button @click="handlerSearch">조회</button>
    <button @click="modalState.setModalState()">신규 등록</button>
</template>

<style lang="scss" scoped>
.search-box {
    margin-bottom: 10px;
    display: block;
}

input {
    padding: 8px;
    margin-top: 5px;
    margin-bottom: 5px;
    margin-right: 5px;
    border-radius: 4px;
    border: 1px solid #ccc;
}

select {
    width: 15%;
    padding: 8px;
    margin-top: 5px;
    margin-bottom: 10px;
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
