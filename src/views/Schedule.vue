<template>
          <hero>
        <template #head-txt>방송 일정</template>
      </hero>
    <div class="p-6 max-w-screen-lg mx-auto">

      <hr class="h-px border-0 mb-10 bg-gray-700" />
  
      <!-- 방송일정 목록 -->
      <div v-if="schedules.length" class="grid gap-6">
        <div
          v-for="schedule in sortedSchedules"
          :key="schedule.id"
          class="bg-gray-800 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
        >
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-xl font-bold">{{ schedule.title }}</h3>
            <span
              :class="statusClass(schedule.status)"
              class="px-3 py-1 text-sm font-semibold rounded-lg"
            >
              {{ statusText(schedule.status) }}
            </span>
          </div>
          <p class="text-gray-300 text-sm mb-2">
            <strong>작성자:</strong> {{ schedule.author }}
          </p>
          <p class="text-gray-300 text-sm mb-2">
            <strong>방송 날짜:</strong> {{ formatDate(schedule.date) }}
          </p>
          <p class="text-gray-300 text-sm mb-2">
            <strong>교시:</strong> {{ schedule.period }}
          </p>
          <button
            @click="viewDetails(schedule.id)"
            class="mt-4 bg-teal-500 hover:bg-teal-400 text-white font-semibold py-2 px-4 rounded"
          >
            상세보기
          </button>
        </div>
      </div>
  
      <!-- 로딩 및 오류 상태 -->
      <div v-else-if="loading" class="text-center text-gray-400">
        <p class="text-lg font-medium">방송일정을 불러오는 중...</p>
      </div>
      <div v-else class="text-center text-red-500">
        <p>방송일정을 불러오지 못했습니다.</p>
      </div>
    </div>
  </template>
  <script setup>
  import hero from '@/components/hero.vue';
  </script>
  <script>
  import api from "@/plugins/axios";
  
  export default {
    components: { hero },
    data() {
      return {
        schedules: [],
        loading: true,
        error: null,
      };
    },
    computed: {
      sortedSchedules() {
        return this.schedules.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      },
    },
    methods: {
      async fetchSchedules() {
        try {
          const response = await api.get("/schedule/all");
          this.schedules = response.data.data;
        } catch (error) {
          this.error = "방송일정을 불러오는 데 실패했습니다.";
        } finally {
          this.loading = false;
        }
      },
      statusText(status) {
        return ["예정", "진행 중", "완료"][status];
      },
      statusClass(status) {
        return [
          "bg-blue-500 text-white",
          "bg-green-500 text-white",
          "bg-gray-500 text-white",
        ][status];
      },
      formatDate(date) {
        return new Date(date).toLocaleDateString("ko-KR");
      },
      viewDetails(id) {
        this.$router.push(`/schedule/view/${id}`);
      },
    },
    mounted() {
      this.fetchSchedules();
    },
  };
  </script>
  