<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import SalesPlanMain from './SalesPlanMain.vue';
const manufacturers = ref(''); // 제조사 목록
const productList = ref([]);
const selectedManufacturer = ref(''); // 선택된 제조사
const selectedProduct = ref(''); // 선택된 제품
const searchStDate = ref(''); // 선택된 날짜
// 제조사 목록을 가져오는 함수
const fetchManufacturers = async () => {
    try {
        const response = await axios.post(
            '/api/business/sales-plan/getmanufacturer.do'
        );
        manufacturers.value = response.data.manuFacturerList;
        console.log(manufacturers.value);
    } catch (error) {
        console.error('Error fetching manufacturers:', error);
    }
};

// 제조사 선택 시 해당 제조사에 맞는 제품 목록을 가져오는 함수
const fetchProductsByManufacturer = async () => {
    if (selectedManufacturer.value) {
        try {
            const param = new URLSearchParams({
                industry_code: selectedManufacturer.value,
            });

            const response = await axios.post(
                '/api/business/sales-plan/getProductList.do',
                param
            );
            productList.value = response.data.productList; // 제품 목록 설정
            console.log(productList.value);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }
};

const handlerSearch = () => {
    // 예시로 조회 시 콘솔 로그 출력
    console.log('조회:', {
        selectedProduct: selectedProduct.value,
        selectedManufacturer: selectedManufacturer.value,
        searchStDate: searchStDate.value,
    });
};

// 컴포넌트가 마운트될 때 제조사 목록을 가져오기
onMounted(() => {
    fetchManufacturers();
});
</script>

<template>
    <div class="search-box">
        <!-- <SalesPlanMain
            v-if="selectedProduct && selectedManufacturer"
            :productId="selectedProduct"
            :industryCode="selectedManufacturer"
            :searchDate="searchStDate"
        /> -->
        <!-- 제조사 셀렉트 박스 -->
        <select
            v-model="selectedManufacturer"
            @change="fetchProductsByManufacturer"
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
