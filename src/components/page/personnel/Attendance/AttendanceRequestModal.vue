<script setup>
import { onMounted, ref } from 'vue';
import { useUserInfo } from '../../../../stores/userInfo';
import axios from 'axios';

const visible = ref(true);
const emit = defineEmits(['visibleval']);

const userInfo = useUserInfo();
const attendanceDetail = ref({});

const form = ref({
  deptName: '', // lgnInfo.detail_name
  empName: '',  // lgnInfo.usr_nm
  number: '',   // lgnInfo.usr_idx
  reqType: '연차',
  reqSt: '',
  reqEd: '',
  reqReason: '',
  reqTel: '',
  reqdate: new Date().toISOString().split('T')[0]
});

const submitForm = () => {
  console.log('신청 정보:', form.value);
  // axios.post(...) 등으로 전송
};

const closeModal = () => {
  visible.value = false;
  emit('visibleval', visible.value);
};

const UserDetail = () => {
    const form = new URLSearchParams();

    form.append('id', userInfo.user.empId);

    axios
        .post(`/api/personnel/attendanceDetail.do`,form)
        .then(res => {
            console.log(res.data);
            attendanceDetail.value = res.data;
        })
        .catch(err => {
            console.error('에러 발생:', err);
        });

}

onMounted(() => {
    UserDetail();
})
</script>

<template>
   <div class="modal-overlay" v-if="visible">
    <div id="attendanceRequestModal" class="layerPop layerType2" style="width: 600px;">
      <dl style="margin-top: 0;">
        <dt>
          <strong>연차 신청</strong>
        </dt>
        <dd class="content">
          <table class="row">
            <tbody>
              <tr>
                <th scope="row">근무부서</th>
                <td colspan="3">
                  <input type="text" class="inputTxt p100" v-model="form.deptName" readonly />
                </td>
              </tr>
              <tr>
                <th scope="row">성명</th>
                <td>
                  <input type="text" class="inputTxt p100" v-model="form.empName" readonly />
                </td>
              </tr>
              <tr>
                <th scope="row">사번</th>
                <td colspan="3">
                  <input type="text" class="inputTxt p100" v-model="form.number" readonly />
                </td>
              </tr>
              <tr>
                <th scope="row">연/반차<span class="font_red">*</span></th>
                <td colspan="3">
                  <select v-model="form.reqType">
                    <option value="연차">연차</option>
                    <option value="반차">반차</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th scope="row">기간<span class="font_red">*</span></th>
                <td colspan="3">
                  <input type="date" v-model="form.reqSt" style="height: 30px; width: 120px;" />
                  ~
                  <input type="date" v-model="form.reqEd" style="height: 30px; width: 120px;" />
                </td>
              </tr>
              <tr>
                <th scope="row">신청사유<span class="font_red">*</span></th>
                <td colspan="3">
                  <textarea class="inputTxt p100" v-model="form.reqReason"></textarea>
                </td>
              </tr>
              <tr>
                <th scope="row">비상연락처<span class="font_red">*</span></th>
                <td colspan="3">
                  <input type="tel" class="inputTxt p100" v-model="form.reqTel" placeholder="010-0000-0000" />
                </td>
              </tr>
              <tr>
                <th scope="row">신청일</th>
                <td colspan="3">
                  <input type="text" class="inputTxt p100" v-model="form.reqdate" disabled />
                </td>
              </tr>
            </tbody>
          </table>
  
          <div class="btn_areaC mt30">
            <a href="#" class="btnType blue" @click.prevent="submitForm"><span>연차 신청</span></a>
            <a href="#" class="btnType gray" @click.prevent="closeModal"><span>닫기</span></a>
          </div>
        </dd>
      </dl>
      <a href="#" class="closePop" @click.prevent="closeModal"><span class="hidden">닫기</span></a>
    </div>
   </div> 
  </template>

<style scoped>
/* 모달 배경 오버레이는 별도 div에서 감쌀 경우 추가 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

/* 모달 본체 */
#attendanceRequestModal.layerPop.layerType2 {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  font-family: 'Segoe UI', sans-serif;
}

/* 제목 영역 */
#attendanceRequestModal dl > dt {
  background-color: #2f3651;
  color: white;
  padding: 14px 20px;
  font-size: 16px;
  font-weight: bold;
  position: relative;
}

/* 닫기 버튼 (오른쪽 상단) */
.closePop {
  position: absolute;
  top: 12px;
  right: 14px;
  font-size: 20px;
  color: white;
  text-decoration: none;
  cursor: pointer;
}

/* 숨김 텍스트 */
.closePop .hidden {
  display: none;
}

/* 콘텐츠 영역 */
#attendanceRequestModal .content {
  padding: 20px;
  background-color: #f9f9f9;
}

/* 테이블 기본 */
#attendanceRequestModal table.row {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  background: white;
}

#attendanceRequestModal th {
  width: 120px;
  text-align: left;
  background-color: #f0f0f5;
  padding: 10px;
  color: #333;
  vertical-align: top;
}

#attendanceRequestModal td {
  padding: 10px;
}

.inputTxt.p100,
select,
textarea {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

textarea {
  resize: vertical;
  min-height: 80px;
}

.font_red {
  color: red;
  margin-left: 4px;
}

/* 버튼 영역 */
.btn_areaC {
  text-align: center;
  margin-top: 30px;
}

.btnType {
  display: inline-block;
  padding: 10px 25px;
  border-radius: 4px;
  font-weight: bold;
  text-decoration: none;
  color: white;
  margin: 0 5px;
}

.btnType.blue {
  background: linear-gradient(to bottom, #4b91f1 0%, #357ae8 100%);
}

.btnType.blue:hover {
  background: linear-gradient(to bottom, #357ae8 0%, #2a65c5 100%);
}

.btnType.gray {
  background: linear-gradient(to bottom, #bfc9d6 0%, #8e9eab 100%);
}

.btnType.gray:hover {
  background: linear-gradient(to bottom, #9daab9 0%, #6c7a89 100%);
}

</style>
