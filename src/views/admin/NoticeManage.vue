<template>
  <div class="p-4 sm:p-6 max-w-screen-lg mx-auto">
    <!-- 헤더 -->
    <hero>
      <template #head-txt>공지사항 관리</template>
    </hero>

    <hr class="h-px border-0 mb-10 bg-gray-700" />

    <!-- 공지사항 생성/수정 -->
    <div class="bg-gray-800 text-white p-6 rounded-lg shadow-md mb-10">
      <h3 class="text-xl font-bold mb-4 flex items-center">
        <i class="fas fa-pencil-alt mr-2"></i>
        {{ isEditMode ? '공지사항 수정' : '공지사항 생성' }}
      </h3>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- 제목 입력 -->
          <div class="relative">
            <label class="block text-sm font-medium text-gray-300 mb-1"
              >제목</label
            >
            <input
              type="text"
              v-model="form.title"
              placeholder="제목을 입력하세요"
              class="input-field focus:ring focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>

          <!-- 작성자 입력 -->
          <div class="relative">
            <label class="block text-sm font-medium text-gray-300 mb-1"
              >작성자</label
            >
            <input
              type="text"
              v-model="form.author"
              placeholder="작성자 이름을 입력하세요"
              class="input-field focus:ring focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>
        </div>

        <!-- 내용 입력 -->
        <div class="relative mt-4">
          <label class="block text-sm font-medium text-gray-300 mb-1"
            >내용</label
          >
          <textarea
            v-model="form.content"
            placeholder="내용을 입력하세요"
            class="input-field focus:ring focus:ring-teal-500 focus:border-teal-500"
            rows="4"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          class="bg-teal-500 hover:bg-teal-400 text-white font-semibold py-2 px-4 rounded w-full sm:w-3/12"
        >
          <i class="fas fa-save mr-2"></i>
          {{ isEditMode ? '수정하기' : '공지사항 생성' }}
        </button>
      </form>

      <!-- 에러 메시지 -->
      <p v-if="errorMessage" class="text-red-500 mt-4">{{ errorMessage }}</p>

      <!-- 성공 메시지 -->
      <p v-if="Statusmessage" class="text-green-500 mt-4">
        {{ Statusmessage }}
      </p>
    </div>

    <!-- 공지사항 목록 -->
    <div class="bg-gray-800 text-white p-6 rounded-lg shadow-md">
      <h3 class="text-xl font-bold mb-4 flex items-center">
        <i class="fas fa-list mr-2"></i> 공지사항 목록
      </h3>

      <div v-if="notices.length" class="grid gap-6 max-h-80 overflow-y-auto">
        <div
          v-for="(notice, index) in notices"
          :key="notice.id"
          class="bg-gray-900 p-4 rounded-lg shadow-md flex justify-between items-center"
        >
          <div>
            <h4 class="text-lg font-semibold">{{ notice.title }}</h4>
            <p class="text-gray-400 text-sm">
              <strong>작성자:</strong> {{ notice.author }} |
              <strong>날짜:</strong> {{ formatDate(notice.createdAt) }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="viewNotice(notice.id)"
              class="bg-blue-500 hover:bg-blue-400 text-white py-1 px-3 rounded w-full sm:w-auto"
            >
              <i class="fas fa-eye"></i> 보기
            </button>
            <button
              @click="editNotice(notice)"
              class="bg-yellow-500 hover:bg-yellow-400 text-white py-1 px-3 rounded w-full sm:w-auto"
            >
              <i class="fas fa-edit"></i> 수정
            </button>
            <button
              @click="deleteNotice(notice.id)"
              class="bg-red-500 hover:bg-red-400 text-white py-1 px-3 rounded w-full sm:w-auto"
            >
              <i class="fas fa-trash"></i> 삭제
            </button>
          </div>
        </div>
      </div>

      <!-- 로딩 및 오류 -->
      <div v-else-if="loading" class="text-center text-gray-400">
        <p class="text-lg font-medium">공지사항을 불러오는 중...</p>
      </div>
      <div v-else class="text-center text-red-500">
        <p>공지사항이 없습니다.</p>
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
      form: {
        title: '',
        content: '',
        author: '관리자',
      },
      notices: [],
      loading: true,
      error: null,
      errorMessage: '',
      Statusmessage: '',
      isEditMode: false, // 수정 모드 상태
      editingNoticeId: null, // 수정 중인 공지사항 ID
    };
  },
  methods: {
    async fetchNotices() {
      try {
        const response = await api.get('/notice/all');
        // 최신순으로 정렬
        this.notices = response.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      } catch (error) {
        this.error = '공지사항을 불러오는 데 실패했습니다.';
      } finally {
        this.loading = false;
      }
    },
    async handleSubmit() {
      try {
        if (this.isEditMode) {
          // 수정 모드일 경우
          const response = await api.post(
            `/notice/update/${this.editingNoticeId}`,
            this.form
          );
          this.Statusmessage =
            response.data?.data?.message ||
            '공지사항이 성공적으로 수정되었습니다.';
        } else {
          // 공지사항 생성 모드일 경우
          const response = await api.post('/notice', this.form);
          this.Statusmessage =
            response.data?.data?.message ||
            '공지사항이 성공적으로 생성되었습니다.';
        }

        this.fetchNotices(); // 공지사항 목록 갱신
        this.resetForm(); // 폼 초기화
      } catch (error) {
        this.errorMessage =
          error.response?.data?.message ||
          '공지사항 처리 중 오류가 발생했습니다.';
      }
    },
    async deleteNotice(id) {
      if (confirm('정말 삭제하시겠습니까?')) {
        try {
          await api.post(`/notice/delete/${id}`);
          this.fetchNotices();
        } catch (error) {
          alert('삭제 중 오류가 발생했습니다.');
        }
      }
    },
    editNotice(notice) {
      this.isEditMode = true; // 수정 모드 활성화
      this.editingNoticeId = notice.id;
      this.form = { ...notice };
    },
    resetForm() {
      this.isEditMode = false; // 수정 모드 비활성화
      this.editingNoticeId = null;
      this.form = {
        title: '',
        content: '',
        author: '관리자',
      };
    },
    async viewNotice(id) {
      this.$router.push(`/admin/notice/${id}`);
    },
    formatDate(date) {
      const d = new Date(date);
      return `${d.getFullYear()}-${(d.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
    },
  },
  created() {
    this.fetchNotices();
  },
};
</script>

<style scoped>
.input-field {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #4a5568;
  background-color: #2d3748 !important;
  color: #ffffff;
  outline: none;
  transition: all 0.3s ease;
  border-radius: 8px !important;
}

.input-field:focus {
  border-color: #319795; /* 초록색 테두리 */
  box-shadow: 0 0 5px rgba(49, 151, 149, 0.7);
}

.max-h-80 {
  max-height: 20rem;
}
</style>
