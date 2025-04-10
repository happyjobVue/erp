<script setup>
import { ref, onMounted } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import koLocale from '@fullcalendar/core/locales/ko'
import axios from 'axios'
import { useUserInfo } from '../../../stores/userInfo'
import AttendanceModal from '../../../components/page/personnel/Attendance/AttendanceModal.vue'

const showModal = ref(false)
const calendarEvents = ref([])
const detailList = ref([])
const userInfo = useUserInfo();

const calendarOptions = ref({
  plugins: [dayGridPlugin],
  initialView: 'dayGridMonth',
  locale: koLocale,
  height: 700,
  selectable: true,
  events: calendarEvents,
  headerToolbar: {
    left: 'prev',
    center: 'title',
    right: 'today next'
  },
  eventClick: (info) => {
    handleEventClick(info)
  },
  datesSet: () => {
    fetchCalendarData()
  }
})

const fetchCalendarData = async () => {
  

  const res = await axios.post('/api/personnel/attendanceCalendar.do');
  console.log(res);


  const reqList = res.data.attendanceList
  const reqStDate = {}

  reqList.forEach(item => {
    const date = item.reqSt
    const status = item.reqStatus
    if (!reqStDate[date]) {
      reqStDate[date] = {
        '반려': 0,
        '승인 대기': 0,
        '승인': 0,
        '검토 대기': 0
      }
    }
    if (reqStDate[date][status] !== undefined) {
      reqStDate[date][status]++
    }
  })

  const tempList = []

  for (const date in reqStDate) {
    const statusCnt = reqStDate[date]
    for (const status in statusCnt) {
      if (statusCnt[status] > 0) {
        let statusColor = ''
        let statusCode = ''

        switch (status) {
          case '승인 대기':
            statusColor = '#E6B800'
            statusCode = 'F'
            break
          case '승인':
            statusColor = '#71C379'
            statusCode = 'S'
            break
          case '반려':
            statusColor = '#E57373'
            statusCode = 'N'
            break
          default:
            statusColor = '#5B91D4'
            statusCode = 'W'
            break
        }

        tempList.push({
          title: `${status} ${statusCnt[status]}건`,
          start: date,
          color: statusColor,
          allDay: true,
          extendedProps: {
            statusCode
          }
        })
      }
    }
  }

  calendarEvents.value = tempList
}

const handleEventClick = async (info) => {
  const statusCode = info.event.extendedProps.statusCode
  const reqSt = info.event.startStr

  console.log(statusCode);
  console.log(reqSt);

  const form = new URLSearchParams();
  form.append('searchStDate', reqSt);
  form.append('req_status', statusCode);

  const res = await axios.post('/api/personnel/approveDetail.do', form)
  console.log(res.data);
  detailList.value = res.data.attendanceList
  showModal.value = true
}

const OnshowModal = (val) => {
  showModal.value = val;
}

</script>


<template>
  <div id="wrap_area">
    <div id="container">
      <div class="contents">
        <div class="content">
          <p class="Location">
            <a href="#" class="btn_set home">메인으로</a>
            <a href="#" class="btn_nav bold">인사/급여</a>
            <span class="btn_nav bold">근태 현황 조회</span>
            <a href="#" class="btn_set refresh">새로고침</a>
          </p>

          <p class="conTitle"><span>근태 현황 조회</span></p>

          <FullCalendar :options="calendarOptions" />

        </div>
      </div>
    </div>
</div>

<AttendanceModal v-if="showModal"
    :detailList="detailList"
    :showModal="showModal"
    @OnshowModal="OnshowModal"
    />

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
  