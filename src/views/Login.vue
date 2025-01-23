<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-900">
    <div v-if="loading" class="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
    <div v-else class="p-8 bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="text-3xl font-bold text-center text-white mb-6">관리자 로그인</h2>
      <form @submit.prevent="handleLogin">
        <!-- 이메일 입력 -->
        <div class="mb-4">
          <label for="username" class="block text-sm font-medium text-gray-300 mb-2 flex items-center">
            <span class="material-icons-outlined text-gray-400 mr-2">email</span>
            이메일
          </label>
          <input
            v-model="username"
            id="username"
            type="text"
            required
            placeholder="이메일을 입력하세요"
            class="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <!-- 비밀번호 입력 -->
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-300 mb-2 flex items-center">
            <span class="material-icons-outlined text-gray-400 mr-2">password</span>
            비밀번호
          </label>
          <input
            v-model="password"
            id="password"
            type="password"
            required
            placeholder="비밀번호를 입력하세요"
            class="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <!-- 로그인 버튼 -->
        <button
          type="submit"
          class="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          로그인
        </button>
        <!-- 에러 메시지 -->
        <p v-if="errorMessage" class="text-red-500 text-center mt-4">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import api from "@/plugins/axios";

export default {
  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
      loading: false, // 로딩 상태 추가
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true; // 로딩 화면 표시 시작
      try {
        const response = await api.post("/auth/login", {
          email: this.username,
          password: this.password,
        });
        const token = response.data.data.access_token;
        localStorage.setItem("token", token); // 토큰을 로컬 스토리지에 저장
        // 로그인 성공 시 관리자 페이지로 이동
        window.location.href = "/admin";
      } catch (error) {
        this.errorMessage = error.response.data.message;
        console.error("로그인 실패:", error);
      } finally {
        this.loading = false; // 로딩 화면 숨김
      }
    },
  },
};
</script>

<style scoped>
/* 배경색 스타일 추가 */
body {
  background-color: #1a202c; /* Tailwind의 gray-900 */
}
</style>
