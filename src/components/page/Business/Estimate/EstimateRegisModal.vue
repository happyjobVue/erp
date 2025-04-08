<script setup>
import { onMounted } from 'vue';
import {
    fetchClient,
    fetchManufacturers,
    fetchProductsByManufacturer,
} from '../../../../common/selectBoxApi';

const clients = ref(''); // 고객 목록
const manufacturer = ref(''); //제조사 목록
const productList = ref([]); //제품 목록
const selectedClient = ref('');
const estimateDate = ref('');
const selectedSalesArea = ref('');
const selectedManufacturer = ref(''); // 선택된 제조사
const selectedProduct = ref(''); // 선택된 제품
const qunti = ref(''); // 수량 저장

const clientId = ref('2'); // 예시로 설정된 clientId
const estimateDeliveryDate = ref('2025-04-10');
const estimateSalesArea = ref('영업');

// const estimateList = ref([
//     {
//         manufacturerId: 0,
//         majorCategoryId: "MF001",
//         subCategoryId: "MF00103",
//         productId: 2,
//         unitPrice: "5000",
//         quantity: "10",
//         supplyPrice: "50000"
//     },
//     {
//         manufacturerId: 1,
//         majorCategoryId: "MF002",
//         subCategoryId: "MF00203",
//         productId: 7,
//         unitPrice: "1000",
//         quantity: "10",
//         supplyPrice: "100"
//     }
// ]);

// {"clientId":"0","estimateDeliveryDate":"2025-04-10","estimateSalesArea":"SCM","estimateList":[{"manufacturerId":0,"majorCategoryId":"MF001","subCategoryId":"MF00102","productId":1,"unitPrice":"80000","quantity":"10","supplyPrice":"800000"},{"manufacturerId":0,"majorCategoryId":"MF001","subCategoryId":"MF00102","productId":1,"unitPrice":"80000","quantity":"10","supplyPrice":"800000"}]}

const saveEstimate = async () => {
    const param = {
        clientId: clientId.value,
        estimateDeliveryDate: estimateDeliveryDate.value,
        estimateSalesArea: estimateSalesArea.value,
        estimateList: estimateList.value,
    };

    try {
        const response = await axios.post('/api/business/estimate-save', param);
        console.log(response.data); // 서버 응답 확인
    } catch (error) {
        console.error('저장 실패:', error);
    }
};

onMounted(async () => {
    manufacturer.value = await fetchManufacturers();
    clients.value = await fetchClient();
});

// 제품 선택 이벤트 핸들러

async function handleManufacturerChange() {
    if (selectedManufacturer.value) {
        productList.value = await fetchProductsByManufacturer(
            selectedManufacturer.value
        );
    }
}
</script>

<template>
    <teleport to="body">
        <div class="backdrop">
            <div class="container">
                <h2>견적서 작성</h2>
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
                    <input type="date" v-model="estimateDate" />
                    <label for="">영역구분 </label>
                    <select v-model="selectedSalesArea">
                        <option value="" disabled>전체</option>
                        <option value="SCM">SCM</option>
                        <option value="영업">영업</option>
                    </select>
                </div>
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
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>

                <table>
                    <tr>
                        <th>제조업체</th>
                        <td>
                            <select
                                v-model="selectedManufacturer"
                                @change="handleManufacturerChange"
                            >
                                <option value="" disabled>제조사</option>
                                <option
                                    v-for="manufacturer in manufacturer"
                                    :key="manufacturer.manufacturer_id"
                                    :value="manufacturer.industryCode"
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
                        <td><input type="text" v-model="qunti" /></td>
                        <th>총액</th>
                        <td>
                            <input
                                type="text"
                                :value="qunti * selectedProduct.unit_price"
                                disabled
                            />
                        </td>
                        <th></th>
                        <td></td>
                    </tr>
                </table>
                <button>추가</button>

                <div class="button-box">
                    <button>등록</button>
                    <button>전체 삭제</button>
                    <button type="button" @click="modalState.setModalState()">
                        취소
                    </button>
                </div>
            </div>
        </div>
    </teleport>
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
