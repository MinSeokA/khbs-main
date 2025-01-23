<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
    <p class="text-lg mb-4">로그아웃 중입니다...</p>
    <div class="loader"></div>
  </div>
</template>

<script>
import api from "@/plugins/axios";

export default {
  name: "Logout",
  methods: {
    async logout() {
      try {
        // 서버에 로그아웃 요청
        await api.post('/auth/logout');
        // 로컬 스토리지에서 토큰 삭제
        localStorage.removeItem('token');
        // 로그인 페이지로 리디렉션
        window.location.href = "/";
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
  },
  mounted() {
    this.logout();  // 컴포넌트가 마운트될 때 로그아웃 메서드 호출
  }
}
</script>

<style scoped>
.loader {
  border: 4px solid transparent;
  border-top: 4px solid #facc15;  /* Neon yellow */
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
