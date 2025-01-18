<script setup>
import Hero from '@/components/hero.vue';
import Pagination from '@/components/pagination.vue';

import { ref, onMounted, computed } from 'vue';
import api from '@/plugins/axios';
import { useRouter } from 'vue-router';

const issues = ref([]); // 문의 데이터
const answers = ref([]); // 답변 데이터
const selectedIssue = ref(null); // 선택된 문의
const newResponse = ref(''); // 신규 답변
const currentPage = ref(1); // 현재 페이지
const itemsPerPage = 5; // 페이지당 항목 수
const messages = ref([]); // 메시지
const router = useRouter();

// 문의 리스트를 최신순으로 정렬 후 가져오기
const fetchIssues = async () => {
  try {
    const { data } = await api.get('/issue/all');
    issues.value = data.data.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  } catch (error) {
    console.error('Error fetching issues:', error);
    showMessage(
      error.response.data.message || '문의 삭제에 실패했습니다.',
      'error'
    );
  }
};

// 특정 문의 조회
const viewIssue = async (id) => {
  try {
    const { data } = await api.get(`/issue/view/${id}`);
    selectedIssue.value = data.data;
    // 기존 답변 값을 유지하도록 설정
    newResponse.value = selectedIssue.value.response || '';
  } catch (error) {
    console.error('Error viewing issue:', error);
    showMessage(
      error.response.data.message || '문의 조회에 실패했습니다.',
      'error'
    );
  }
};

// 답변 등록
const submitAnswer = async () => {
  if (!newResponse.value.trim()) {
    messages.value.message = '답변 내용을 입력해주세요.';
    messages.value.type = 'error';
    return;
  }
  try {
    const response = await api.post('/issue/answer', {
      id: selectedIssue.value.id,
      response: newResponse.value,
    });
    showMessage(response.data.data.message, 'success');
    newResponse.value = '';
    fetchAnswers();
  } catch (error) {
    console.error('Error submitting answer:', error);
    showMessage(
      error.response.data.message || '문의 삭제에 실패했습니다.',
      'error'
    );
  }
};

// 답변 수정
const updateAnswer = async () => {
  if (!newResponse.value.trim()) {
    messages.value.message = '답변 내용을 입력해주세요.';
    messages.value.type = 'error';
    return;
  }
  try {
    const response = await api.post('/issue/answer/update', {
      id: selectedIssue.value.id,
      response: newResponse.value,
    });

    showMessage(response.data.data.message, 'success');

    fetchAnswers();
  } catch (error) {
    console.error('Error updating answer:', error);
    showMessage(
      error.response.data.data.message || '문의 삭제에 실패했습니다.',
      'error'
    );
  }
};

// 답변 조회
const fetchAnswers = async () => {
  try {
    const { data } = await api.get('/issue/answer/all');
    answers.value = data.data;
  } catch (error) {
    console.error('Error fetching answers:', error);
    showMessage(
      error.response.data.data.message || '문의 삭제에 실패했습니다.',
      'error'
    );
  }
};

// 문의 삭제
const deleteIssue = async (id) => {
  if (!confirm('이 문의를 삭제하시겠습니까?')) return;
  try {
    await api.delete(`/issue/delete/${id}`);
    showMessage('문의가 삭제되었습니다.', 'success');

    fetchIssues();
  } catch (error) {
    console.error('Error deleting issue:', error);
    showMessage(
      error.response.data.data.message || '문의 삭제에 실패했습니다.',
      'error'
    );
  }
};

const showMessage = (message, type = 'success', duration = 3000) => {
  messages.value = { message, type };
  setTimeout(() => {
    messages.value = null; // 일정 시간 후 메시지 제거
  }, duration);
};

// 페이지 초기화
onMounted(() => {
  fetchIssues();
  fetchAnswers();
});

// 페이지네이션 계산
const paginatedIssues = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return issues.value.slice(start, start + itemsPerPage);
});
</script>

