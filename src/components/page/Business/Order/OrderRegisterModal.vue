<script setup>
import { onMounted, ref } from 'vue';
import {
    fetchClient,
    fetchManufacturers,
    fetchProductsByManufacturer,
} from '../../../../common/selectBoxApi';
import { useModalStore } from '../../../../stores/modalState';
import axios from 'axios';
const modalState = useModalStore();
const clients = ref(''); // 고객 목록
const manufacturers = ref(''); //제조사 목록
const productList = ref([]); //제품 목록
const selectedClient = ref('');
const selectedManufacturer = ref(''); // 선택된 제조사
const selectedProduct = ref(''); // 선택된 제품
const quantity = ref(''); // 수량 저장
const supplyPrice = ref(0); // 총 금액
const modalType = ref('');
const cPage = ref(1);

// 수주 저장

const orderDeliveryDate = ref('');
const orderSalesArea = ref('');
const orderList = ref([]);

//미수주 견적서 조회
const orderEstimateList = ref('');
const orderEstimateCnt = ref('');

const emit = defineEmits(['modalClose', 'postSuccess']);

onMounted(async () => {
    manufacturers.value = await fetchManufacturers();
    clients.value = await fetchClient();
    getOrderEstimateList();
});

const getOrderEstimateList = () => {
    const param = {
        currentPage: cPage.value,
        pageSize: 5,
    };
    axios.post('/api/business/orderEstimateListBody', param).then(res => {
        orderEstimateList.value = res.data.orderEstimateList;
        orderEstimateCnt.value = res.data.orderEstimateCnt;
    });
};

// 추가 버튼 클릭 시
const addOrderItem = () => {
    console.log('추가 버튼 클릭 후 ');
    // 새로운 항목을 estimateList 배열에 추가
    orderList.value.push({
        manufacturerId: selectedManufacturer.value.manufacturerId,
        majorCategoryId: selectedProduct.value.industry_code,
        subCategoryId: selectedProduct.value.product_code,
        productId: selectedProduct.value.id,
        unitPrice: selectedProduct.value.unit_price,
        quantity: quantity.value,
        supplyPrice: supplyPrice.value, // 공급가액 포함
        // 데이터 출력을 위한 것
        productName: selectedProduct.value.name,
        industryName: selectedManufacturer.value.industryName,
    });

    (selectedManufacturer.value = ''),
        (selectedProduct.value = ''),
        (quantity.value = ''),
        (supplyPrice.value = '');
};

// 제품 선택 이벤트 핸들러

// async function handleManufacturerChange() {
//     if (selectedManufacturer.value) {
//         productList.value = await fetchProductsByManufacturer(
//             selectedManufacturer.value.industryCode
//         );
//     }
// }

const closeModal = () => {
    modalState.setModalState();
};

//  총액 = 제품 단가 * 수량
const calculateSupplyPrice = () => {
    supplyPrice.value = quantity.value * selectedProduct.value.unit_price;
};

// {"estimateId":"58","clientId":"37","orderDeliveryDate":"2025-04-10","orderSalesArea":"SCM","orderList":[{"productId":1,"unitPrice":"80000","quantity":"10","supplyPrice":"800000"},{"productId":1,"unitPrice":"80000","quantity":"10","supplyPrice":"800000"}]}
</script>

