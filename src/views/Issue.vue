<template>
  <Hero>
    <template #head-txt>문의 목록</template>
  </Hero>

  <!-- 문제 신고 버튼 -->
  <div class="flex flex-col items-center p-4 mb-6 space-y-4 max-w-screen-sm mx-auto">
    <a
      target="_blank"
      href="https://cdn.lunaiz.com/kghs/Broadcast%20Solution.pdf"
      class="w-full md:w-56 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg flex items-center justify-center shadow-md transition duration-300 ease-in-out text-sm"
    >
      <i class="fa-solid fa-file-pdf text-lg"></i>
      <span class="ml-2 text-sm font-semibold">문제 해결 가이드</span>
    </a>

    <RouterLink
      to="/issue/report"
      class="w-full md:w-56 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg flex items-center justify-center shadow-md transition duration-300 ease-in-out text-sm"
    >
      <i class="fa-solid fa-circle-exclamation text-lg"></i>
      <span class="ml-2 text-sm font-semibold">문제 신고하기</span>
    </RouterLink>
  </div>

  <!-- 문제 목록 -->
  <h1
    v-if="!issues || issues.length === 0"
    class="text-xl text-center font-bold text-gray-700 dark:text-gray-200"
  >
    현재 등록된 이슈가 없습니다.
  </h1>

  <!-- 해결중과 해결됨을 나누어 표시 -->
  <div class="flex flex-col md:flex-row justify-between space-y-6 md:space-y-0 md:space-x-6 max-w-screen-sm mx-auto">
    <!-- 해결중 이슈 목록 -->
    <div class="w-full md:w-1/2">
      <h2 class="text-xl text-center font-semibold text-red-500 mb-4">해결중</h2>
      <div class="h-80 overflow-y-auto"> <!-- 스크롤 가능한 영역 -->
        <main v-if="unresolvedIssues.length > 0" class="grid grid-cols-1 gap-4 pb-8">
          <div
            v-for="issue in unresolvedIssues"
            :key="issue.id"
            class="border border-gray-700 bg-gray-700 text-white rounded-lg overflow-hidden shadow-lg transition-all hover:shadow-xl hover:border-gray-300 hover:bg-gray-300 hover:text-gray-800"
            style="transition: background-color 0.3s, border-color 0.3s, box-shadow 0.3s"
          >
            <RouterLink
              :to="'/issue/' + issue.id"
              class="block"
              style="transition: inherit; text-decoration: none; display: block;"
            >
              <div v-if="issue.banner_image" class="relative h-24 md:h-28">
                <img
                  :src="issue.banner_image"
                  alt="issue image"
                  class="w-full h-full object-cover"
                  @error="issue.banner_image = ''"
                />
                <div class="absolute inset-0 bg-black bg-opacity-20 rounded-t-lg"></div>
              </div>

              <div class="p-3">
                <h3 class="text-lg font-bold flex items-center">
                  <i class="fa-solid fa-cogs text-red-500 mr-2"></i>
                  {{ issue.title }} <!-- <span class="text-sm text-red-500">(해결중)</span> -->
                </h3>
                <p class="text-sm mt-2">
                  {{ getPreview(issue.description) }}
                </p>
                <div class="mt-4 flex items-center justify-between text-sm">
                  <span>
                    <i class="fa-solid fa-location-dot"></i> {{ issue.location }}
                  </span>
                  <span>
                    <i class="fa-solid fa-calendar"></i> {{ formattedDate(issue.createdAt) }}
                  </span>
                </div>
              </div>
            </RouterLink>
          </div>
        </main>
      </div>
    </div>

    <!-- 해결됨 이슈 목록 -->
    <div class="w-full md:w-1/2">
      <h2 class="text-xl text-center font-semibold text-green-500 mb-4">해결됨</h2>
      <div class="h-80 overflow-y-auto"> <!-- 스크롤 가능한 영역 -->
        <main v-if="resolvedIssues.length > 0" class="grid grid-cols-1 gap-4 pb-8">
          <div
            v-for="issue in resolvedIssues"
            :key="issue.id"
            class="border border-gray-700 bg-gray-700 text-white rounded-lg overflow-hidden shadow-lg transition-all hover:shadow-xl hover:border-gray-300 hover:bg-gray-300 hover:text-gray-800"
            style="transition: background-color 0.3s, border-color 0.3s, box-shadow 0.3s"
          >
            <RouterLink
              :to="'/issue/' + issue.id"
              class="block"
              style="transition: inherit; text-decoration: none; display: block;"
            >
              <div v-if="issue.banner_image" class="relative h-24 md:h-28">
                <img
                  :src="issue.banner_image"
                  alt="issue image"
                  class="w-full h-full object-cover"
                  @error="issue.banner_image = ''"
                />
                <div class="absolute inset-0 bg-black bg-opacity-20 rounded-t-lg"></div>
              </div>

              <div class="p-3">
                <h3 class="text-lg font-bold flex items-center">
                  <i class="fa-solid fa-check-circle text-green-500 mr-2"></i>
                  {{ issue.title }} <!-- <span class="text-sm text-green-500">(해결됨)</span> -->
                </h3>
                <p class="text-sm mt-2">
                  {{ getPreview(issue.description) }}
                </p>
                <div class="mt-4 flex items-center justify-between text-sm">
                  <span>
                    <i class="fa-solid fa-location-dot"></i> {{ issue.location }}
                  </span>
                  <span>
                    <i class="fa-solid fa-calendar"></i> {{ formattedDate(issue.createdAt) }}
                  </span>
                </div>
              </div>
            </RouterLink>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 화면 크기 제한 */
