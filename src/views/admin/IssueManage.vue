<template>
  <!-- 헤더 -->
  <hero>
    <template #head-txt>문의 관리</template>
  </hero>

  <div class="admin-container">
    <!-- 문의 목록 테이블 -->
    <div class="issues-table-wrapper">
      <table class="issues-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>위치</th>
            <th>상태</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(issue, index) in issues" :key="issue.id">
            <td>{{ index + 1 }}</td>
            <td>{{ issue.title }}</td>
            <td>{{ issue.location }}</td>
            <!-- 답변 대기시 빨간색, 답변 완료시 초록색 -->
            <td :style="{ color: issue.response ? '#48bb78' : '#f56565' }">
              {{ issue.status }}
            </td>
            <td>
              <button @click="viewIssue(issue.id)" class="btn-view">
                상세보기
              </button>
              <button @click="deleteIssue(issue.id)" class="btn-delete">
                삭제
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 문의 상세보기 및 답변 작성/수정 -->
    <div v-if="selectedIssue" class="issue-detail-wrapper">
      <div class="issue-detail-header">
        <h2>{{ selectedIssue.title }}</h2>

        <!-- 위치 영역 -->
        <div class="issue-location-wrapper">
          <span class="issue-location-label">위치: </span>
          <p class="issue-location">{{ selectedIssue.location }}</p>
        </div>

        <!-- 설명 영역 -->
        <div class="issue-description-wrapper">
          <span class="issue-description-label">설명: </span>
          <p class="issue-description">{{ selectedIssue.description }}</p>
        </div>
      </div>

      <div v-if="selectedIssue.response" class="response-wrapper">
        <h3>답변</h3>
        <p>{{ selectedIssue.response }}</p>
        <button @click="editResponse" class="btn-edit">답변 수정</button>
      </div>

      <div v-else>
        <h3>답변 등록</h3>
        <!-- 한칸 띄우기-->
        <br />
        <textarea
          v-model="newResponse"
          placeholder="답변을 입력하세요"
          class="response-textarea"
        ></textarea>
        <button @click="submitResponse" class="btn-submit">답변 등록</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import hero from '@/components/hero.vue';
import api from '@/plugins/axios';

const issues = ref([]);
const selectedIssue = ref(null);
const newResponse = ref('');

// 문의 목록 조회
const fetchIssues = async () => {
  try {
    const response = await api.get('/issue/all');
    issues.value = response.data.data.reverse(); // 최신순으로 정렬

    // 상태 표시
    issues.value.forEach((issue) => {
      issue.status = issue.response ? '답변 완료' : '답변 대기';
    });
    
  } catch (error) {
    console.error('문의 목록을 불러오는 데 실패했습니다.');
  }
};

// 문의 상세보기
const viewIssue = async (id) => {
  try {
    const response = await api.get(`/issue/view/${id}`);
    selectedIssue.value = response.data.data;
  } catch (error) {
    console.error('문의 상세보기 실패');
  }
};

// 문의 삭제
const deleteIssue = async (id) => {
  try {
    await api.delete(`/issue/delete/${id}`);
    fetchIssues(); // 목록 갱신
  } catch (error) {
    console.error('문의 삭제 실패');
  }
};

// 답변 등록
const submitResponse = async () => {
  if (newResponse.value.trim()) {
    try {
      await api.post('/issue/answer', {
        id: selectedIssue.value.id,
        response: newResponse.value,
      });
      selectedIssue.value.response = newResponse.value; // 로컬에 반영
      newResponse.value = ''; // 입력값 초기화
    } catch (error) {
      console.error('답변 등록 실패');
    }
  } else {
    alert('답변을 입력해주세요.');
  }
};

// 답변 수정
const editResponse = () => {
  newResponse.value = selectedIssue.value.response;
};

// 초기 데이터 로딩
onMounted(fetchIssues);
</script>

<style scoped>
/* 전체 컨테이너 */
.admin-container {
  border-radius: 10px;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #2d3748; /* bg-gray-700 */
  color: #edf2f7; /* text-gray-100 */
}

/* 문의 목록 테이블 */
.issues-table-wrapper {
  border-radius: 10px !important;
  margin-top: 20px;
}

.issues-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
  background-color: #3e4c59; /* bg-gray-800 */
  border-radius: 10px;
}

.issues-table th,
.issues-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #4a5568; /* border-gray-600 */
}

.issues-table th {
  background-color: #2b3e4d; /* bg-gray-900 */
  font-weight: bold;
  color: #edf2f7; /* text-gray-100 */
}

.issues-table tr:hover {
  background-color: #3e4c59; /* bg-gray-800 */
}

.btn-view,
.btn-delete {
  padding: 8px 16px;
  margin-right: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-view {
  background-color: #3182ce;
  color: white;
  border: none;
}

.btn-delete {
  background-color: #e53e3e;
  color: white;
  border: none;
}

.btn-view:hover {
  background-color: #2b6cb0;
}

.btn-delete:hover {
  background-color: #c53030;
}

/* 문의 상세보기 */
.issue-detail-wrapper {
  margin-top: 40px;
  padding: 20px;
  background-color: #3e4c59; /* bg-gray-800 */
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* 문의 상세보기 스타일 */
.issue-detail-header h2 {
  font-size: 2rem;
  color: #edf2f7; /* text-gray-100 */
  font-weight: bold;
  margin-bottom: 10px;
}

.issue-location-wrapper,
.issue-description-wrapper {
  margin-bottom: 15px;
}

.issue-location-label,
.issue-description-label {
  font-size: 1.1rem;
  font-weight: bold;
  color: #a0aec0; /* text-gray-400 */
}

.issue-location,
.issue-description {
  font-size: 1rem;
  color: #e2e8f0; /* text-gray-200 */
  white-space: pre-line; /* 줄바꿈 유지 */
  word-wrap: break-word; /* 단어가 길어지면 자동 줄 바꿈 */
  margin-top: 5px;
}

.response-wrapper {
  margin-top: 20px;
}

.response-wrapper h3 {
  font-size: 1.25rem;
  color: #edf2f7; /* text-gray-100 */
  font-weight: bold;
  margin-bottom: 10px;
}

.response-wrapper p {
  font-size: 1rem;
  color: #e2e8f0; /* text-gray-200 */
  margin-bottom: 10px;
}

.response-textarea {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  border: 1px solid #4a5568; /* border-gray-600 */
  border-radius: 8px;
  margin-bottom: 20px;
  resize: vertical;
  background-color: #2d3748; /* bg-gray-700 */
  color: #edf2f7; /* text-gray-100 */
}

.btn-submit {
  padding: 10px 20px;
  background-color: #3182ce;
  color: white;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-submit:hover {
  background-color: #2b6cb0;
}

.btn-edit {
  padding: 10px 20px;
  background-color: #e53e3e;
  color: white;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-edit:hover {
  background-color: #c53030;
}
</style>
