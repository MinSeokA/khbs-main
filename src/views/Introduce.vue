<template>
    <Hero>
        <template #head-txt>소개</template>
    </Hero>
    <div class="max-w-screen-lg mx-auto px-4">
        
        <p class="mb-4 mt-10 text-xl font-semibold">임원</p>
        <!-- 구분선 -->
        <hr class="h-px border-0 mb-10 bg-gray-700">
        <!-- 카드 그리드 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- 왼쪽 열 -->
            <div v-for="(member, index) in leftColumn" :key="index"
                class="bg-gray-800 shadow-md rounded-lg p-6 flex items-center space-x-4">
                <div>
                    <h3 class="text-xl font-semibold">{{ member.name }}</h3>
                    <p class="text-gray-400">{{ member.position }}</p>
                </div>
            </div>
        </div>
        <p class="mb-4 mt-10 text-xl font-semibold">역대 임원</p>
        <!-- 구분선 -->
        <hr class="h-px border-0 mb-10 bg-gray-700">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-7">
            <!-- 오른쪽 열 -->
            <div v-for="(member, index) in rightColumn" :key="index"
                class="bg-gray-800 shadow-md rounded-lg p-6 flex items-center space-x-4">
                <div>
                    <h3 class="text-xl font-semibold">{{ member.name }}</h3>
                    <p class="text-gray-400">{{ member.position }}</p>
                </div>
            </div>
        </div>
        <p class="mb-4 mt-10 text-xl font-semibold">방송 채널</p>
        <!-- 구분선 -->
        <hr class="h-px border-0 mb-10 bg-gray-700">
        <!-- 카드 그리드 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- 왼쪽 열 -->
            <div
                class="bg-gray-800 shadow-md rounded-lg p-6 flex items-center space-x-4">
                <div>
                    <h3 class="text-xl font-semibold">CH 4-1</h3>
                </div>
            </div>
            <div
                class="bg-gray-800 shadow-md rounded-lg p-6 flex items-center space-x-4">
                <div>
                    <h3 class="text-xl font-semibold">CH 10-1</h3>
                </div>
            </div>
            <div
                class="bg-gray-800 shadow-md rounded-lg p-6 flex items-center space-x-4">
                <div>
                    <h3 class="text-xl font-semibold">CH 14-1</h3>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Hero from '@/components/hero.vue';
export default {
    components: {
        Hero,
    },
    data() {
        return {
            leftColumn: [
                { name: '박지웅', position: '2024학년도 부장' },
                { name: '양준석', position: '2024학년도 차장' },
            ],
            rightColumn: [
                { name: '윤민규', position: '2023학년도 부장' },
                { name: '손지민', position: '2023학년도 차장, 2022학년도 2학기 차장 대행' },
                { name: '김창서', position: '2022학년도 2학기 부장 대행' },
            ],
        };
    },
};
</script>