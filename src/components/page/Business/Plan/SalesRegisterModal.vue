<script setup>
import { onMounted } from 'vue';
import { useModalStore } from '../../../../stores/modalState';
import { useUserInfo } from '../../../../stores/userInfo';
import {
    fetchManufacturers,
    fetchProductsByManufacturer,
} from '../../../../common/selectBoxApi';

const modalState = useModalStore();
const manufacturers = ref('');
const selectedManufacturer = ref('');
const selectedProduct = ref();
const userId = useUserInfo();
const productList = ref([]);

onMounted(async () => {
    manufacturers.value = await fetchManufacturers();
});

async function handleManufacturerChange() {
    if (selectedManufacturer.value) {
        productList.value = await fetchProductsByManufacturer(
            selectedManufacturer.value
        );
    }
}

const clearForm = () => {};
</script>

<template>
    <teleport to="body">
        <div class="backdrop">
            <div class="container">
                <h2>영업 계획</h2>

                <table>
                    <tbody>
                        <tr>
                            <th class="table-header">사원번호(emp_id)</th>
                            <td>
                                <input
                                    type="text"
                                    v-model="userId.user.empId"
                                />
                            </td>
                            <th class="table-header">사원</th>
                            <td>
                                <input
                                    type="text"
                                    v-model="userId.user.userNm"
                                />
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
                                        :value="manufacturer.industryCode"
                                    >
                                        {{ manufacturer.industryName }}
                                    </option>
                                </select>
                            </td>
                            <th class="table-header">상품명</th>
                            <td>
                                <select v-model="selectedProduct">
                                    <option value="" disabled>전체</option>
                                    <option
                                        v-for="product in productList"
                                        :key="product.id"
                                        :value="product.id"
                                    >
                                        {{ product.name }}
                                    </option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th class="table-header">거래처</th>

                            <td><select name="" id=""></select></td>
                            <th class="table-header">goal_quanti</th>
                            <td><input type="text" /></td>
                        </tr>
                    </tbody>
                </table>
                <div class="button-box">
                    <button type="submit">등록</button>
                    <button type="button" @click="clearForm">취소</button>
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
