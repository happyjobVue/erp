<script setup>
import { ref, onMounted } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import koLocale from '@fullcalendar/core/locales/ko';
import axios from 'axios';

const showModal = ref(false);
const calendarEvents = ref([]);
const detailList = ref([]);

const fetchCalendarData = async () => {
  const res = await axios.post('/personnel/attendanceCalendar.do');
  const reqList = res.data.attendanceList;
  const reqStDate = {};

  reqList.forEach(item => {
    const date = item.reqSt;
    const status = item.reqStatus;
    if (!reqStDate[date]) {
      reqStDate[date] = {
        '반려': 0,
        '승인 대기': 0,
        '승인': 0,
        '검토 대기': 0,
      };
    }
    if (reqStDate[date][status] !== undefined) {
      reqStDate[date][status]++;
    }
  });

  const tempList = [];

  for (const date in reqStDate) {
    const statusCnt = reqStDate[date];
    for (const status in statusCnt) {
      if (statusCnt[status] > 0) {
        let statusColor = '';
        let statusCode = '';

        switch (status) {
          case '승인 대기':
            statusColor = '#E6B800';
            statusCode = 'F';
            break;
          case '승인':
            statusColor = '#71C379';
            statusCode = 'S';
            break;
          case '반려':
            statusColor = '#E57373';
            statusCode = 'N';
            break;
          default:
            statusColor = '#5B91D4';
            statusCode = 'W';
            break;
        }

        tempList.push({
          title: `${status} ${statusCnt[status]}건`,
          start: date,
          color: statusColor,
          allDay: true,
          extendedProps: {
            statusCode,
          },
        });
      }
    }
  }

  calendarEvents.value = tempList;
};

const handleEventClick = async (info) => {
  const statusCode = info.event.extendedProps.statusCode;
  const reqSt = info.event.startStr;

  const param = {
    searchStDate: reqSt,
    req_status: statusCode,
  };

  const res = await axios.post('/personnel/approveDetail.do', param);
  detailList.value = res.data.attendanceList;
  showModal.value = true;
};

onMounted(() => {
  fetchCalendarData();
});
</script>


<template>
  <div id="wrap_area">
    <div id="container">
      <div class="lnb"><LnbMenu /></div>

      <div class="contents">
        <div class="content">
          <p class="Location">
            <a href="#" class="btn_set home">메인으로</a>
            <a href="#" class="btn_nav bold">인사/급여</a>
            <span class="btn_nav bold">근태 현황 조회</span>
            <a href="#" class="btn_set refresh">새로고침</a>
          </p>

          <p class="conTitle"><span>근태 현황 조회</span></p>

          <FullCalendar
            :plugins="[dayGridPlugin]"
            :locale="koLocale"
            initialView="dayGridMonth"
            :height="'700px'"
            :selectable="true"
            :events="calendarEvents"
            :eventClick="handleEventClick"
            :headerToolbar="{
              left: 'prev',
              center: 'title',
              right: 'today next'
            }"
          />
        </div>
      </div>
    </div>

    <!-- 모달 -->
    <div v-if="showModal" class="layerPop layerType2" style="width: 600px;">
      <dl>
        <dt><strong>신청 현황</strong></dt>
        <dd class="content">
          <table class="jsgrid-table">
            <thead>
              <tr><th>부서</th><th>사원명</th><th>신청구분</th></tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in detailList" :key="i">
                <td>{{ item.deptName }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.reqType }}</td>
              </tr>
            </tbody>
          </table>
          <div class="btn_areaC mt30">
            <button class="btnType gray" @click="showModal = false"><span>닫기</span></button>
          </div>
        </dd>
      </dl>
      <a href="#" class="closePop" @click.prevent="showModal = false"><span class="hidden">닫기</span></a>
    </div>
  </div>
</template>

  
  <style scoped>
  .fc-day-sun .fc-col-header-cell-cushion,
  .fc-daygrid-day.fc-day-sun .fc-daygrid-day-number {
    color: red;
  }
  .fc-day-sat .fc-col-header-cell-cushion,
  .fc-daygrid-day.fc-day-sat .fc-daygrid-day-number {
    color: blue;
  }

  /* 경로 영역 전체 정렬 */
.Location {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

/* 왼쪽 경로 */
.Location a,
.Location span {
  font-size: 14px;
  color: #555;
  margin-right: 8px;
}

/* 오른쪽 새로고침 버튼 */
.Location .refresh {
  margin-left: auto;
  padding: 4px 8px;
  background: #e7f0fa;
  border: 1px solid #aac4e5;
  border-radius: 4px;
  font-size: 13px;
  color: #007bff;
  display: inline-block;
  cursor: pointer;
}

/* 타이틀 */
.conTitle {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
}
  </style>
  