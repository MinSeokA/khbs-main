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
    <main class="container max-w-screen-md mx-auto p-6">
        <!-- 제목 -->
        <h1 class="text-2xl md:text-3xl font-bold text-start mb-4 break-words">{{ notice.title }}</h1>

        <!-- 작성자와 날짜 -->
        <div class="text-base md:text-lg text-gray-400 mb-4 flex items-center">
            <span class="font-semibold">{{ notice.author }}</span>
            <span class="mx-3">|</span>
            <span>{{ formattedDate(notice.createdAt) }}</span>
        </div>

        <!-- 구분선 -->
        <hr class="h-px border-0 my-6 bg-gray-700">

        <!-- 이미지 -->
        <div v-if="notice.banner_image" class="w-full max-w-lg h-full mx-auto overflow-hidden rounded-md mb-6">
            <img 
                :src="notice.banner_image" 
                alt="notice image" 
                class="w-full h-full object-cover" 
                @error="notice.banner_image = ''"
            />
        </div>

        <!-- 내용 -->
        <p class="text-lg leading-relaxed whitespace-pre-wrap break-keep text-gray-300" v-html="notice.content">
        </p>
    </main>
</template>
