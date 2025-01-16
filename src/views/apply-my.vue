<template>
  <hero>
    <template #head-txt>지원서</template>
  </hero>
  <div class="container mx-auto py-12">
    <div
      class="bg-gray-800 shadow-xl rounded-lg overflow-hidden max-w-md mx-auto"
    >
      <div class="bg-blue-600 text-white p-6 text-center">
        <h1 class="text-3xl font-semibold">방송부 지원 조회</h1>
        <p class="mt-2 text-lg">지원서를 조회가 가능합니다.</p>
      </div>

      <div class="p-6">
        <!-- 학번 및 비밀번호 입력 -->
        <div v-if="!application && !isLoading" class="space-y-4">
          <!-- 학번 입력 -->
          <div>
            <label for="studentId" class="text-gray-300 font-medium"
              >학번</label
            >
            <input
              type="text"
              id="studentId"
              v-model="studentId"
              placeholder="학번을 입력하세요"
              class="w-full p-4 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- 비밀번호 입력 -->
          <div>
            <label for="password" class="text-gray-300 font-medium"
              >비밀번호</label
            >
            <input
              type="password"
              id="password"
              v-model="password"
              placeholder="비밀번호를 입력하세요"
              class="w-full p-4 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- 리멤버 미 체크박스 및 이용약관 링크 -->
          <div class="flex items-center space-x-3">
            <input
              type="checkbox"
              id="rememberMe"
              v-model="rememberMe"
              :disabled="!termsAgreed"
              class="h-5 w-5 border-2 mr-1 border-blue-500 text-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
            조회 정보 기억하기
            <span class="text-blue-500 cursor-pointer" @click="openTermsModal"
              >이용약관 확인하기</span
            >
          </div>
        </div>

        <!-- 로딩 상태 표시 -->
        <div v-if="isLoading" class="text-center mt-4 text-blue-500">
          지원서를 조회하는 중입니다...
        </div>

        <!-- 에러 메시지 -->
        <p v-if="submissionStatus" class="mt-4 text-center text-red-500">
          {{ submissionStatus }}
        </p>

        <!-- 조회된 지원서 정보 표시 -->
        <div
          v-if="application && !isLoading"
          class="mt-6 bg-gray-700 p-6 rounded-lg shadow-lg"
        >
          <h2 class="text-2xl font-semibold text-center text-gray-100">
            지원서 정보
          </h2>
          <div class="mt-6 space-y-6">
            <div class="bg-gray-600 p-4 rounded-lg">
              <span class="text-gray-300 font-medium">이름: </span>
              <span class="text-gray-100">{{ application.name }}</span>
            </div>
            <div class="bg-gray-600 p-4 rounded-lg">
              <span class="text-gray-300 font-medium">학번: </span>
              <span class="text-gray-100">{{ application.studentId }}</span>
            </div>
            <div class="bg-gray-600 p-4 rounded-lg">
              <span class="text-gray-300 font-medium">지원 이유: </span>
              <span class="text-gray-100">{{ application.applyReason }}</span>
            </div>
            <div class="bg-gray-600 p-4 rounded-lg">
              <span class="text-gray-300 font-medium">면접 날짜: </span>
              <span class="text-gray-100">{{ interviewDate }}</span>
            </div>
            <div class="bg-gray-600 p-4 rounded-lg">
              <span class="text-gray-300 font-medium">연락처: </span>
              <span class="text-gray-100">0{{ application.phoneNumber }}</span>
            </div>
          </div>
        </div>

        <!-- 조회 버튼 -->
        <div v-if="!application && !isLoading" class="text-center mt-6">
          <button
            @click="fetchApplication"
            class="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            조회
          </button>
        </div>
      </div>
    </div>

    <!-- 이용약관 모달 -->
    <div
      v-if="showTermsModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div
        class="bg-white p-6 rounded-lg w-4/5 md:w-1/2 lg:w-1/3 max-h-[80vh] overflow-auto"
      >
        <!-- 제목 -->
        <h3 class="text-2xl font-semibold mb-6 text-center text-gray-800">
          이용약관
        </h3>

        <!-- 이용약관 내용 -->
        <p class="text-gray-700 text-lg mb-6">
          1. 본 서비스는 방송부에 지원하는 데 필요한 정보를 제공합니다.<br /><br />
          2. 서비스 사용자는 본 약관을 준수해야 하며, 이를 위반할 경우 계정이
          제한될 수 있습니다.<br /><br />
          3. 개인정보는
          <span class="font-bold text-red-600">안전하게 보호</span>되며,
          제3자에게 제공되지 않습니다.<br /><br />
          4. 기타 서비스 관련 사항은 별도의 안내에 따릅니다.<br /><br />
          위 사항을 모두 읽고 동의하시면 "동의하기" 버튼을 눌러주세요.
        </p>

        <!-- 버튼 영역 -->
        <div class="flex justify-between gap-4">
          <!-- 닫기 버튼 -->
          <button
            @click="showTermsModal = false"
            class="py-2 px-6 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-200"
          >
            닫기
          </button>

          <!-- 동의하기 버튼 -->
          <button
            @click="agreeToTerms"
            class="py-2 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            동의하기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import hero from '@/components/hero.vue';
