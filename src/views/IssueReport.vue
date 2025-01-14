<template>
  <Hero>
    <template #head-txt>문제 신고</template>
  </Hero>
  <main class="flex items-center justify-center bg-gray-900">
    <!-- Hero 컴포넌트를 외부에 배치 -->

    <!-- 문제 신고 폼 -->
    <div class="w-full max-w-xl bg-gray-800 p-8 rounded-lg shadow-md">
      <div class="mb-6">
        <label for="title" class="block text-lg font-medium text-white mb-2"
          >제목</label
        >
        <input
          type="text"
          id="title"
          v-model="issueTitle"
          class="w-full p-4 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-gray-700"
          placeholder="제목을 입력하세요"
        />
      </div>

      <div class="mb-6">
        <label
          for="description"
          class="block text-lg font-medium text-white mb-2"
          >문제 설명</label
        >
        <textarea
          id="description"
          v-model="issueDescription"
          rows="4"
          class="w-full p-4 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-gray-700"
          placeholder="발생한 문제에 대한 자세한 설명을 입력하세요"
        ></textarea>
      </div>

      <div class="mb-6">
        <label for="location" class="block text-lg font-medium text-white mb-2"
          >문의 위치</label
        >
        <input
          type="text"
          id="location"
          v-model="issueLocation"
          class="w-full p-4 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-gray-700"
          placeholder="문제가 발생한 위치를 알려주세요 (예: 2학년 2반)"
        />
      </div>

      <button
        @click="submitIssue"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg text-lg"
      >
        제출하기
      </button>

      <p
        v-if="submissionStatus"
        class="mt-4 text-center text-green-500 text-lg"
      >
        {{ submissionStatus }}
      </p>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import api from '@/plugins/axios';
import Hero from '@/components/hero.vue';

const issueTitle = ref('');
const issueDescription = ref('');
const issueLocation = ref(''); // 문의 위치
const submissionStatus = ref(''); // 제출 상태 메시지

const submitIssue = async () => {
  if (!issueTitle.value || !issueDescription.value || !issueLocation.value) {
    submissionStatus.value = '모든 필드를 입력해 주세요.';
    return;
  }

  try {
    const response = await api.post('/issue', {
      title: issueTitle.value,
      description: issueDescription.value,
      location: issueLocation.value,
    });
    if (response.status === 201) {
      submissionStatus.value = '문제 신고가 성공적으로 제출되었습니다.';
      issueTitle.value = '';
      issueDescription.value = '';
      issueLocation.value = '';
      window.location.href = '/issue'; // 홈으로 이동
    }
  } catch (error) {
    console.error('Error submitting issue:', error);
    submissionStatus.value = '문제 신고 제출 중 오류가 발생했습니다.';
  }
};
</script>
