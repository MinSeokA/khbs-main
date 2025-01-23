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
              @click="openAccountModal"
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
            v-model="messageContact"
            :disabled="isSubmitting"
            placeholder="문의 내용을 입력해주세요."
            class="w-full h-32 p-2 border rounded-lg"
          ></textarea>
          <button
          @click="submitContactForm"
          :disabled="isSubmitting || !messageContact.trim()"
            class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg button"
          >
          {{ isSubmitting ? '전송 중...' : '제출' }}
          </button>
          <!-- 경고 또는 성공 메시지 -->
          <p v-if="isSubmitting" class="text-sm text-green-500">문의를 전송 중입니다...</p>
          <p v-if="message" class="text-sm text-green-500">{{ message }}</p>
          <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
          
          
          <p class="px-10 text-sm text-gray-400 p-24">
          개발자 연락처: <span class="text-gray-400">minseok_p(권민석)</span>
        </p>
        </div>
      </div>
    </div>
  </transition>

  <!-- 사용자 정보 변경 -->
  <transition name="slide-right" v-if="showAccountModal">
    <div class="fixed bottom-5 right-5 m-4 z-50">
      <div
        class="bg-white w-80 h-[500px] rounded-2xl shadow-xl flex flex-col overflow-hidden relative"
        style="max-width: 100%"
      >
        <!-- 헤더 -->
        <div
          class="bg-blue-500 text-white p-4 text-lg font-bold flex justify-between items-center"
        >
          <span>사용자 정보 변경</span>
          <button
            @click="closeAccountModal"
            class="text-white text-lg hover:text-gray-200"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- 본문 | 사용자 정보 변경 -->
        <div class="p-4 flex flex-col gap-4 text-gray-700">
          <p class="text-lg font-bold">비밀번호 변경</p>
          <form @submit.prevent="changePassword">
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">현재 비밀번호</label>
              <input
                type="password"
                id="password"
                v-model="password"
                required
                class="mt-1 p-2 w-full border border-gray-300 rounded-lg"
              />
              <label for="newPassword" class="block text-sm font-medium text-gray-700">새 비밀번호</label>
              <input
                type="password"
                id="newPassword"
                v-model="newPassword"
                required
                class="mt-1 p-2 w-full border border-gray-300 rounded-lg"
              />
            </div>
            <button
              type="submit"
              class="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
            >
              비밀번호 변경
            </button>
          </form>
          <!-- 경고 또는 성공 메시지 -->
          <p v-if="message" class="text-sm text-green-500">{{ message }}</p>
          <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
          <button
            @click="closeAccountModal"
            class="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg"
          >
            닫기
          </button>
          <!-- 비번 모르는 경우 span으로 비밀번호를 잊으셨나요? 페이지 -->
          <span class="text-sm text-blue-500 hover:text-blue-600"><a href="/admin/change-password">비밀번호를 잊으셨나요?</a></span>

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
      showAccountModal: false,
      newPassword: '',
      password: '',
      loading: true,
      error: null,
      messageContact: '',
      isSubmitting: false,      
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
    async submitContactForm() {
      if (!this.messageContact.trim()) {
        this.error = '문의 내용을 입력해주세요.';
        setTimeout(() => {
          this.error = '';
        }, 3000);
        return;
      }

      this.isSubmitting = true;

      try {
        const embedData = {
          embeds: [
            {
              title: '문의 내용',
              description: this.messageContact,
              color: 0x1e90ff, // 파란색
              timestamp: new Date().toISOString(),
              footer: {
                text: '문의가 접수되었습니다. 해당 이메일을 통해 답변을 부탁드립니다.',
              },
              author: {
                name: "사용자: " + this.user.name,
              },
              fields: [
                {
                  name: '답변 받을 이메일',
                  value: this.user.email,
                  inline: true,
                }
              ],
            },
          ],
        };

        const webhookUrl = 'https://discord.com/api/webhooks/1330937616396320798/uJxaHxu8CjDWmR3DTkSvTejlb-aX3IrITP0Z0x9gf-rKO7F0UvGY2JO6T2m2WWhfDN77';
        await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(embedData),
        });

        this.message = '문의가 성공적으로 전송되었습니다. 답변은 이메일로 전송될 예정입니다.';

        setTimeout(() => {
          this.message = '';
        }, 5000);

        this.messageContact = '';
      } catch (error) {
        console.error('웹훅 전송 오류:', error);
        this.error = '문의를 전송하는 데 실패했습니다. 잠시 후 다시 시도해주세요.';
        setTimeout(() => {
          this.error = '';
        }, 3000);
      } finally {
        this.isSubmitting = false;
      }
    },
    openContactModal() {
      this.showContactModal = true;
    },
    closeContactModal() {
      this.messageContact = '';
      this.error = null;
      this.message = '';
      this.showContactModal = false;
    },
    openAccountModal() {
      this.showAccountModal = true;
    },
    closeAccountModal() {
      this.showAccountModal = false;
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
    async changePassword() {
      try {
        const response = await api.post('/users/me/change-password', { password: this.password, newPassword: this.newPassword });
        this.message = response.data?.data?.message;
        this.closeAccountModal();

        setTimeout(() => {
          this.message = '새로운 비밀번호로 변경되었습니다.<br>다시 로그인해주세요.';
          localStorage.removeItem('token');
        }, 3000);
      } catch (error) {
        console.error('Error changing password:', error);
        this.error = error.response?.data?.message || '비밀번호 변경에 실패했습니다.';

        setTimeout(() => {
          this.error = '';
        }, 3000);
      }
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
      this.$router.push(link);
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
button:disabled {
  background-color: #b3c7e6;
  cursor: not-allowed;
}

</style>