</script>
<script>
import api from '@/plugins/axios';

export default {
  data() {
    return {
      studentId: '',
      password: '',
      rememberMe: false,
      termsAgreed: false,
      showTermsModal: false,
      isLoading: false,
      submissionStatus: '',
      application: null,
      interviewDate: '',
    };
  },
  methods: {
    openTermsModal() {
      this.showTermsModal = true;
    },
    agreeToTerms() {
      this.termsAgreed = true;
      this.showTermsModal = false;
    },
    async fetchApplication() {
      if (!this.studentId || !this.password) {
        this.submissionStatus = '학번과 비밀번호를 입력해 주세요.';
        return;
      }
      this.isLoading = true;
      try {
        const response = await api.post('/apply/my-apply', {
          studentId: Number(this.studentId),
          password: this.password,
        });
        this.application = response.data.data;
        this.submissionStatus = '';
        this.interviewDate = new Date(
          this.application.interviewDate
        ).toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });
        if (this.rememberMe) {
          localStorage.setItem('studentId', this.studentId);
          localStorage.setItem('password', this.password);
        } else {
          localStorage.removeItem('studentId');
          localStorage.removeItem('password');
        }
      } catch (error) {
        this.submissionStatus =
          error.response?.data?.message || '지원서 조회에 실패했습니다.';

        this.application = null;
      } finally {
        this.isLoading = false;
      }
    },
  },
  mounted() {
    // 페이지가 로드될 때 저장된 학번과 비밀번호 불러오기
    const savedStudentId = localStorage.getItem('studentId');
    const savedPassword = localStorage.getItem('password');

    if (savedStudentId && savedPassword) {
      this.studentId = savedStudentId;
      this.password = savedPassword;
      this.rememberMe = true; // 리멤버 미 체크박스도 체크된 상태로 설정
    }
  },
};
</script>

<style scoped>
/* 모달 배경 */
.bg-black.bg-opacity-50 {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

/* 단색 배경으로 변경 */
.bg-white {
  background-color: #ffffff;
}

.bg-gray-900 {
  background-color: #1f2937;
}

.bg-purple-500 {
  background-color: #6b46c1; /* 단색 보라색 */
}

.bg-pink-600 {
  background-color: #d53f8c; /* 단색 분홍색 */
}

/* 버튼 관련 색상 */
.bg-purple-600 {
  background-color: #6b46c1; /* 버튼 단색 보라색 */
}

.bg-purple-700 {
  background-color: #553c9a;
}

.text-purple-600 {
  color: #6b46c1;
}

.focus\:ring-purple-500 {
  --tw-ring-color: #6b46c1;
}

.border-purple-600 {
  border-color: #6b46c1;
}

/* 모달 닫기 버튼 및 기본 UI 색상 */
.bg-gray-300 {
  background-color: #e2e8f0;
}

.text-gray-300 {
  color: #d1d5db;
}

.text-gray-100 {
  color: #f7fafc;
}

.text-gray-700 {
  color: #4a5568;
}

.bg-gray-700 {
  background-color: #2d3748;
}

.bg-gray-800 {
  background-color: #1a202c;
}

/* 기본 전환 및 hover 효과 */
.transition {
  transition: all 0.2s ease-in-out;
}

.hover\:bg-purple-700:hover {
  background-color: #553c9a;
}

.hover\:bg-gray-400:hover {
  background-color: #cbd5e0;
}
</style>
