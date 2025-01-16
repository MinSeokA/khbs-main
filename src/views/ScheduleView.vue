<template>
  <div class="p-6 max-w-screen-lg mx-auto">
    <hero>
      <template #head-txt>방송일정 상세보기</template>
    </hero>
    <hr class="h-px border-0 mb-10 bg-gray-700" />

    <div v-if="schedule" class="bg-gray-800 text-white p-6 rounded-lg shadow-md">
      <h3 class="text-2xl font-bold mb-4">{{ schedule.title }}</h3>
      <p class="text-gray-300 text-sm mb-2">
        <strong>작성자:</strong> {{ schedule.author }}
      </p>
      <p class="text-gray-300 text-sm mb-2">
        <strong>방송 날짜:</strong> {{ formatDate(schedule.date) }}
      </p>
      <p class="text-gray-300 text-sm mb-2">
        <strong>교시:</strong> {{ schedule.period }}
      </p>
      <p v-if="schedule.description" class="text-gray-300 text-sm mb-2">
        <strong>설명:</strong> {{ schedule.description }}
      </p>
      <p class="text-gray-300 text-sm mb-2">
        <strong>상태:</strong> {{ statusText(schedule.status) }}
      </p>
      <button
        @click="goBack"
        class="mt-6 bg-teal-500 hover:bg-teal-400 text-white font-semibold py-2 px-4 rounded"
      >
        돌아가기
      </button>
    </div>

    <div v-else-if="loading" class="text-center text-gray-400">
      <p class="text-lg font-medium">방송일정 정보를 불러오는 중...</p>
    </div>
    <div v-else class="text-center text-red-500">
      <p>방송일정 정보를 불러오지 못했습니다.</p>
    </div>
  </div>
</template>

<script>
import hero from "@/components/hero.vue";
import api from "@/plugins/axios";

export default {
  components: { hero },
  data() {
    return {
      schedule: null,
      loading: true,
      error: null,
    };
  },
  methods: {
    async fetchSchedule() {
      try {
        const id = this.$route.params.id;
        const response = await api.get(`/schedule/view/${id}`);
        this.schedule = response.data.data;
      } catch (error) {
        this.error = "방송일정을 불러오는 데 실패했습니다.";
      } finally {
        this.loading = false;
      }
    },
    statusText(status) {
      return ["예정", "진행 중", "완료"][status];
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString("ko-KR");
    },
    goBack() {
      this.$router.push("/schedule");
    },
  },
  mounted() {
    this.fetchSchedule();
  },
};
</script>
