<template>
  <div class="p-4 max-w-screen-lg mx-auto">
    <hero>
      <template #head-txt>비밀번호 재설정</template>
    </hero>

    <hr class="h-px border-0 mb-10 bg-gray-700" />

    <!-- 비밀번호 재설정 폼 -->
    <div class="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <form @submit.prevent="resetPassword">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-white"
            >이메일</label
          >
          <input
            type="email"
            id="email"
            v-model="email"
            required
            @input="validateEmail"
            class="mt-1 p-2 w-full border border-gray-300 rounded-lg text-black"
          />
        </div>

        <button
          type="submit"
          :disabled="!isEmailValid"
          class="w-full text-white py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600"
        >
          비밀번호 재설정
        </button>
      </form>
      <p v-if="emailError" class="text-red-500 text-sm">{{ emailError }}</p>

      <p v-if="message" class="text-green-500 text-sm">{{ message }}</p>
      <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import hero from '@/components/hero.vue';
import api from '@/plugins/axios';
import { ref, computed } from 'vue';

const email = ref('');
const emailError = ref('');
const isEmailValid = computed(() => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.value));
const message = ref('');
const error = ref('');

function validateEmail() {
  if (isEmailValid.value) {
    emailError.value = '';
  } else {
    emailError.value = '유효한 이메일을 입력하세요.';
  }
}

function resetPassword() {
  if (isEmailValid.value) {
    api
      .post('/users/reset-password', { email: email.value })
      .then((response) => {
        message.value = response.data?.data?.message;
        email.value = '';
      })
      .catch((error) => {
        console.error('Error resetting password:', error);
        error.value =
          error.response?.data?.message ||
          '비밀번호 재설정에 실패했습니다.';
      });
  }
}
</script>
