<template>
  <div class="p-4 max-w-screen-lg mx-auto">
    <hero>
      <template #head-txt>지원서 관리</template>
    </hero>
    <hr class="h-px border-0 mb-10 bg-gray-700" />

    <!-- 로딩 상태 -->
    <div v-if="loading" class="text-center mb-8 text-gray-400">
      <p class="text-lg font-medium">지원서 데이터를 불러오는 중...</p>
    </div>

    <!-- 오류 상태 -->
    <div v-if="error" class="text-center mb-8 text-red-500">
      <p>{{ error }}</p>
    </div>

    <!-- 지원서 테이블 -->
    <div v-else>
      <div v-if="forms.length > 0" class="overflow-x-auto">
        <table
          class="table-auto w-full bg-gray-800 text-white rounded-lg shadow-lg"
        >
          <thead>
            <tr class="bg-gray-700 text-left">
              <th class="p-4">이름</th>
              <th class="p-4">학번</th>
              <th class="p-4">전화번호</th>
              <th class="p-4">인터뷰 날짜</th>
              <th class="p-4">지원 동기</th>
              <th class="p-4">비고</th>
              <th class="p-4 text-center">상세보기</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(form, index) in forms"
              :key="index"
              class="border-t border-gray-700 hover:bg-gray-700"
            >
              <td class="p-4">{{ form.name }}</td>
              <td class="p-4">{{ form.studentId }}</td>
              <td class="p-4">{{ phoneNumberFormat(form.phoneNumber) }}</td>
              <td class="p-4">{{ formatDate(form.interviewDate) }}</td>
              <td class="p-4 truncate max-w-sm">{{ form.applyReason }}</td>
              <td class="p-4">{{ form.comment || '-' }}</td>
              <td class="p-4 text-center">
                <button
                  @click="viewDetails(form)"
                  class="bg-teal-500 hover:bg-teal-400 text-white font-semibold py-2 px-4 rounded ml-[-6px]"
                >
                  상세보기
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="text-center text-gray-400 mt-8">
        <p class="text-lg font-medium">등록된 지원서가 없습니다.</p>
      </div>
    </div>

    <!-- 상세보기 모달 -->
    <div
      v-if="selectedForm"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <div
        class="bg-gray-800 text-white rounded-lg shadow-lg max-w-lg w-full p-6 relative"
      >
        <button
          @click="selectedForm = null"
          class="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          <i class="fas fa-times text-lg"></i>
        </button>
        <h2 class="text-xl font-bold mb-4">지원서 상세 정보</h2>
        <p><strong>이름:</strong> {{ selectedForm.name }}</p>
        <p><strong>학번:</strong> {{ selectedForm.studentId }}</p>
        <p>
          <strong>전화번호:</strong>
          {{ phoneNumberFormat(selectedForm.phoneNumber) }}
        </p>
        <p>
          <strong>인터뷰 날짜:</strong>
          {{ formatDate(selectedForm.interviewDate) }}
        </p>
        <p><strong>지원 동기:</strong> {{ selectedForm.applyReason }}</p>
        <p><strong>비고:</strong> {{ selectedForm.comment || '-' }}</p>
        <div class="mt-4 text-right">
          <button
            @click="selectedForm = null"
            class="bg-red-500 hover:bg-red-400 text-white font-semibold py-2 px-4 rounded"
          >
            닫기
          </button>
        </div>
      </div>
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
      loading: true,
      error: null,
      forms: [],
      selectedForm: null,
    };
  },
  methods: {
    async fetchForms() {
      try {
        const response = await api.get('/apply/all');
        this.forms = response.data.data;
      } catch (error) {
        this.error =
          error.response?.data?.message || '지원서를 불러오는 데 실패했습니다.';
        console.error(
          'Error fetching forms:',
          error.response?.data || error.message
        );
      } finally {
        this.loading = false;
      }
    },
    formatDate(date) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(date).toLocaleDateString(undefined, options);
    },
    viewDetails(form) {
      this.selectedForm = form;
    },
    phoneNumberFormat(phoneNumber) {
      const data = '0' + phoneNumber;

      return data.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');
    },
  },
  mounted() {
    this.fetchForms();
  },
};
</script>