<template>
  <Hero>
    <template #head-txt>문의 관리</template>
  </Hero>

  <div class="container mx-auto p-4 space-y-4" style="width: 90%">
    <!-- 문의 목록 -->
    <div class="bg-gray-800 rounded-lg shadow-lg p-4 dark:bg-gray-800">
      <h2 class="text-lg font-bold mb-4 text-white dark:text-white">
        문의 목록
      </h2>

      <div v-if="issues.length === 0" class="text-center text-white">
        등록된 문의가 없습니다.
      </div>

      <ul v-else class="space-y-4">
        <li
          v-for="issue in paginatedIssues"
          :key="issue.id"
          class="flex justify-between items-center bg-gray-700 dark:bg-gray-700 p-4 rounded-lg shadow-sm"
        >
          <div class="flex-grow space-y-2">
            <!-- 상태 표시 -->
            <span
              v-if="issue.response === null"
              class="inline-block px-3 py-1 text-sm font-medium text-yellow-800 bg-yellow-200 rounded-full"
            >
              답변 대기 중
            </span>
            <span
              v-else
              class="inline-block px-3 py-1 text-sm font-medium text-green-800 bg-green-200 rounded-full"
            >
              답변 완료
            </span>

            <!-- 제목 -->
            <h3 class="text-lg font-bold text-white">
              {{ issue.title }}
            </h3>


            <!-- 설명 -->
            <p class="text-gray-300 text-sm leading-relaxed line-clamp-3">
              {{ issue.description }}
            </p>

            <!-- 위치 및 날짜 -->
            <div class="text-xs text-gray-400 mt-2 flex items-center space-x-2">
              <span>
                <i class="fa-solid fa-location-dot"></i> {{ issue.location }}
              </span>
              <span>|</span>
              <span>
                <i class="fa-solid fa-clock"></i>
                {{ new Date(issue.createdAt).toLocaleString() }}
              </span>
            </div>
          </div>
          
          <div class="flex space-x-2">
            <button
              @click="viewIssue(issue.id)"
              class="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
            >
              <i class="fa-solid fa-eye"></i>
            </button>
            <button
              @click="deleteIssue(issue.id)"
              class="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
            >
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </li>
      </ul>

      <Pagination
        :totalItems="issues.length"
        :current-page="currentPage"
        :items-per-page="itemsPerPage"
        @page-changed="(page) => (currentPage.value = page)"
        class="mt-4"
      />
    </div>

    <!-- 문의 상세 및 답변 -->
    <div
      v-if="selectedIssue"
      class="bg-gray-800 rounded-lg shadow-lg p-4 dark:bg-gray-800 mt-4"
    >
      <h2 class="text-lg font-bold mb-4 text-white dark:text-gray-800">
        문의 상세
      </h2>

      <div>
        <p><strong>제목:</strong> {{ selectedIssue.title }}</p>
        <p><strong>설명:</strong> {{ selectedIssue.description }}</p>
        <p><strong>위치:</strong> {{ selectedIssue.location }}</p>
      </div>

      <div class="mt-6">
        <h3 class="text-md font-bold text-gray-200">
          {{
            selectedIssue.response === null ? '답변' : '답변 수정이 가능합니다.'
          }}
        </h3>

        <textarea
          v-model="newResponse"
          rows="4"
          class="w-full mt-2 p-3 border rounded-lg bg-gray-800 border-gray-600 text-gray-200 focus:ring-2"
          :class="
            selectedIssue.response === null
              ? 'focus:ring-green-500'
              : 'focus:ring-yellow-500'
          "
          :placeholder="
            selectedIssue.response === null
              ? '답변 내용을 입력하세요.'
              : '답변 내용을 수정하세요.'
          "
        ></textarea>
        <div class="flex space-x-4 mt-4">
          <button
            v-if="selectedIssue.response === null"
            @click="submitAnswer"
            class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg shadow-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            답변 등록
          </button>
          <button
            v-else
            @click="updateAnswer"
            class="px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg shadow-lg hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
          >
            답변 수정
          </button>
        </div>

        <p
          v-if="messages.message"
          :class="messages.type === 'error' ? 'text-red-400' : 'text-green-400'"
          class="mt-4 text-sm font-medium"
        >
          {{ messages.message }}
        </p>
      </div>
    </div>
  </div>
</template>
