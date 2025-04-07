<script setup>
import { ref, onMounted, watch } from 'vue';

const address = ref("");
const addressCode = ref('');
const emit = defineEmits(['closeModal']);
const props = defineProps(['modalType','UserDetail']);

//사원 등록 
const employeeName = ref('');
const registrationNumber = ref('');
const sex = ref('');
const birthday = ref('');
const finalEducation = ref('');
const email = ref('');
const hp = ref(0);
const addressDetail = ref('');
const bank = ref('');
const bankAccount = ref('');
const departmentDetailName = ref('');
const jobGradeDetailName = ref('');
const jobRoleDetailName = ref('');
const regDate = ref('');
const emplStatus = ref('');




//퇴직이유
const resignationReason = ref('');
//퇴직 날짜
const resignationDate = ref('');
//퇴직금
const severancePay = ref(0);
//연봉
const salary = ref(0);
const NowemployeeId = ref('');
const NowregDate = new Date();

//연봉 계산기 계산하기
const Onsalary = () => {

    const currentDatae = new Date();

    //현재 일짜 
    currentDatae.value = new Date().toISOString().slice(0, 10);

    const anIncome = currentDatae.getFullYear() - NowregDate.getFullYear();

    switch (anIncome) {
  case 1:
    salary.value = 30000000;
    break;
  case 2:
    salary.value = 35000000;
    break;
  case 3:
    salary.value = 40000000;
    break;
  case 4:
    salary.value = 45000000;
    break;
  case 5:
    salary.value = 50000000;
    break;
  default:
    console.log("1~5년 사이가 아닙니다.");
    break;

}
}

watch(
  () => props.UserDetail,
  (newVal) => {
    if (newVal && newVal.detail && newVal.detail.employeeId) {
      NowemployeeId.value = newVal.detail.employeeId;
      NowregDate.value = newVal.detail.regDate;

    }
  },
  { immediate: true } // 필요에 따라 사용, 없으면 값 바뀔 때만 감지
);

const OnRetire = () => {

    Onsalary();

    emit('update-retire-info', {
        resignationReason: resignationReason.value,
        resignationDate: resignationDate.value,
        severancePay: severancePay.value,
        salary: salary.value,
        employeeId: NowemployeeId.value
    })

}

const openDaumPostcode = () => {
  new window.daum.Postcode({
    oncomplete: function (data) {
      address.value = data.address; // 선택한 주소를 input에 적용
      addressCode.value = data.sigunguCode; 
    }
  }).open();
};

//modal 코드

const isModalOpen = ref(false);

const closeModal = () => {
  isModalOpen.value = false;
  emit('closeModal', isModalOpen.value);
 
};

// 카카오 API 스크립트 로드
onMounted(() => {
  const script = document.createElement("script");
  script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
  script.async = true;
  document.head.appendChild(script);
});

