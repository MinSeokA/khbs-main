<template>
  <div class="p-4 max-w-screen-lg mx-auto">
    <hero>
      <template #head-txt>관리자 페이지</template>
    </hero>
    <hr class="h-px border-0 mb-10 bg-gray-700" />
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
        <a
          href="mailto:support@lunaiz.com"
          class="underline text-teal-400 hover:text-teal-600"
        >
          support@lunaiz.com
        </a>
      </p>
    </div>
  </div>

  <!-- 모달 버튼 -->
  <div class="fixed bottom-12 right-12 m-4" v-if="!showModal">
    <button
      @click="openModal"
      class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-5 rounded-full shadow-lg transition-transform transform hover:scale-105"
    >
      <!-- 아이콘 | 사용자 -->
      <i class="fas fa-user"></i>
    </button>
  </div>

  <!-- 모달 -->
  <transition name="slide-up" @after-leave="resetModal">
    <div v-if="showModal" class="fixed bottom-5 right-5 m-4 z-50">
      <div
        class="bg-white w-80 h-[500px] rounded-2xl shadow-xl flex flex-col overflow-hidden relative"
        style="max-width: 100%"
      >
        <!-- 헤더 -->
        <div
          class="bg-blue-500 text-white p-4 text-lg font-bold flex justify-between items-center"
        >
          <span>Lunaiz 계정</span>
          <button
            @click="closeModal"
            class="text-white text-lg hover:text-gray-200"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- 본문 | 버튼: 사용자 정보, 문의하기 -->
        <div class="p-4 flex flex-col gap-4">
          <!-- 상단 추천 콘텐츠 -->
          <div class="bg-gray-100 p-4 rounded-xl shadow-inner text-gray-700">
            <p class="text-lg font-bold">환영합니다, {{ user.name }}님!</p>
            <p class="text-sm mt-2">오늘도 좋은 하루 되세요 😊</p>
            <p class="text-sm mt-1">
              계정 상태: <span class="text-blue-500 font-medium">활성</span>
            </p>
          </div>

          <!-- 공지사항 -->
          <div class="bg-gray-100 p-4 rounded-xl shadow-inner text-gray-700">
            <p class="text-lg font-bold">업데이트 내역</p>
            <!-- 클릭시 상세 변경점 확인 -->
            <p
              @click="openUpdateDetails"
              class="text-sm mt-2 cursor-pointer hover:text-blue-500"
            >
              v1.0.0 업데이트 내역 확인하기
            </p>
          </div>

          <!-- 버튼 -->
          <div class="mt-6 flex flex-col gap-4">
            <button
              class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-5 rounded-full shadow-lg transition-transform transform hover:scale-105"
            >
              <i class="fas fa-user"></i>
              <span class="ml-2">사용자 정보 변경</span>
            </button>
            <button
              @click="openContactModal"
              class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-5 rounded-full shadow-lg transition-transform transform hover:scale-105"
            >
              <i class="fas fa-envelope-open-text"></i>
              <span class="ml-2">문의하기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
  <!-- 문의하기 -->
  <transition name="slide-right" v-if="showContactModal">
    <div class="fixed bottom-5 right-5 m-4 z-50">
      <div
        class="bg-white w-80 h-[500px] rounded-2xl shadow-xl flex flex-col overflow-hidden relative"
        style="max-width: 100%"
      >
        <!-- 헤더 -->
        <div
          class="bg-blue-500 text-white p-4 text-lg font-bold flex justify-between items-center"
        >
          <span>문의하기</span>
          <button
            @click="closeContactModal"
            class="text-white text-lg hover:text-gray-200"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- 본문 | 문의 내용 입력 -->
        <div class="p-4 flex flex-col gap-4 text-gray-700">
          <textarea
            disabled
            placeholder="현재 사용이 불가능합니다."
            class="w-full h-32 p-2 border rounded-lg"
          ></textarea>
          <p class="text-sm text-gray-500">
            문의는 디스코드:
            <span class="text-blue-500">sss1267_(손지민)</span> 또는
            <br />
            <span class="text-blue-500">lunaizcompany@gmail.com</span>로
            문의해주세요.

          </p>
          <button
            @click="submitContactForm"
            class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
          >
            제출
          </button>
          <p class="px-10 text-sm text-gray-400 p-24">
          개발자 연락처: <span class="text-gray-400">minseok_p(권민석)</span>
        </p>
        </div>
      </div>
    </div>
  </transition>

  <!-- 업데이트 세부 사항 -->
  <transition name="slide-right" v-if="isDetailsVisible">
    <div v-if="showModal" class="fixed bottom-5 right-5 m-4 z-50">
      <div
        class="bg-white w-80 h-[500px] rounded-2xl shadow-xl flex flex-col overflow-hidden relative"
        style="max-width: 100%"
      >
        <!-- 헤더 -->
        <div
          class="bg-blue-500 text-white p-4 text-lg font-bold flex justify-between items-center"
        >
          <span>Lunaiz 계정</span>
          <button
            @click="closeModal"
            class="text-white text-lg hover:text-gray-200"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="p-4 flex flex-col gap-4 text-gray-700">
          <!-- 세부사항 콘텐츠 -->
          <div class="bg-white p-4 rounded-lg shadow-lg">
            <p class="text-lg font-bold">업데이트 v1.0.0</p>
            <ul class="mt-2 space-y-1 text-sm">
              <li>새 기능 추가: 사용자 프로필 보기</li>
              <li>UI 업데이트: 디자인 리뉴얼</li>
            </ul>
            <button
              @click="closeUpdateDetails"
              class="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
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
      message: '',
      user: null,
      showContactModal: false,
      loading: true,
      error: null,
      showModal: false,
      isDetailsVisible: false, // 세부사항 보이기 상태
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
        { label: '지원서 조회', link: '/admin/forms', icon: 'fas fa-file-alt' }, // 새로운 버튼
      ],
    };
  },
  methods: {
    async showMessage(data) {
      this.message = data;
      alert(this.message);
    },
    openContactModal() {
      this.showContactModal = true;
    },
    closeContactModal() {
      this.showContactModal = false;
    },
    submitContactForm() {
      // 문의 사항 제출 로직
      console.log('문의 사항 제출됨');
      this.closeContactModal(); // 제출 후 모달 닫기
    },
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    resetModal() {
      this.showModal = false;
    },
    openUpdateDetails() {
      this.isDetailsVisible = true; // 세부사항 상태 toggle
    },
    closeUpdateDetails() {
      this.isDetailsVisible = false; // 세부사항 상태 toggle
    },
    async fetchUser() {
      try {
        const response = await api.get('/users/me');
        this.user = response.data.data;
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
  setup() {
    return {
      showMessage: false,
    };
  },
};
</script>
<style>
/* 슬라이드 업 애니메이션 */
.slide-up-enter-active {
  animation: slide-up 0.3s ease-out;
}
.slide-up-leave-active {
  animation: slide-down 0.3s ease-in;
}
/* 슬라이드 오른쪽 애니메이션 */
.slide-right-enter-active {
  animation: slide-right 0.3s ease-out;
}
@keyframes slide-right {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
@keyframes slide-down {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(100%);
    opacity: 0;
  }
}

@keyframes slide-right {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
