<script setup>
import hero from '@/components/hero.vue';
import api from '@/plugins/axios';  // axios 인스턴스를 가져옵니다.
import moment from 'moment';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useHead } from '@vueuse/head';

const notice = ref({});
const route = useRoute();

const formattedDate = (createdAt) => {
    const date = moment(createdAt);
    const hours = date.hours();
    const ampm = hours < 12 ? '오전' : '오후';
    return `${date.format('YYYY년 MM월 DD일')} ${ampm} ${hours % 12 || 12}시 ${date.minutes()}분`;
};

// API 데이터를 기반으로 meta 정보를 동적으로 업데이트
const updateMetaTags = () => {
    if (notice.value.title) {
        useHead({
            title: `${notice.value.title} | 경기고등학교 방송부`,
            meta: [
                { property: 'og:title', content: notice.value.title },
                { property: 'og:description', content: notice.value.content.substring(0, 100) },
                { property: 'og:image', content: notice.value.banner_image },
                { property: 'og:url', content: window.location.href }
            ]
        });
    }
};

// 공지사항 데이터를 API에서 가져오는 함수
const fetchNotice = async () => {
    const noticeId = route.params.id;
    try {
        const response = await api.get(`/notice/view/${noticeId}`);
        notice.value = response.data.data;
        updateMetaTags(); // 데이터를 기반으로 meta 태그 업데이트
    } catch (error) {
        console.error('Error fetching the notice:', error);
    }
};

onMounted(fetchNotice);
</script>

<template>
    <hero>
        <template #head-txt>공지사항</template>
    </hero>
    <main class="container mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
        <!-- 제목 -->
        <h1 class="text-4xl font-extrabold text-gray-100 mb-6 break-words">{{ notice.title }}</h1>

        <!-- 작성자와 날짜 -->
        <div class="text-lg text-gray-400 mb-4 flex items-center space-x-3">
            <span class="font-semibold">{{ notice.author }}</span>
            <span class="text-gray-500">|</span>
            <span>{{ formattedDate(notice.createdAt) }}</span>
        </div>

        <!-- 구분선 -->
        <hr class="border-t border-gray-600 my-6">

        <!-- 이미지 -->
        <div v-if="notice.banner_image" class="w-full max-w-lg h-full mx-auto overflow-hidden rounded-xl mb-6 shadow-lg">
            <img 
                :src="notice.banner_image" 
                alt="notice image" 
                class="w-full h-full object-cover rounded-xl transition-transform duration-300 transform hover:scale-105"
                @error="notice.banner_image = ''"
            />
        </div>

        <!-- 내용 -->
        <p class="text-lg leading-relaxed text-gray-300 whitespace-pre-wrap break-keep mb-8" v-html="notice.content">
        </p>

        <!-- 댓글 섹션 -->
        <div class="bg-gray-700 p-6 rounded-lg shadow-md mt-8">
            <h2 class="text-xl text-white mb-4">댓글</h2>
            <textarea 
                class="w-full p-4 rounded-md bg-gray-600 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200" 
                placeholder="댓글을 남겨보세요..." 
                rows="4"
            ></textarea>
            <button class="mt-4 bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition duration-300">
                댓글 남기기
            </button>
        </div>
    </main>
</template>

<style scoped>
/* 새로운 스타일 */

.container {
  max-width: 900px;
}

h1 {
  font-size: 2.5rem;
  color: #e5e7eb; /* Light Gray */
}

.text-lg {
  font-size: 1.125rem;
}

.text-base {
  font-size: 1rem;
}

.text-gray-400 {
  color: #9ca3af; /* Light Gray */
}

.text-gray-500 {
  color: #6b7280; /* Gray 500 */
}

hr {
  background-color: #4b5563; /* Gray 600 */
}

img {
  transition: transform 0.3s ease-in-out;
}

img:hover {
  transform: scale(1.05);
}

button {
  background-color: #4f46e5; /* Indigo 600 */
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  transition: background-color 0.3s ease-in-out;
}

button:hover {
  background-color: #4338ca; /* Indigo 700 */
}

/* 댓글 섹션 */
textarea {
  background-color: #374151; /* Dark Gray */
  color: #e5e7eb; /* Light Gray */
}

textarea::placeholder {
  color: #9ca3af; /* Light placeholder */
}

textarea:focus {
  background-color: #2d3748; /* Even darker gray */
}

button {
  background-color: #4f46e5; /* Indigo 600 */
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  transition: background-color 0.3s ease-in-out;
}

button:hover {
  background-color: #4338ca; /* Indigo 700 */
}

@media (max-width: 768px) {
  .container {
    padding: 2rem;
  }

  h1 {
    font-size: 2rem;
  }

  .text-lg {
    font-size: 1rem;
  }
}
</style>
