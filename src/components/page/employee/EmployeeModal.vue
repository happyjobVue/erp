<script setup>
import { ref, onMounted } from 'vue';

const address = ref("");
const addressCode = ref('');
const emit = defineEmits(['closeModal']);

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
  <!-- 모달 오버레이 -->
  <div class="modal-overlay" id="modalOverlay">
        <div class="modal">
            <!-- 모달 헤더 -->
            <div class="modal-header">
                <h2>사원 상세 정보</h2>
                <button class="close-btn"></button>
            </div>

            <!-- 모달 본문 -->
            <div class="modal-body">
                <!-- 프로필 이미지 -->
                 <div class="DetailImg">
                    <div class="profile" >
                        <img src="" alt="프로필">
                        <input type="file">
                    </div>

                    <div>
                        
                    </div class="totalDetail">
                    <!-- 상세정보  -->
                    <div class="Detailinfo">
                        <div>
                            <label>사번</label>
                            <input type="text">
                        </div>
                        <div>
                            <label>이름</label>
                            <input type="text">
                        </div>
                        <!-- 주민번호 / 성별 -->
                        <div>
                            <label>주민번호</label>
                            <input type="text">
                        </div>
                    </div>
                    <div class="SubDetailinfo">
                        <div class="checkSex" style="display: flex; align-items: center; margin-top: 8px;">
                            <label>성별</label>
                            <div style="display: flex; margin-left: 20px;">
                                <label style="width: 80px;">남자</label>
                                <input type="checkbox" style="margin-left: -10px;" />
                            </div>
                            <div style="display: flex;">
                                <label style="width: 80px; ">여자</label>
                                <input type="checkbox" style="margin-left: -10px;" />
                            </div>
                        </div>

                        <div style="margin-top: 10px;">
                            <label>생년월일</label>
                            <input type="date" />
                        </div>

                        <div>
                            <label>최종학력</label>
                            <select>
                                <option>대졸</option>
                                <option>고졸</option>
                            </select>
                        </div>
                    </div>
                 </div>
            </div>
            <div>
                                <!-- 이메일 / 연락처 -->
                <div>
                    <label>이메일</label>
                    <input type="email">
                </div>

                <div>
                    <label>우편번호</label>
                    <input type="text" v-model="addressCode" />
                    <input type="text" v-model="address" />
                    <button @click="openDaumPostcode">주소 찾기</button>
                </div>
                <div>
                    <label>상세 주소</label>
                    <input type="text">
                </div>

                <div>
                    <label>연락처</label>
                    <input type="text">
                </div>

                <div>
                    <label>은행계좌</label>
                    <select name="" id="">
                        <option value="">신한</option>
                        <option value="">국민</option>
                        <option value="">기업</option>
                    </select>
                    <input type="text">
                </div>



                <!-- 부서 / 직급 -->
                <div>
                    <label>부서</label>
                    <select>
                        <option>부서1</option>
                        <option>부서2</option>
                    </select>
                </div>
                <div>
                    <label>직급</label>
                    <select>
                        <option>직급1</option>
                        <option>직급2</option>
                    </select>
                </div>

                <!-- 입사일 / 연봉 -->
                <div>
                    <label>입사일</label>
                    <input type="date">
                </div>
                <div>
                    <label>연봉</label>
                    <input type="text">
                </div>
            </div>

            <!-- 모달 하단 버튼 -->
            <div class="modal-footer">
                <button class="btn btn-update">등록</button>
                <button class="btn btn-cancel" @click="closeModal">취소</button>
            </div>
        </div>
    </div>
</template>
<style>
/* 모달 배경 (반투명 검정) */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    display: flex; /* 중앙 정렬을 위한 flex */
    justify-content: center; /* 가로 중앙 정렬 */
    align-items: center; /* 세로 중앙 정렬 */
    z-index: 1000;
}

/* 모달 박스 */
.modal {
    background: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 700px;
    width: 90%;
    height: 550px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    position: relative;
}

/* 모달 헤더 */
.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
}

.modal-header h2 {
    font-size: 18px;
    margin: 0;
}

.close-btn {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
}

/* 입력 폼 */
.modal-body {
    display: grid;
    width: 1500px;
    height: 200px;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-top: 10px;
}

.modal-body label {
    font-weight: bold;
    display: block;
}

.modal-body input,
.modal-body select {
    width: 100%;
    padding: 6px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.DetailImg {
    display: flex;
}

/* 프로필 이미지 */
.profile {
    display: flex;
    flex-direction: column;
    align-items: left;
    gap: 10px;
    grid-column: span 2;

}

.profile input {
    width: 170px;
}

.profile img {
    width: 180px;
    height: 100px;
    border: 1px solid #ddd;
}

/* 버튼 스타일 */
.modal-footer {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 15px;
}

.modal-footer button {
    width: 100px;
}

.btn {
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
}

.btn-update {
    background: #007bff;
    color: white;
}

.btn-cancel {
    background: #6c757d;
    color: white;
}

/* 모달 활성화 */
.modal-overlay.active {
    display: flex;
}

.Detailinfo {
    width: 150px;
    margin-right: 50px;
    margin-left: 50px;
}

</style>