<script setup>
import { onMounted, ref } from 'vue';
import { useModalStore } from '../../../../stores/modalState';
import { useUserInfo } from '../../../../stores/userInfo';
import {
    fetchClient,
    fetchManufacturers,
    fetchProductsByManufacturer,
} from '../../../../common/selectBoxApi';
import axios from 'axios';



// 사용자 정보 가져오기
const userId = useUserInfo();
// modal
const modalState = useModalStore();
// 제조사 목록
const manufacturers = ref('');
// 선택한 제조사
const selectedManufacturer = ref('');
// 선택한 상품
const selectedProduct = ref();
// 상품 목록
const productList = ref([]);
// 거래처 목록
const clients = ref('');


// 선택한 제조사 id 와 제조사 코드 - (manufacturer_id, industry_code)
const selectedManufactureId = ref('');
const selectedIndutryCode = ref('');
// 선택한 상품 코드와 상품 이름 - (product_code, product_name)
const selectedProductCode = ref('');
const selectedProductName = ref('');

// 목표 날짜
const targetDate = ref(''); // 선택된 날짜
// 선택한 거래처 코드와 이름 - (client_code, client_name)
const SelectedClient = ref(''); // 거래처 객체를 직접 저장
//목표
const goalQuanti = ref(0); // 목표 수량
//메모 
const memo = ref('');



onMounted(async () => {
    manufacturers.value = await fetchManufacturers();
    clients.value = await fetchClient();
});



// 제조사 선택 이벤트 핸들러
// 제조사 코드와 ID를 저장 필요 -> 테이블 연결되어 있지 않아 데이터 유효성을 위한 처리 
async function handleManufacturerChange() {
    selectedManufactureId.value = selectedManufacturer.value.manufacturer_id;
    selectedIndutryCode.value = selectedManufacturer.value.industryCode;
    if (selectedManufacturer.value.industryCode) {
        productList.value = await fetchProductsByManufacturer(
            selectedManufacturer.value.industryCode
        );
    }
}

// 상품 선택 이벤트 핸들러
// 선택한 상품 코드와 이름을 저장해야하나, 디비에 테이블이 연결되어 있지 않아 강제로 연결 필요
function handleProductChange() {
    if (selectedProduct.value) {
        selectedProductCode.value = selectedProduct.value.product_code;
        selectedProductName.value = selectedProduct.value.name;
    }
}

const saveSalesPlan = () => {
    const salesPlan = {
        emp_id: userId.user.empId,
        client_id:SelectedClient.value,
        manufacturer_id:selectedManufactureId.value,
        industry_code:selectedIndutryCode.value,
        target_date:targetDate.value,
        goal_quanti:goalQuanti.value,
        perform_qut:0,
        detail_code:selectedProductCode.value,
        product_name:selectedProductName.value,
        plan_memo:memo.value
    }; // salesPlan 객체 생성

        axios.post('/api/business/sales-plan/insertPlan.do',salesPlan).then(res=>{
           console.log("저장로직");
            if(res.data.result ==='sucess'){
                alert("저장되었습니다.");
            }
        })

    };

    const closeModal =() =>{
    modalState.setModalState();
}


</script>

<template>
    <teleport to="body">
        <div class="backdrop">
            <div class="container">
                <h2>영업 계획 등록</h2>
          
                <table>
                    <tbody>
                        <input type="text" hidden v-model="userId.user.empId" />

                        <tr>
                            <th class="table-header">사원</th>
                            <td>
                                <input type="text" v-model="userId.user.userNm" />
                            </td>
                            <th class="table-header">목표 일자</th>
                            <td>
                                <input type="date" v-model="targetDate" />
                            </td>
                        </tr>
                        <tr>
                            <th class="table-header">제조사</th>
                            <td>
                                <select
                                    v-model="selectedManufacturer"
                                    @change="handleManufacturerChange"
                                >
                                    <option disabled value="">전체</option>
                                    <option
                                        v-for="manufacturer in manufacturers"
                                        :key="manufacturer.manufacturer_id"
                                        :value="manufacturer"
                                    >
                                        {{ manufacturer.industryName }}
                                    </option>
                                </select>
                            </td>
                            <th class="table-header">상품명</th>
                            <td>
                                <select v-model="selectedProduct" @change="handleProductChange">
                                    <option value="" disabled>전체</option>
                                    <option
                                        v-for="product in productList"
                                        :key="product.id"
                                        :value="product"
                                    >
                                        {{ product.name }}
                                    </option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th class="table-header">거래처</th>
                            <td>
                                <select v-model="SelectedClient" >
                                    <option value="" disabled>전체</option>
                                    <option v-for="client in clients" :key="client.id" :value="client.id">
                                        {{ client.client_name }}
                                    </option>
                                </select>
                            </td>
                            <th class="table-header">목표 수량</th>
                            <td><input type="text"  v-model="goalQuanti"/></td>
                        </tr>
                        <tr>
                            <th class="table-header">메모</th>
                            <td><input type="text" v-model="memo"/></td>
                        </tr>
                    </tbody>
                </table>
               

                <div class="button-box">
                    <button @click="saveSalesPlan">등록</button>
                    <button type="button" @click="closeModal">취소</button>
                </div>
            </div>
        </div>
    </teleport>
</template>

<style lang="scss" scoped>
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

input[type='text'],
input[type='date'],
select {
    width: 90%;
    padding: 10px;
    margin-top: 5px;
    margin-bottom: 10px;
    border-radius: 4px;
    border: 1px solid #ccc;
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
</style>
