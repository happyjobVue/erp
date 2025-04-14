<script setup>
import { defineProps, onMounted, onUnmounted, ref } from 'vue';
import { useModalStore } from '../../../../stores/modalState';
import axios from 'axios';
const modalState = useModalStore();
const postcode = ref('');
const roadAddress = ref('');
const isScriptLoaded = ref(false); // 스크립트 로딩 상태를 추적하는 변수
const emit = defineEmits(['modalClose', 'postSuccess']);
const props = defineProps({
    client: {
        type: Object,
        required: true,
    },
});

// 다음 우편번호 스크립트 로드
const loadDaumPostcodeScript = () => {
    const script = document.createElement('script');
    script.src =
        '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.onload = () => {
        isScriptLoaded.value = true; // 스크립트가 로드되면 isScriptLoaded를 true로 설정
    };
    document.head.appendChild(script);
};

onMounted(() => {
    loadDaumPostcodeScript();
});

const execDaumPostcode = () => {
    if (isScriptLoaded.value && window.daum && window.daum.Postcode) {
        new daum.Postcode({
            oncomplete: data => {
                props.client.zip = data.zonecode;
                props.client.addr = data.address;
            },
        }).open();
    } else {
        console.error('Daum Postcode 스크립트가 로드되지 않았습니다.');
    }
};

const editClient = () => {
    const param = {
        ISBN: '', // ISBN이 비어있는 경우
        addr: props.client.addr, // 주소
        bank: props.client.bank, // 은행
        bank_account: props.client.bank_account, // 계좌번호
        biz_num: props.client.biz_num, // 사업자 번호
        client_name: props.client.client_name, // 거래처 이름
        detail_addr: props.client.detail_addr, // 상세 주소
        email: props.client.email, // 이메일
        memo: props.client.memo, // 메모
        person: props.client.person, // 담당자
        person_ph: props.client.person_ph, // 담당자 연락처
        ph: props.client.ph, // 회사 연락처
        zip: props.client.zip, // 우편번호
        id: props.client.id,
    };

    axios
        .post(`/api/business/client-list/updateClientListBody.do`, param)
        .then(() => {
            alert('거래처 내역이 수정되었습니다.');
            emit('postSuccess');
            closeModal();
        });
};

onMounted(() => {
    console.log('디테일 컴포넌트 마운트 됨 ');
    if (props.client) {
        console.log('props' + props.client.client_name);
    }
});
</script>

<template>
    <div>
        <teleport to="body">
            <div class="backdrop">
                <div class="container">
                    <h2>거래처 상세</h2>
                    <table>
                        <tbody>
                            <!-- 사원 -->
                            <tr>
                                <th class="table-header">거래처</th>
                                <td>
                                    <input
                                        type="text"
                                        v-model="props.client.client_name"
                                    />
                                </td>
                                <th class="table-header">회사 연락처</th>
                                <td>
                                    <input
                                        type="text"
                                        v-model="props.client.ph"
                                    />
                                </td>
                            </tr>

                            <!-- 제조사 -->
                            <tr>
                                <th class="table-header">담당자</th>
                                <td>
                                    <input
                                        type="text"
                                        v-model="props.client.person"
                                    />
                                </td>
                                <th class="table-header">담당자 연락처</th>
                                <td>
                                    <input
                                        type="text"
                                        v-model="props.client.person_ph"
                                    />
                                </td>
                            </tr>

                            <!-- 거래처 -->
                            <tr>
                                <th class="table-header">우편번호</th>
                                <td>
                                    <div class="postcode-group">
                                        <input
                                            class="post-code"
                                            type="text"
                                            v-model="props.client.zip"
                                        />
                                        <button
                                            @click="execDaumPostcode"
                                            :disabled="!isScriptLoaded"
                                        >
                                            우편번호
                                        </button>
                                    </div>
                                </td>
                                <th class="table-header">주소</th>
                                <td>
                                    <input
                                        type="text"
                                        v-model="props.client.addr"
                                    />
                                </td>
                            </tr>

                            <!-- 메모 -->
                            <tr>
                                <th class="table-header">상세주소</th>
                                <td>
                                    <input
                                        type="text"
                                        v-model="props.client.detail_addr"
                                    />
                                </td>
                                <th class="table-header">사업자 번호</th>
                                <td>
                                    <input
                                        type="text"
                                        v-model="props.client.biz_num"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th class="table-header">은행</th>
                                <td>
                                    <!-- <input
                                        type="text"
                                        v-model="props.client.bank"
                                    /> -->
                                    <select v-model="props.client.bank">
                                        <option value="" disabled>전체</option>
                                        <option value="신한은행">
                                            신한은행
                                        </option>
                                        <option value="하나은행">
                                            하나은행
                                        </option>
                                        <option value="우리은행">
                                            우리은행
                                        </option>
                                        <option value="기타은행">
                                            기타은행
                                        </option>
                                    </select>
                                </td>
                                <th class="table-header">메모</th>
                                <td>
                                    <input
                                        type="text"
                                        v-model="props.client.memo"
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="button-container">
                        <button @click="editClient()">수정</button>
                        <button
                            type="button"
                            @click="modalState.setModalState()"
                        >
                            취소
                        </button>
                    </div>
                </div>
            </div>
        </teleport>
    </div>
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

.postcode-group {
    display: flex;
    align-items: center;
    gap: 10px;

    .post-code {
        flex: 1;
        width: auto; // 필요시 너비 자동 조정
    }

    button {
        flex-shrink: 0; // 버튼 크기 줄어들지 않도록
    }
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
    width: 120px;
    margin: 4px 2px;
}

button:hover {
    background-color: #45a049;
}

button:active {
    background-color: #3e8e41;
    box-shadow: 0 2px #666;
    transform: translateY(2px);
}

.button-box button {
    width: 48%;
}

/* 버튼을 오른쪽 정렬하기 위한 스타일 */
.button-container {
    display: flex;
    justify-content: flex-end; /* 오른쪽 정렬 */
    margin-bottom: 20px;
}

input[type='text']:focus,
input[type='date']:focus,
select:focus {
    border-color: #3bb2ea;
    outline: none;
}
</style>
