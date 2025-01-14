<template>
    <Hero>
        <template #head-txt>공지사항</template>
    </Hero>
    <h1 v-if="notices.length === 0" class="text-2xl text-center font-bold text-gray-600 dark:text-white">
      No Notices are found
    </h1>
  
    <main v-else class="space-y-3">
      <RouterLink v-for="notice in paginatedNotices" :key="notice.id" :to="`/notice/` + notice.id" class="block">
        <ListItem :title="notice.title" :descOne="getPreview(notice.content)"
                  :date="formattedDate(notice.createDate)" :author="notice.author">
          <template #img>
            <div v-if="notice.banner_image" class="h-20 w-20">
              <img :src="notice.banner_image" alt="notice image"
                   class="h-full w-full object-cover rounded dark:shadow-gray-800"
                   @error="notice.banner_image = ''" />
            </div>
          </template>
        </ListItem>
      </RouterLink>
  
      <Pagination :totalItems="notices.length" :current-page="currentPage" :items-per-page="noticesPerPage"
                  @page-changed="changePage" class="mt-8" />
    </main>
  </template>
  
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
          notices.value = response.data.data.sort(
            (a, b) => new Date(b.createDate) - new Date(a.createDate)
          );
        } catch (error) {
          console.error('Error fetching notices:', error);
        }
      };
  
      const formattedDate = (createDate) => {
        const date = moment(createDate);
        const hours = date.hours();
        const ampm = hours < 12 ? 'AM' : 'PM';
        return `${date.format('YYYY.MM.DD.')} ${hours % 12 || 12}:${date.minutes()} ${ampm}`;
      };
  
      const getPreview = (content) => {
        const maxLength = 20;
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
  
  <style scoped>
  /* 필요한 스타일 추가 */
  </style>
  