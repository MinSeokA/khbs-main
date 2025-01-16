<script setup>
import { ref } from 'vue';
import api from '@/plugins/axios';
import Hero from '@/components/hero.vue';

const studentName = ref('');
const studentId = ref('');
const password = ref('');
const phoneNumber = ref('');
const interviewDate = ref('');
const applyReason = ref('');
const comment = ref('');
const submissionStatus = ref('');
const isLoading = ref(false);

const submitApplication = async () => {
  // 필드 유효성 검사
  if (!studentName.value || !studentId.value || !password.value || !phoneNumber.value || !interviewDate.value || !applyReason.value) {
    submissionStatus.value = '모든 필드를 입력해 주세요.';
    return;
  }

  isLoading.value = true; // 로딩 상태 활성화
  try {
    const response = await api.post('/apply', {
      name: studentName.value,
      studentId: studentId.value,
      password: password.value,
      phoneNumber: phoneNumber.value,
      interviewDate: interviewDate.value,
      applyReason: applyReason.value,
      comment: comment.value
    });
    
    if (response.status === 201) {
      submissionStatus.value = '지원서가 성공적으로 제출되었습니다.';
      studentName.value = '';
      studentId.value = '';
      password.value = '';
      phoneNumber.value = '';
      interviewDate.value = '';
      applyReason.value = '';
      comment.value = '';
    const ned = localStorage.setItem('apply-success', 'true');
      if (!ned) {
        localStorage.setItem('apply-success', 'true');
      }
    }
  } catch (error) {
    console.error('Error submitting application:', error);
    submissionStatus.value = error.response.data.message || '지원서 제출에 실패했습니다.';
  } finally {
    isLoading.value = false; // 로딩 상태 비활성화
  }
};
</script>

<template>
  <main class="container max-w-screen-md mx-auto p-6 text-white">
    <Hero>
      <template #head-txt>방송부 지원</template>
    </Hero>

    <!-- 동아리 지원 폼 -->
    <div class="md:p-6 p-4 bg-gray-800 rounded-lg shadow-lg">
      <!-- 이름 입력 -->
      <div class="mb-6">
        <label for="name" class="block text-sm font-semibold mb-2">이름</label>
        <input
          type="text"
          id="name"
          v-model="studentName"
          class="w-full p-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="이름을 입력하세요"
        />
      </div>

      <!-- 학번 입력 -->
      <div class="mb-6">
        <label for="studentId" class="block text-sm font-semibold mb-2">학번</label>
        <input
          type="number"
          id="studentId"
          v-model="studentId"
          class="w-full p-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="학번을 입력하세요"
        />
      </div>

      <!-- 비밀번호 입력 -->
      <div class="mb-6">
        <label for="password" class="block text-sm font-semibold mb-2">비밀번호</label>
        <input
          type="password"
          id="password"
          v-model="password"
          class="w-full p-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="비밀번호를 입력하세요"
        />
      </div>

      <!-- 전화번호 입력 -->
      <div class="mb-6">
        <label for="phoneNumber" class="block text-sm font-semibold mb-2">전화번호</label>
        <input
          type="tel"
          id="phoneNumber"
          v-model="phoneNumber"
          class="w-full p-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="전화번호를 입력하세요"
        />
      </div>

      <!-- 면접일 입력 -->
      <div class="mb-6">
        <label for="interviewDate" class="block text-sm font-semibold mb-2">면접일</label>
        <input
          type="date"
          id="interviewDate"
          v-model="interviewDate"
          class="w-full p-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- 지원 동기 입력 -->
      <div class="mb-6">
        <label for="applyReason" class="block text-sm font-semibold mb-2">지원 동기</label>
        <textarea
          id="applyReason"
          v-model="applyReason"
          rows="4"
          class="w-full p-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="지원 동기를 입력하세요"
        ></textarea>
      </div>

      <!-- 하고 싶은 말 입력 -->
      <div class="mb-6">
        <label for="comment" class="block text-sm font-semibold mb-2">하고 싶은 말</label>
        <textarea
          id="comment"
          v-model="comment"
          rows="4"
          class="w-full p-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="하고 싶은 말을 입력하세요"
        ></textarea>
      </div>

      <!-- 제출 버튼 -->
      <div class="flex justify-center">
        <button
          @click="submitApplication"
          class="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          제출하기
        </button>
      </div>

      <!-- 로딩 메시지 -->
      <div v-if="isLoading" class="mt-4 text-center text-white">
        지원서를 생성하는 중입니다...
      </div>

      <!-- 제출 상태 메시지 -->
      <p v-if="submissionStatus" class="mt-4 text-center text-green-400">
        {{ submissionStatus }}
      </p>
    </div>
  </main>
</template>
