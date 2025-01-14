<script setup>
import hero from '@/components/hero.vue';
import api from '@/plugins/axios';  // axios 인스턴스를 가져옵니다.
import moment from 'moment';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useHead } from '@vueuse/head';

const issue = ref({});
const route = useRoute();

const formattedDate = (createdAt) => {
    const date = moment(createdAt);
    const hours = date.hours();
    const ampm = hours < 12 ? '오전' : '오후';
    return `${date.format('YYYY년 MM월 DD일')} ${ampm} ${hours % 12 || 12}시 ${date.minutes()}분`;
};

// API 데이터를 기반으로 meta 정보를 동적으로 업데이트
const updateMetaTags = () => {
    if (issue.value.title) {
        useHead({
            title: `${issue.value.title} | 경기고등학교 방송부`,
            meta: [
                { property: 'og:title', content: issue.value.title },
                { property: 'og:description', content: issue.value.content.substring(0, 100) },
                { property: 'og:url', content: window.location.href }
            ]
        });
    }
};

// 공지사항 데이터를 API에서 가져오는 함수
const fetchNotice = async () => {
    const issueId = route.params.id;
    try {
        const response = await api.get(`/issue/view/${issueId}`);
        issue.value = response.data.data;
        updateMetaTags(); // 데이터를 기반으로 meta 태그 업데이트
    } catch (error) {
        console.error('Error fetching the issue:', error);
    }
};

onMounted(fetchNotice);
</script>

<template>
    <hero>
        <template #head-txt>문의</template>
    </hero>
    <main class="container max-w-screen-md mx-auto p-4 bg-gray-900 text-white rounded-lg shadow-lg">
        <!-- 제목 -->
        <h1 class="text-xl md:text-2xl font-bold text-start mb-4 text-gray-100">{{ issue.title }}</h1>

        <!-- 작성자와 날짜 -->
        <div class="text-sm md:text-base text-gray-400 mb-5 flex items-center">
            <span class="font-semibold">{{ issue.location }}</span>
            <span class="mx-2">|</span>
            <span>{{ formattedDate(issue.createAt) }}</span>
        </div>

        <!-- 문의 내용 (채팅 스타일) -->
        <div class="mb-5 bg-gray-800 p-3 rounded-lg">
            <div class="flex items-center mb-2">
                <!-- 문의 아이콘 -->
                <i class="fas fa-question-circle text-gray-300 mr-2"></i>
                <p class="text-md font-semibold text-gray-300">문의 내용</p>
            </div>
            <p class="text-sm leading-relaxed text-gray-300 whitespace-pre-line break-keep" v-html="issue.description"></p>
        </div>

        <!-- 문의 답변 (채팅 스타일) -->
        <div v-if="issue.response" class="bg-gray-700 p-3 rounded-lg mt-5">
            <div class="flex items-center mb-2">
                <!-- 답변 아이콘 -->
                <i class="fas fa-comment-dots text-gray-300 mr-2"></i>
                <p class="text-md font-semibold text-gray-300">답변 내용</p>
            </div>
            <p class="text-sm leading-relaxed text-gray-300 whitespace-pre-line break-keep">
                {{ issue.response }}
            </p>
        </div>
        <!-- 답변이 없을 경우, 다른 메시지로 대체 -->
        <div v-else class="bg-gray-700 p-3 rounded-lg mt-5">
            <div class="flex items-center mb-2">
                <!-- 답변이 없을 때 아이콘 (예: 정보 아이콘) -->
                <i class="fas fa-info-circle text-gray-300 mr-2"></i>
                <p class="text-md font-semibold text-gray-300">답변 대기 중</p>
            </div>
            <p class="text-sm leading-relaxed text-gray-300 whitespace-pre-line break-keep">
                답변이 아직 작성되지 않았습니다. 조금만 기다려 주세요.
            </p>
        </div>
    </main>
</template>