.max-w-screen-sm {
  max-width: 640px;
}

/* 카드 이미지 크기 줄이기 */
.relative {
  height: 6rem; /* 카드 이미지 크기를 더 줄임 */
}

/* 카드 내부 여백 줄이기 */
.p-3 {
  padding: 0.75rem; /* 패딩을 줄여서 카드 크기 축소 */
}

/* 카드 사이 간격 조정 */
.grid-cols-1 {
  gap: 1rem; /* 카드 간격을 줄임 */
}

/* 모바일 화면에서 각 카드를 꽉 차게 만들기 */
@media (max-width: 640px) {
  .w-full {
    width: 100%;
  }
}

/* 모바일에서 더 작은 글꼴 사용 */
@media (max-width: 640px) {
  .text-sm {
    font-size: 0.875rem;
  }

  .text-lg {
    font-size: 1rem;
  }

  .text-xl {
    font-size: 1.125rem;
  }
}
</style>

<script>
import { ref, onMounted, computed } from 'vue';
import api from '@/plugins/axios';
import Pagination from '@/components/pagination.vue';
import ListItem from '@/components/listItem.vue';
import moment from 'moment';
import Hero from '@/components/hero.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default {
  components: {
    Pagination,
    ListItem,
    Hero,
    FontAwesomeIcon,
  },
  setup() {
    const issues = ref([]);
    const currentPage = ref(1);
    const issuesPerPage = 5;

    // API로 이슈 목록을 가져오는 함수
    const fetchIssues = async () => {
      try {
        const response = await api.get('/issue/all');
        issues.value = response.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      } catch (error) {
        console.error('Error fetching issues:', error);
      }
    };

    // 날짜 형식화 함수
    const formattedDate = (createdAt) => {
      const date = moment(createdAt);
      const hours = date.hours();
      const ampm = hours < 12 ? 'AM' : 'PM';
      return `${date.format('YYYY.MM.DD.')} ${
        hours % 12 || 12
      }:${date.minutes()} ${ampm}`;
    };

    // 이슈 설명 미리보기 함수
    const getPreview = (description) => {
      const maxLength = 20;
      return description.length > maxLength
        ? description.slice(0, maxLength) + '...'
        : description;
    };

    // 해결중 이슈 목록
    const unresolvedIssues = computed(() => {
      return issues.value.filter(issue => !issue.response); // response가 없으면 해결중
    });

    // 해결된 이슈 목록
    const resolvedIssues = computed(() => {
      return issues.value.filter(issue => issue.response); // response가 있으면 해결됨
    });

    // 페이지네이션 관련 계산 속성
    const paginatedIssues = computed(() => {
      const startIndex = (currentPage.value - 1) * issuesPerPage;
      const endIndex = startIndex + issuesPerPage;
      return unresolvedIssues.value.slice(startIndex, endIndex); // 해결중만 페이지네이션 처리
    });

    const totalPages = computed(() =>
      Math.ceil(unresolvedIssues.value.length / issuesPerPage) // 해결중만 총 페이지 계산
    );

    // 페이지 변경 함수
    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
      }
    };

    // 컴포넌트가 마운트되면 이슈 목록 가져오기
    onMounted(fetchIssues);

    return {
      issues,
      currentPage,
      issuesPerPage,
      paginatedIssues,
      totalPages,
      unresolvedIssues,
      resolvedIssues,
      formattedDate,
      getPreview,
      changePage,
    };
  },
};
</script>