<template>
    <div>
        <teleport to="body">
            <div class="backdrop">
                <div class="container">
                    <h2>수주 작성</h2>
                    <div class="search-box">
                        <label for="">거래처 </label>
                        <select v-model="selectedClient">
                            <option value="" disabled>전체</option>
                            <option
                                v-for="client in clients"
                                :key="client.id"
                                :value="client.id"
                            >
                                {{ client.client_name }}
                            </option>
                        </select>
                        <label for="">납기일 </label>
                        <input type="date" v-model="orderDeliveryDate" />
                        <label for="">영역구분 </label>
                        <select v-model="orderSalesArea">
                            <option value="" disabled>전체</option>
                            <option value="SCM">SCM</option>
                            <option value="영업">영업</option>
                        </select>
                    </div>
                    <table>
                        <tr>
                            <th>견적일</th>
                            <th>거래처</th>
                            <th>제품명</th>
                            <th>제품단가</th>
                            <th>수량</th>
                            <th>공급가액</th>
                            <th>등록</th>
                        </tr>
                        <template v-if="orderEstimateList">
                            <template v-if="orderEstimateCnt > 0">
                                <tr
                                    v-for="orderEsti in orderEstimateList"
                                    :key="orderEsti.id"
                                >
                                    <td>{{ orderEsti.estimateDate }}</td>
                                    <td>{{ orderEsti.clientName }}</td>
                                    <td>{{ orderEsti.productName }}</td>
                                    <td>{{ orderEsti.estimateDate }}</td>
                                    <td>{{ orderEsti.estimateDate }}</td>
                                    <td>{{ orderEsti.estimateDate }}</td>
                                    <td><button>등록</button></td>
                                </tr>
                            </template>
                            <template v-else>
                                <tr>
                                    <td colspan="7">
                                        일치하는 검색 결과가 없습니다
                                    </td>
                                </tr>
                            </template>
                        </template>
                        <!-- <tr>
                            <th>제조업체</th>
                            <td>
                                <select
                                    v-model="selectedManufacturer"
                                    @change="handleManufacturerChange"
                                >
                                    <option value="" disabled>제조사</option>
                                    <option
                                        v-for="manufacturer in manufacturers"
                                        :key="manufacturer.manufacturer_id"
                                        :value="manufacturer"
                                    >
                                        {{ manufacturer.industryName }}
                                    </option>
                                </select>
                            </td>
                            <th>제품</th>
                            <td>
                                <select v-model="selectedProduct">
                                    <option value="" disabled>제품</option>
                                    <option
                                        v-for="product in productList"
                                        :key="product.id"
                                        :value="product"
                                    >
                                        {{ product.name }}
                                    </option>
                                </select>
                            </td>
                            <th>제품 단가</th>
                            <td>
                                <input
                                    type="text"
                                    v-model="selectedProduct.unit_price"
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>수량</th>
                            <td>
                                <input
                                    type="text"
                                    v-model="quantity"
                                    @input="calculateSupplyPrice"
                                />
                            </td>
                            <th>총액</th>
                            <td>
                                <input
                                    type="text"
                                    v-model="supplyPrice"
                                    disabled
                                />
                            </td>
                            <th></th>
                            <td></td>
                        </tr> -->
                    </table>

                    <button @click="addEstimateItem">추가</button>
                    <table>
                        <tbody>
                            <input type="text" hidden />

                            <tr>
                                <th class="table-header">제조업체</th>
                                <th class="table-header">제품명</th>
                                <th class="table-header">제품단가</th>
                                <th class="table-header">수량</th>
                                <th class="table-header">공급가액</th>
                                <th class="table-header">삭제</th>
                            </tr>
                            <tr
                                v-for="(item, index) in estimateList"
                                :key="index"
                            >
                                <td>{{ item.industryName }}</td>
                                <td>{{ item.productName }}</td>
                                <td>{{ item.unitPrice }}</td>
                                <td>{{ item.quantity }}</td>
                                <td>{{ item.supplyPrice }}</td>
                                <td>
                                    <button @click="orderList.splice(index, 1)">
                                        삭제
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="button-box">
                        <button @click="saveOrder()">등록</button>
                        <button>전체 삭제</button>
                        <button type="button" @click="closeModal()">
                            취소
                        </button>
                    </div>
                </div>
            </div>
        </teleport>
    </div>
</template>

<style lang="scss" scoped>
.search-box {
    margin-bottom: 10px;
    display: block;
}

.search-select {
    width: 90%;
    padding: 8px;
    margin-top: 5px;
    margin-bottom: 10px;
    border-radius: 4px;
    border: 1px solid #ccc;
}

.backdrop {
    top: 0%;
    left: 0%;
    width: 100%;
    height: 100%;
    position: fixed;
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
}

.container {
    background: white;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
    width: 1000px;
    font-size: 14px;
}

h2 {
    font-size: 24px;
    margin-bottom: 20px;
    font-weight: bold;
    text-align: center;
    background-color: #f0f0f0; /* 회색 배경 */
    padding: 10px 0; /* 여백 추가 */
    border-bottom: 2px solid #ccc; /* 제목 아래 선 추가 */
}

table {
    width: 100%;
    border-spacing: 0;
    margin-bottom: 20px;
}

th.table-header {
    background-color: #f0f0f0;
    padding: 12px 15px;
    font-weight: bold;
    border-right: 2px solid #ccc; /* 선 추가 */
    text-align: left;
    width: 150px;
}

td {
    padding: 12px 15px;
}

button {
    background-color: #3bb2ea;
    border: none;
    color: white;
    padding: 10px 22px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 10px 0;
    cursor: pointer;
    border-radius: 12px;
    box-shadow: 0 4px #999;
    transition: 0.3s;
    width: 30px;
}

button:hover {
    background-color: #45a049;
}

button:active {
    background-color: #3e8e41;
    box-shadow: 0 2px #666;
    transform: translateY(2px);
}

.button-box {
    display: flex;
    text-align: center;
    justify-content: space-between;
    margin-top: 20px;
    width: 300px;
}

.button-box button {
    width: 48%;
}

input[type='text']:focus,
input[type='date']:focus,
select:focus {
    border-color: #3bb2ea;
    outline: none;
}
select {
    width: 90%;
    padding: 8px;
    margin-top: 5px;
    margin-bottom: 10px;
    border-radius: 4px;
    border: 1px solid #ccc;
}

input {
    padding: 8px;
    margin-top: 5px;
    margin-bottom: 5px;
    margin-right: 5px;
    border-radius: 4px;
    border: 1px solid #ccc;
}
</style>
