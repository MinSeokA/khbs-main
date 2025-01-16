<template>
    <div class="p-6 max-w-screen-lg mx-auto">
      <hero>
        <template #head-txt>방송 일정 관리</template>
      </hero>
  
      <hr class="h-px border-0 mb-10 bg-gray-700" />
  
      <!-- 방송 일정 생성/수정 -->
      <div class="bg-gray-800 text-white p-6 rounded-lg shadow-md mb-10">
        <h3 class="text-xl font-bold mb-4 flex items-center">
          <i class="fas fa-calendar-plus mr-2"></i> {{ isEditMode ? '방송 일정 수정' : '방송 일정 생성' }}
        </h3>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
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
  
          <div class="grid grid-cols-2 gap-4 mt-4">
            <!-- 방송 날짜 -->
            <div class="relative">
              <label class="block text-sm font-medium text-gray-300 mb-1"
                >방송 날짜</label
              >
              <input
                type="date"
                v-model="form.date"
                class="input-field focus:ring focus:ring-teal-500 focus:border-teal-500"
                required
              />
            </div>
  
            <!-- 교시 입력 -->
            <div class="relative">
              <label class="block text-sm font-medium text-gray-300 mb-1"
                >교시</label
              >
              <input
                type="text"
                v-model="form.period"
                placeholder="교시 (예: 1교시)"
                class="input-field focus:ring focus:ring-teal-500 focus:border-teal-500"
                required
              />
            </div>
          </div>

          <div class="flex items-center gap-4">
            <label class="text-sm font-semibold">방송 상태:</label>
            <select v-model="form.status" class="input-field w-3/12">
              <option value="0">예정</option>
              <option value="1">진행 중</option>
              <option value="2">완료</option>
            </select>
          </div>
          <button
            type="submit"
            class="bg-teal-500 hover:bg-teal-400 text-white font-semibold py-2 px-4 rounded"
          >
            <i class="fas fa-save mr-2"></i> {{ isEditMode ? '수정하기' : '일정 생성' }}
          </button>
        </form>
        <!-- 에러 메시지 -->
        <p v-if="errorMessage" class="text-red-500 mt-4">{{ errorMessage }}</p>
  
        <!-- 성공 메시지 -->
        <p v-if="Statusmessage" class="text-green-500 mt-4">
          {{ Statusmessage }}
        </p>
      </div>
  
      <!-- 방송 일정 목록 -->
      <div class="bg-gray-800 text-white p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-bold mb-4 flex items-center">
          <i class="fas fa-list mr-2"></i> 방송 일정 목록
        </h3>
        <div v-if="schedules.length" class="grid gap-6">
          <div
            v-for="schedule in schedules"
            :key="schedule.id"
            class="bg-gray-900 p-4 rounded-lg shadow-md flex justify-between items-center"
          >
            <div>
              <h4 class="text-lg font-semibold">{{ schedule.title }}</h4>
              <p class="text-gray-400 text-sm">
                <strong>작성자:</strong> {{ schedule.author }} |
                <strong>교시:</strong> {{ schedule.period }} |
                <strong>날짜:</strong> {{ formatDate(schedule.date) }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="editSchedule(schedule)"
                class="bg-blue-500 hover:bg-blue-400 text-white py-1 px-3 rounded"
              >
                <i class="fas fa-edit"></i> 수정
              </button>
              <button
                @click="deleteSchedule(schedule.id)"
                class="bg-red-500 hover:bg-red-400 text-white py-1 px-3 rounded"
              >
                <i class="fas fa-trash"></i> 삭제
              </button>
              <button
                @click="cancelSchedule(schedule.id)"
                v-if="schedule.status !== 2"
                class="bg-yellow-500 hover:bg-yellow-400 text-white py-1 px-3 rounded"
              >
                <i class="fas fa-ban"></i> 취소
              </button>
            </div>
          </div>
        </div>
  
        <!-- 로딩 및 오류 -->
        <div v-else-if="loading" class="text-center text-gray-400">
          <p class="text-lg font-medium">방송 일정을 불러오는 중...</p>
        </div>
        <div v-else class="text-center text-red-500">
          <p>방송 일정이 없습니다.</p>
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
          author: '관리자',
          date: '',
          period: '',
          status: 0,
        },
        schedules: [],
        loading: true,
        error: null,
        errorMessage: '',
        Statusmessage: '',
        isEditMode: false,  // 수정 모드 상태
        editingScheduleId: null,  // 수정 중인 일정 ID
      };
    },
    methods: {
      async fetchSchedules() {
        try {
          const response = await api.get('/schedule/all');
          this.schedules = response.data.data;
        } catch (error) {
          this.error = '방송 일정을 불러오는 데 실패했습니다.';
        } finally {
          this.loading = false;
        }
      },
      async handleSubmit() {
        try {
          if (this.isEditMode) {
            // 수정 모드일 경우
            const response = await api.post(`/schedule/update/${this.editingScheduleId}`, this.form);
            this.Statusmessage = response.data?.data?.message || '일정이 성공적으로 수정되었습니다.';
          } else {
            // 일정 생성 모드일 경우
            const response = await api.post('/schedule', this.form);
            this.Statusmessage = response.data?.data?.message || '일정이 성공적으로 생성되었습니다.';
          }
  
          this.fetchSchedules(); // 일정 목록 갱신
          this.resetForm(); // 폼 초기화
        } catch (error) {
          this.errorMessage = error.response?.data?.message || '일정 처리 중 오류가 발생했습니다.';
        }
      },
      async deleteSchedule(id) {
        if (confirm('정말 삭제하시겠습니까?')) {
          try {
            await api.post(`/schedule/delete/${id}`);
            this.fetchSchedules();
          } catch (error) {
            alert('삭제 중 오류가 발생했습니다.');
          }
        }
      },
      async cancelSchedule(id) {
        try {
          const schedule = this.schedules.find((s) => s.id === id);
          if (schedule) {
            schedule.status = 2;
            await api.post(`/schedule/update/${id}`, schedule);
            this.fetchSchedules();
          }
        } catch (error) {
          alert('취소 처리 중 오류가 발생했습니다.');
        }
      },
      editSchedule(schedule) {
        this.isEditMode = true; // 수정 모드 활성화
        const status = parseInt(this.form.status);

        this.editingScheduleId = schedule.id;
        this.form = { ...schedule, date: this.formatDateForInput(schedule.date), status };
      },
      resetForm() {
        this.isEditMode = false; // 수정 모드 비활성화
        this.editingScheduleId = null;
        this.form = {
          title: '',
          author: '관리자',
          date: '',
          period: '',
          description: '',
          status: 0,
        };
      },
      formatDateForInput(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
      },
      formatDate(date) {
        const d = new Date(date);
        return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
      },
    },
    created() {
      this.fetchSchedules();
    },
  };
  </script>
  
<style>
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
</style>
