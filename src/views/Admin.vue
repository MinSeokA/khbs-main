<template>
    <div class="p-4 max-w-screen-lg mx-auto">
      <hero>
        <template #head-txt>관리자 페이지</template>
      </hero>
      <hr class="h-px border-0 mb-10 bg-gray-700" />
  
      <!-- 사용자 정보 -->
      <div v-if="user" class="flex items-center bg-gray-800 p-6 rounded-lg shadow-md text-white mb-8">
        <i class="fas fa-user-circle text-5xl text-blue-400 mr-6"></i>
        <div>
          <p class="text-xl font-bold">{{ user.name }}</p>
          <p class="text-sm text-gray-300">{{ user.email }}</p>
        </div>
      </div>
      <div v-else-if="loading" class="text-center mb-8 text-gray-400">
        <p class="text-lg font-medium">사용자 정보를 불러오는 중...</p>
      </div>
      <div v-else class="text-center mb-8 text-red-500">
        <p v-if="error">{{ error }}</p>
        <p v-else>사용자 정보를 불러오지 못했습니다.</p>
      </div>
  
      <!-- 관리 버튼 (대시보드 스타일) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="(item, index) in adminMenu"
          :key="index"
          @click="navigateTo(item.link)"
          class="bg-gray-800 text-white p-6 rounded-lg flex flex-col items-center justify-center hover:bg-gray-700 cursor-pointer shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
        >
          <div class="text-4xl mb-4">
            <i :class="item.icon"></i>
          </div>
          <p class="text-center font-semibold text-lg">{{ item.label }}</p>
        </div>
      </div>
  
      <!-- 웹사이트 관련 문의 -->
      <div class="mt-10 text-center">
        <p class="text-white text-sm">
          웹사이트 관련 문의:
          <a href="mailto:support@lunaiz.com" class="underline text-teal-400 hover:text-teal-600">
            support@lunaiz.com
          </a>
        </p>
      </div>
  
    </div>
  </template>
  
  
  
  
  <script>
  import hero from '@/components/hero.vue';
  import api from '@/plugins/axios';
  
  export default {
    components: {
      hero,
    },
    data() {
      return {
        user: null,
        loading: true,
        adminMenu: [
          { label: '공지사항', link: '/admin/notice', icon: 'fas fa-bullhorn' },
          {
            label: '방송일정',
            link: '/admin/schedule',
            icon: 'fas fa-calendar-alt',
          },
          {
            label: '문의관리',
            link: '/admin/issue',
            icon: 'fas fa-envelope-open-text',
          },
          { label: '신청곡 관리', link: '/admin/song', icon: 'fas fa-music' },
        ],
      };
    },
    methods: {
      async fetchUser() {
        try {
          console.log('Fetching user data...');
          const response = await api.get('/users/me');
          this.user = response.data.data;
          console.log('User data:', this.user);
        } catch (error) {
          this.error =
            error.response?.data?.message ||
            '사용자 정보를 불러오는 데 실패했습니다.';
          console.error(
            'Error fetching user data:',
            error.response?.data || error.message
          );
          localStorage.removeItem('token');
          window.location.href = '/login';
        } finally {
          this.loading = false;
        }
      },
      navigateTo(link) {
        window.location.href = link;
      },
    },
    mounted() {
      this.fetchUser();
    },
  };
  </script>
