<template>
  <div class="relative h-screen overflow-hidden">
    <!-- 오버레이 -->
    <div class="absolute inset-0 bg-black opacity-80 z-10"></div>

    <!-- 비디오 배경 -->
    <video class="object-cover w-full h-full inset-0 z-0" autoplay muted loop playsinline id="intro">
      <source src="https://cdn.lunaiz.com/kghs/khbs_bg.mp4" type="video/mp4">
    </video>

    <!-- 텍스트 오버레이 -->
    <div class="absolute inset-0 flex flex-col items-center justify-center z-20">
      <p class="text-white text-4xl leading-normal md:text-5xl break-keep font-bold text-center">
        Kyunggi High Broadcasting System
      </p>

      <a href="/apply"
        class="bg-blue-900 hover:bg-blue-800 text-white py-2 px-4 mt-8 rounded">
        2025 동아리 지원하기</a>

      <!-- 방송일정 카드 그리드 -->
      <p class="mt-[7.5rem] text-xl font-semibold">예정된 방송일정</p>
      <div class="flex flex-wrap justify-center mt-[2rem] gap-4 max-w-screen-lg">
        <div v-for="schedule in nearestSchedules" :key="schedule._id"
          class="bg-gray-800 bg-opacity-90 rounded-lg py-3 px-6 shadow-lg w-80 md:w-60">
          <p class="md:text-lg text-base break-keep text-gray-400">{{ formatDate(schedule.date) }}<span
              v-if="schedule.period"> &nbsp; {{ schedule.period }}교시</span></p>
          <h3 class="text-base md:text-lg font-bold text-gray-200 mt-1 mb-3">{{ schedule.title }}</h3>
        </div>
      </div>
    </div>
  </div>
  <!-- <div class="mx-auto mt-[10rem] overflow-hidden max-w-screen-xl">
    <section class="py-12">
      <div class="container mx-auto px-6 text-center">
        <h2 class="text-3xl font-bold mb-8 text-gray-200">방송부 활동 소개</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-gray-800 rounded-lg shadow-md p-6">
            <h3 class="text-xl font-semibold mb-4">학교 행사 지원</h3>
            <p class="text-gray-400 break-keep">
              입학식, 학생회장 토론회, 경기컵, 화동제, 개교기념식, 탁구제전, 졸업식 등 학교 행사 운영을 지원합니다.
            </p>
          </div>
          <div class="bg-gray-800 rounded-lg shadow-md p-6">
            <h3 class="text-xl font-semibold mb-4">교내 방송 운영</h3>
            <p class="text-gray-400 break-keep">
              방송으로 진행되는 각종 교육 등 교내 방송을 지원하며, 등굣길 음악 방송 등의 프로그램도 진행하고 있습니다.
            </p>
          </div>
          <div class="bg-gray-800 rounded-lg shadow-md p-6">
            <h3 class="text-xl font-semibold mb-4">영상 제작</h3>
            <p class="text-gray-400 break-keep">
              각종 행사를 촬영한 영상, 교가 영상 등을 제작하여 제공하고 있습니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div> -->
</template>

<script>
import api from "@/plugins/axios";

export default {
  data() {
    return {
      schedules: [],
      nearestSchedules: [],
    };
  },
  methods: {
    formatDate(date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}.${month}.${day}`;
    },
    async fetchSchedules() {
      try {
        const response = await api.get("/schedules");
        this.schedules = response.data;

        // 날짜 순으로 정렬
        this.schedules.sort((a, b) => new Date(a.date) - new Date(b.date));

        // 현재 날짜 이후의 가장 임박한 일정 4개 추출
        const currentDate = new Date();
        this.nearestSchedules = this.schedules
          .filter(schedule => new Date(schedule.date) >= currentDate)
          .slice(0, 4);
      } catch (error) {
        console.error("Failed to load schedules:", error);
      }
    },
  },
  created() {
    this.fetchSchedules();
  },
};
</script>

<style scoped>
/* 필요한 스타일 추가 가능 */
</style>
