<template>
  <div class="relative h-screen overflow-hidden">
    <!-- 오버레이 -->
    <div class="absolute inset-0 bg-black bg-opacity-70 z-10"></div>

    <!-- 비디오 배경 -->
    <video 
      class="object-cover w-full h-full inset-0 z-0" 
      autoplay 
      muted 
      loop 
      playsinline 
      id="intro">
      <source src="https://cdn.lunaiz.com/kghs/khbs_bg.mp4" type="video/mp4" />
    </video>

    <!-- 텍스트 오버레이 -->
    <div class="absolute inset-0 flex flex-col items-center justify-center z-20 px-4">
      <p class="text-4xl leading-normal md:text-5xl font-extrabold text-center text-white">
  Kyunggi High Broadcasting System
</p>




<a
      @click="handleApplyClick"
      class="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white py-3 px-6 mt-8 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 cursor-pointer">
      {{ applySuccess ? '2025 방송부 지원 조회' : '2025 동아리 지원하기' }}
    </a>

      <!-- 로딩 화면 -->
      <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
        <p class="text-white text-2xl font-bold animate-pulse">{{ loadingMessageApply }}</p>
      </div>


      <!-- 방송일정 카드 그리드 -->
      <p class="mt-[7.5rem] text-xl font-semibold text-gray-200">예정된 방송일정</p>
      <div class="flex flex-wrap justify-center mt-[2rem] gap-6 max-w-screen-lg">
        <div 
          v-for="schedule in nearestSchedules" 
          :key="schedule.id"
          class="bg-gray-900 bg-opacity-80 rounded-lg py-4 px-6 shadow-xl w-80 md:w-64 hover:bg-gray-800 transform transition duration-300 hover:scale-105">
          <p class="md:text-lg text-sm text-gray-400">
            {{ formatDate(schedule.date) }}
            <span v-if="schedule.period">&nbsp;{{ schedule.period }}교시</span>
          </p>
          <h3 class="text-lg md:text-xl font-bold text-gray-100 mt-2 mb-2">
            {{ schedule.title }}
          </h3>
        </div>
      </div>

      <!-- 방송 일정 없으면 없다고 표시 -->
      <p v-if="!nearestSchedules.length" class="mt-4 text-white text-lg">
        예정된 방송 일정이 없습니다.
      </p>
    </div>
  </div>
</template>

<script>
import api from "@/plugins/axios";

export default {
  data() {
    return {
      applySuccess: localStorage.getItem('apply-success') || false,   // 지원하기 버튼 클릭 성공 여부
      isLoading: false, // 로딩 상태
      schedules: [],          // 전체 일정 데이터
      nearestSchedules: [],   // 가장 임박한 일정 데이터
      loadingMessageApply: '', // 지원하기 버튼 로딩 메시지
    };
  },
  methods: {
    // 지원하기 버튼 클릭 시 이벤트 핸들러
    handleApplyClick() {
      this.isLoading = true; // 로딩 상태 활성화
      if (this.applySuccess) {
        // 지원하기 버튼 클릭 성공 시
        this.loadingMessageApply = '지원 조회 페이지로 이동 중...';
        setTimeout(() => {
          this.$router.push('/apply-my');
        }, 1000);
      } else {
        // 지원하기 버튼 클릭 실패 시
        this.loadingMessageApply = '지원하기 페이지로 이동 중...';
        setTimeout(() => {
          this.$router.push('/apply');
        }, 1000);
      }
    },
    // 날짜 형식 변환
    formatDate(date) {
      const d = new Date(date);
      return `${d.getFullYear()}.${(d.getMonth() + 1).toString().padStart(2, "0")}.${d.getDate().toString().padStart(2, "0")}`;
    },
    // 일정 데이터를 서버에서 가져오는 함수
    async fetchSchedules() {
      try {
        const response = await api.get("/schedule/all");
        const allSchedules = response.data.data;

        // id 역순 정렬
        this.schedules = allSchedules.sort((a, b) => b.id - a.id);

        // 현재 날짜 이후의 가장 임박한 일정 4개 추출
        this.nearestSchedules = this.schedules
          .filter(schedule => new Date(schedule.date) >= new Date())
          .slice(0, 4);
      } catch (error) {
        console.error("Failed to load schedules:", error);
      }
    },
  },
  // 컴포넌트가 생성될 때 일정 데이터를 가져옴
  created() {
    this.fetchSchedules();
  },
};
</script>