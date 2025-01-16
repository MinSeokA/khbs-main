<template>
  <Hero>
    <template #head-txt>공지사항</template>
  </Hero>

  <div v-if="notices.length === 0" class="flex justify-center items-center py-10">
    <h1 class="text-xl font-semibold text-gray-600 dark:text-white">
      No Notices are found
    </h1>
  </div>

  <main v-else class=" justify-center items-center " style="width: 50%; margin: auto; max-width: 1200px;">
    <div v-for="notice in paginatedNotices" :key="notice.id" class="rounded-lg shadow-md overflow-hidden w-full">
      <RouterLink 
        :to="`/notice/` + notice.id" 
        class="block hover:bg-gray-100 transition-all hover:text-primary dark:hover:bg-gray-700"
      >
        <div class="flex items-center p-3 space-x-4" style="max-width: 100%; overflow: hidden;">
          <div v-if="notice.banner_image" class="flex-shrink-0" style="width: 70px; height: 70px; margin-right: 12px;">
            <img 
              :src="notice.banner_image" 
              alt="notice image"
              class="h-full w-full object-cover rounded-lg shadow-sm"
              @error="notice.banner_image = ''"
              style="max-width: 70px; max-height: 70px; object-fit: cover;"
            />
          </div>
          <div class="flex-1">
            <h2 class="text-lg font-semibold text-white dark:text-white" style="font-size: 16px; line-height: 20px;">{{ notice.title }}</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400" style="font-size: 14px; line-height: 18px;">{{ getPreview(notice.content) }}</p>
            <div class="mt-1 text-xs text-gray-400" style="font-size: 12px;">
              <span>{{ formattedDate(notice.createdAt) }}</span> · 
              <span class="font-medium">{{ notice.author }}</span>
            </div>
          </div>
        </div>
      </RouterLink>
      <!-- 구분선 추가, 색상 및 두께 조정 -->
      <div class="border-b border-gray-300 dark:border-gray-600"></div>
    </div>

    <Pagination 
      :totalItems="notices.length"
      :current-page="currentPage"
      :items-per-page="noticesPerPage"
      @page-changed="changePage"
      class="mt-6"
    />
  </main>
</template>

<style scoped>
/* 호버 시 글씨 색상 변경 */
.hover\:text-primary:hover {
  color: #4CAF50; /* 예시로 초록색 지정, 원하는 색으로 변경 가능 */
}

/* 목록 구분선 스타일 */
.border-b {
  border-bottom-width: 1px;
  border-color: #e5e7eb; /* 연한 회색으로 구분선 색상 변경 */
}

/* 다크모드 구분선 색상 */
.dark\:border-gray-600 {
  border-color: #4a5568; /* 다크모드에서는 진한 회색으로 설정 */
}

/* 호버 시 배경 색상 변경 */
.dark\:hover\:bg-gray-700:hover {
  background-color: #2d3748;
}

/* 목록 내용 고정 크기 설정 */
.list-item-wrapper {
  width: 100%;
  height: 150px; /* 고정된 높이 */
  overflow: hidden;
}
</style>


<script>
import { ref, onMounted, computed } from 'vue';
import api from "@/plugins/axios";
import Pagination from '@/components/pagination.vue';
import ListItem from "@/components/listItem.vue";
import moment from 'moment';
import Hero from '@/components/hero.vue'

export default {
  components: {
    Pagination,
    ListItem,
    Hero
  },
  setup() {
    const notices = ref([]);
    const currentPage = ref(1);
    const noticesPerPage = 5;

    const fetchNotices = async () => {
      try {
        const response = await api.get('/notice/all');
        // 최신순으로 정렬
        notices.value = response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
      } catch (error) {
        console.error('Error fetching notices:', error);
      }
    };

    const formattedDate = (createDate) => {
      const date = moment(createDate);
      const hours = date.hours();
      const ampm = hours < 12 ? '오전' : '오후';
      return `${date.format('YYYY년 MM월 DD일')} ${ampm} ${hours % 12 || 12}:${date.minutes() < 10 ? '0' : ''}${date.minutes()}`;
    };

    const getPreview = (content) => {
      const maxLength = 40;
      return content.length > maxLength ? content.slice(0, maxLength) + '...' : content;
    };

    const paginatedNotices = computed(() => {
      const startIndex = (currentPage.value - 1) * noticesPerPage;
      const endIndex = startIndex + noticesPerPage;
      return notices.value.slice(startIndex, endIndex);
    });

    const totalPages = computed(() => Math.ceil(notices.value.length / noticesPerPage));

    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
      }
    };

    onMounted(fetchNotices);

    return {
      notices,
      currentPage,
      noticesPerPage,
      paginatedNotices,
      formattedDate,
      getPreview,
      changePage,
    };
  },
};
</script>
