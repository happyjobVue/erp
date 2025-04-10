<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import AttendanceRequestModal from '../../../components/page/personnel/Attendance/AttendanceRequestModal.vue';
import { useUserInfo } from '../../../stores/userInfo';

const searchStDate = ref('');
const searchEdDate = ref('');
const searchReqType = ref('');
const searchReqStatus = ref('');

const attendanceList = ref([]);
const summary = ref({});
const visible = ref(false);

const userInfo = useUserInfo();

//리스트 데이터 불러오기 
const search = () => {
    const form = new URLSearchParams();
    form.append('searchStDate', searchStDate.value);
    form.append('searchEdDate', searchEdDate.value);
    form.append('searchReqType', searchReqType.value);
    form.append('searchReqStatus', searchReqStatus.value);

    form.append('pageSize', 5);
    form.append('currentPage', 1);

    axios
        .post(`/api/personnel/attendanceList.do`, form)
        .then(res => {
            console.log(res.data.attendanceList);
            attendanceList.value = res.data.attendanceList;
        })
        .catch(err => {
            console.error('에러 발생:', err);
        });

}

//총 연차, 남은 연차, 사용연차 구하기 
const anualLeave = () => {

    const form = new URLSearchParams();

    // form.append('userIdx', userInfo.user.empId);
    // console.log(userInfo.user.empId);

    axios
        .post(`/api/personnel/attendanceCnt.do`,form)
        .then(res => {
            console.log(res.data);
            summary.value = res.data.attendanceCnt[0];
        })
        .catch(err => {
            console.error('에러 발생:', err);
        });

}

//등록 창 변수값 하위에서 다시 받기 
//안하면 modal에서 창당하기하면 위에서 visible 값이 안바뀜 
const visibleval = (val) => {
    visible.value = false;
} 


const openModal = () => {
    visible.value = true;
}

onMounted(() => {
    search();
    anualLeave();
})

</script>
<template>
    <div id="container">
      <div class="contents">
        <div class="content">
  
          <!-- 위치 경로 -->
          <p class="Location">
            <i class="icon-home" /> 
            /
            <a href="#" class="btn_nav bold">시스템 관리</a>
            /
            <span class="btn_nav bold">공지 사항</span>
            <a href="#" class="btn_set refresh">
                <i class="icon-refresh" />
            </a>
          </p>
  
          <!-- 검색/등록 영역 -->
          <div class="conTitle">
            <h2>근태 신청</h2>
            <div class="conTitleSub">
              <span class="fr search-bar">
              <label>기간</label>
              <input type="date" v-model="searchStDate" />
              ~
              <input type="date" v-model="searchEdDate" />
              
              <label>연차 타입</label>
              <select v-model="searchReqType">
                <option value="">전체</option>
                <option value="연차">연차</option>
                <option value="반차">반차</option>
              </select>
  
              <label>승인 상태</label>
              <select v-model="searchReqStatus">
                <option value="">전체</option>
                <option value="검토 대기">검토 대기</option>
                <option value="1차 승인">승인 대기</option>
                <option value="승인">승인</option>
                <option value="반려">반려</option>
                <option value="취소">취소</option>
              </select>
  
              <button class="btn red" @click="search">검색</button>
              <button class="btn blue" @click="openModal">등록</button>
            </span>
            </div>
        </div>

        <!-- 등록 모달 -->
        <AttendanceRequestModal v-if="visible" 
            @visibleval="visibleval"
        /> 
  
          <!-- 연차 요약 -->
          <div class="summary-box">

            <table>
                <tr>
                    <th>총연차</th>
                    <th>사용연차</th>
                    <th>남은연차</th>
                </tr>
                <tr>
                    <td>
                        {{ summary.attCnt  }}
                    </td>
                    <td>
                        {{  summary.useAttCnt }}
                    </td>
                    <td>
                        {{ summary.leftAttCnt  }}
                    </td>
                </tr>
            </table>
          </div>
  
          <!-- 리스트 테이블 -->
          <table class="att-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>연차종류</th>
                <th>사번</th>
                <th>사원명</th>
                <th>시작일</th>
                <th>종료일</th>
                <th>결재자</th>
                <th>승인상태</th>
                <th>반려</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in attendanceList" :key="item.id">
                <td>{{ item.id }}</td>
                <td>{{ item.reqType }}</td>
                <td>{{ item.number }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.reqSt }}</td>
                <td>{{ item.reqEd }}</td>
                <td>{{ item.appType }}</td>
                <td>{{ item.reqStatus }}</td>
                <td v-if="item.rejectReason">
                    <button>반려사유</button>
                </td>
                <td v-else>
                    -
                </td>
              </tr>
            </tbody>
          </table>
  
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>

    .icon-home::before {
    content: '🏠';
    margin-right: 5px;
    }

    .Location {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    font-size: 14px;
    }

    .btn_set.home,
    .btn_set.refresh {
    margin-right: 10px;
    font-weight: bold;
    text-decoration: none;
    color: #333;
    }

    .btn_nav {
    margin-right: 8px;
    text-decoration: none;
    color: #555;
    }

    .btn_nav.bold {
    font-weight: bold;
    }

    .btn_set.refresh {
    margin-left: auto;
    }




  .conTitle {
    height: 110px;
    border: 1px solid #ccc;
    padding-left: 30px;
    padding-right: 10px;
    background-color: 	#fafaf9;
  }

  .conTitleSub {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .search-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
  }
  .search-bar input[type="date"],
  .search-bar select {
    height: 25px;
    padding: 2px 6px;
  }
  .btn {
    padding: 4px 10px;
    border: none;
    cursor: pointer;
    border-radius: 3px;
  }
  .btn.red {
    background-color: #d9534f;
    color: #fff;
  }
  .btn.blue {
    background-color: #337ab7;
    color: #fff;
  }
  .summary-box {
    display: flex;
    justify-content: flex-start;
    gap: 40px;
    padding: 10px 0;
    font-weight: bold;
  }
  .summary-box div {
    font-size: 14px;
  }
  .att-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
  }
  .att-table th,
  .att-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
  }
  .att-table th {
    background-color: #f5f5f5;
  }

  .icon-refresh::before {
  content: '🔄';
    }

    .att-table tbody tr:hover {
  background-color: #f0f8ff; /* 연한 파란 배경 */
  cursor: pointer; /* 마우스 커서 바꾸기 */
    }   
  </style>
  