</script>
<template>
    <div v-if="modalType === 'register'">
        <div class="modal-overlay">
            <div class="modal-container">
                <div class="modal-header">
                <h2>사원 상세 정보</h2>
                <button class="modal-close" @click="closeModal">×</button>
                </div>
        
                <div class="modal-body">
                <!-- 1. 기본 정보 -->
                <table class="row">
                    <tbody>
                    <tr>
                        <td rowspan="2" colspan="2"><div id="preview"></div></td>
                        <th>사번</th>
                        <td colspan="3"><input type="text" class="inputTxt" id="number" placeholder="자동 입력됨" readonly /></td>
                        <th>이름 <span class="required">*</span></th>
                        <td colspan="3"><input type="text" class="inputTxt" id="employeeName" v-model="employeeName "/></td>
                    </tr>
                    <tr>
                        <th>주민번호 <span class="required">*</span></th>
                        <td colspan="3"><input type="text" class="inputTxt" id="registrationNumber" placeholder="숫자만 입력" @input="formatRegistrationNumber" 
                            v-model="registrationNumber"
                            /></td>
                        <th>성별 <span class="required">*</span></th>
                        <td colspan="3">
                        <label><input type="radio" name="sex" value="남자" v-model="sex"/> 남자</label>
                        <label><input type="radio" name="sex" value="여자" v-model="sex "/> 여자</label>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2"><input type="file" class="inputTxt" id="fileInput" /></td>
                        <th>생년월일 <span class="required">*</span></th>
                        <td colspan="3"><input type="date" class="inputTxt" id="birthday" v-model="birthday"/></td>
                        <th>최종학력 <span class="required">*</span></th>
                        <td colspan="3">
                        <select class="inputSelect" id="finalEducation" v-model="finalEducation">
                            <option value="">선택 필수</option>
                            <option value="초졸">초졸</option>
                            <option value="중졸">중졸</option>
                            <option value="고졸">고졸</option>
                            <option value="대졸">대졸</option>
                            <option value="석사">석사</option>
                            <option value="박사">박사</option>
                        </select>
                        </td>
                    </tr>
                    </tbody>
                </table>
        
                <!-- 2. 연락처 및 계좌 -->
                <table class="row">
                    <tbody>
                    <tr>
                        <th>이메일 <span class="required">*</span></th>
                        <td colspan="3"><input type="email" class="inputTxt" id="email" v-model="email" /></td>
                        <th>연락처 <span class="required">*</span></th>
                        <td colspan="3"><input type="text" class="inputTxt" id="hp" placeholder="숫자만 입력" @input="formatPhoneNumber" v-model="hp" /></td>
                    </tr>
                    <tr>
                        <th>우편번호 <span class="required">*</span></th>
                        <td colspan="2"><input type="text" class="inputTxt" id="zipCode" v-model="addressCode" /></td>
                        <td><button @click="openDaumPostcode" class="btnType blue" style="width:130px;height:28px;">우편번호 찾기</button></td>
                        <th rowspan="2">은행계좌 <span class="required">*</span></th>
                        <td colspan="3">
                        <select class="inputSelect" id="bank" v-model="bank">
                            <option value="">선택 필수</option>
                            <option value="기업">기업</option>
                            <option value="하나">하나</option>
                            <option value="농협">농협</option>
                            <option value="우리">우리</option>
                            <option value="신한">신한</option>
                            <option value="카카오뱅크">카카오뱅크</option>
                            <option value="국민">국민</option>
                            <option value="수협">수협</option>
                            <option value="케이뱅크">케이뱅크</option>
                            <option value="산업">산업</option>
                        </select>
                        </td>
                    </tr>
                    <tr>
                        <th rowspan="2">주소 <span class="required">*</span></th>
                        <td colspan="3"><input type="text" class="inputTxt" id="address" placeholder="주소" v-model="address" /></td>
                        <td colspan="3"><input type="text" class="inputTxt" id="bankAccount" placeholder="계좌번호" v-model="bankAccount"/></td>
                    </tr>
                    <tr>
                        <td colspan="6"><input type="text" class="inputTxt" id="addressDetail" placeholder="상세주소" v-model="addressDetail" /></td>
                    </tr>
                    </tbody>
                </table>
        
                <!-- 3. 부서 및 직무 -->
                <table class="row">
                    <tbody>
                    <tr>
                        <th>부서 <span class="required">*</span></th>
                        <td colspan="3">
                        <select class="inputSelect" id="departmentGroup" v-model="departmentDetailName ">
                            <option value="">전체</option>
                            <!-- v-for 로 대체 -->
                        </select>
                        </td>
                        <th>부서코드</th>
                        <td colspan="3"><input type="text" class="inputTxt" id="departmentCode" placeholder="자동 입력됨" readonly /></td>
                        <th>직무</th>
                        <td colspan="3">
                        <select class="inputSelect" id="jobRoleGroup" v-model="jobGradeDetailName ">
                            <option value="">-</option>
                        </select>
                        </td>
                    </tr>
                    <tr>
                        <th>직급 <span class="required">*</span></th>
                        <td colspan="3">
                        <select class="inputSelect" id="jobGradeGroup" v-model="jobRoleDetailName">
                            <option value="">전체</option>
                            <!-- v-for 로 대체 -->
                        </select>
                        </td>
                        <th>직급코드</th>
                        <td colspan="3"><input type="text" class="inputTxt" id="jobGradeCode" placeholder="자동 입력됨" readonly /></td>
                        <th>재직구분 <span class="required">*</span></th>
                        <td colspan="3">
                        <label><input type="radio" name="emplStatus" value="W" v-model="emplStatus"/> 재직</label>
                        <label><input type="radio" name="emplStatus" value="F" v-model="emplStatus"/> 퇴직</label>
                        <label><input type="radio" name="emplStatus" value="O" v-model="emplStatus"/> 휴직</label>
                        </td>
                    </tr>
                    <tr>
                        <th>입사일 <span class="required">*</span></th>
                        <td colspan="3"><input type="date" class="inputTxt" id="regDate" v-model="regDate"/></td>
                        <th>퇴직일</th>
                        <td colspan="3"><input type="date" class="inputTxt" id="resignationDate" readonly /></td>
                        <th>근무연차</th>
                        <td colspan="3"><input type="text" class="inputTxt" id="workingYear" placeholder="자동 입력됨" readonly /></td>
                    </tr>
                    <tr>
                        <th>연봉</th>
                        <td colspan="3">
                        <input type="text" class="inputTxt" id="salary" @input="formatSalary" placeholder="자동 입력됨" />
                        </td>
                        <th>퇴직금</th>
                        <td colspan="3"><input type="text" class="inputTxt" id="detailSeverancePay" placeholder="퇴직시 자동 입력됨" readonly /></td>
                        <th>비고</th>
                        <td colspan="3"><input type="text" class="inputTxt" id="empMemo" /></td>
                    </tr>
                    </tbody>
                </table>
                
                <!-- 버튼 영역 -->
                <div class="btn_areaC mt30">
                    <button class="btnType blue" @click="saveEmployee" v-if="modalType === 'register'" >등록</button>
                    <button class="btnType blue" @click="updateEmployee" v-else >수정</button>
                    <button class="btnType gray" @click="closeModal">취소</button>
                </div>
                </div>
            </div>
            </div>
    </div>


    <div v-if="modalType === 'retire'">
        <div class="modal-overlay">
            <div class="modal-container" style="width: 600px;">
            <dl>
                <dt style="display: flex; justify-content: space-between;">
                <strong style="margin-left: 10px;">퇴직처리</strong>
                
                <button class="closePop" @click="closeModal">
                    <span class="hidden">x</span>
                </button>
                </dt>
                <dd class="content" style="margin: 0; padding: 0;">
                <table class="row">
                    <tbody>
                    <tr>
                        <th scope="row">사번</th>
                        <td colspan="3">
                        <input type="text" class="inputTxt p100" readonly :value="UserDetail?.detail?.number || ''"/>
                        </td>
                        <th scope="row">이름</th>
                        <td colspan="3">
                        <input type="text" class="inputTxt p100" readonly :value="UserDetail?.detail?.employeeName || ''"/>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">입사일</th>
                        <td colspan="3">
                        <input type="date" class="inputTxt p100" readonly :value="UserDetail?.detail?.regDate || ''" />
                        </td>
                        <th scope="row">퇴직일<span class="font_red">*</span></th>
                        <td colspan="3">
                        <input type="date" class="inputTxt p100" v-model="resignationDate"/>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">퇴직사유<span class="font_red">*</span></th>
                        <td colspan="7">
                        <input type="text" class="inputTxt p100" v-model="resignationReason" />
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">퇴직금<span class="font_red">*</span></th>
                        <td colspan="7">
                        <input type="text" class="inputTxt p100" placeholder="숫자만 입력" v-model="severancePay "/>
                        </td>
                    </tr>
                    </tbody>
                </table>

                <div class="btn_areaC mt30">
                    <button class="btnType blue" @click="OnRetire">
                    <span>퇴직</span>
                    </button>
                </div>
                </dd>
            </dl>

            </div>
        </div>
    </div>

  </template>


<style scoped>

/* 등록창 css */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-container {
  background: #fff;
  width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
  padding: 20px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.required {
  color: red;
}

.inputTxt, .inputSelect {
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
}

.row {
  width: 100%;
  margin-top: 10px;
  border-collapse: collapse;
}

.row th, .row td {
  border: 1px solid #ccc;
  padding: 5px;
}

.btn_areaC {
  text-align: center;
  margin-top: 30px;
}

.btnType {
  display: inline-block;
  padding: 5px 15px;
  margin: 0 5px;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
}

.btnType.blue {
  background-color: #007bff;
  color: white;
}

.btnType.gray {
  background-color: #6c757d;
  color: white;
}

.closePop {
  border: none !important; 
  background-color: white !important;  /* 배경색 흰색 */
  color: black !important;          /* 글자색은 필요에 따라 설정 (흰 배경엔 검정 추천) */
  cursor: pointer !important;       /* 마우스 오버 시 포인터로 */
}
</style>