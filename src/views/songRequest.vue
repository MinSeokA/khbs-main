<script setup>
import { ref } from 'vue';
import api from '@/plugins/axios';
import Hero from '@/components/hero.vue';

const songTitle = ref('');
const songArtist = ref('');
const songRequester = ref(''); // 문의 위치
const submissionStatus = ref(''); // 제출 상태 메시지

const submitIssue = async () => {
    if (!songTitle.value || !songArtist.value || !songRequester.value) {
        submissionStatus.value = '모든 필드를 입력해 주세요.';
        return;
    }

    try {
        const response = await api.post('/songs', {
            title: songTitle.value,
            artist: songArtist.value,
            author: songRequester.value,
        });
        if (response.status === 201) {
            submissionStatus.value = '신청곡이 성공적으로 접수되었습니다.';
            songTitle.value = '';
            songArtist.value = '';
            songRequester.value = '';
        }
    } catch (error) {
        console.error('Error submitting issue:', error);
        submissionStatus.value = '신청곡 접수 중 오류가 발생했습니다.';
    }
};
</script>

<template>
    <main class="container max-w-screen-md mx-auto p-6 text-white">
        <Hero>
        <template #head-txt>신청곡 신청하기</template>
    </Hero>

        <!-- 문제 신고 폼 -->
        <div class="md:p-6 p-2 ">
            <div class="mb-4">
                <label for="title" class="block text-lg font-semibold mb-2">제목</label>
                <input 
                    type="text" 
                    id="title" 
                    v-model="songTitle" 
                    class="w-full p-2 border rounded bg-gray-700 border-gray-600 text-white" 
                    placeholder="제목을 입력하세요"
                />
            </div>
            <div class="mb-4">
                <label for="artist" class="block text-lg font-semibold mb-2">아티스트</label>
                <input 
                    type="text" 
                    id="artist" 
                    v-model="songArtist" 
                    class="w-full p-2 border rounded bg-gray-700 border-gray-600 text-white" 
                    placeholder="아티스트를 입력하세요"
                />
            </div>
            <div class="mb-4">
                <label for="requester" class="block text-lg font-semibold mb-2">신청자</label>
                <input 
                    type="text" 
                    id="requester" 
                    v-model="songRequester" 
                    class="w-full p-2 border rounded bg-gray-700 border-gray-600 text-white" 
                    placeholder="신청자 이름을 알려주세요 (예: 홍길동)"
                />
            </div>
            <p class="my-4 text-red-400">이름을 정확히 입력하지 않은 경우 신청은 자동 반려됩니다</p>
            <button 
                @click="submitIssue" 
                class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
                제출하기
            </button>
            <p v-if="submissionStatus" class="mt-4 text-green-500 dark:text-green-400">{{ submissionStatus }}</p>
        </div>
    </main>
</template>
