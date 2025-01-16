<template>
  <Hero>
    <template #head-txt>소개</template>
  </Hero>

  <div class="max-w-screen-lg mx-auto px-4 py-12">
    <!-- 임원 섹션 -->
    <section class="mb-12">
      <p class="text-2xl font-semibold text-white dark:text-white mb-6">
        임원
      </p>
      <!-- 구분선 -->
      <hr class="h-1 mb-8 bg-gray-800" />
      <!-- 카드 그리드 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          v-for="(member, index) in leftColumn"
          :key="index"
          class="bg-gray-800 shadow-md rounded-lg p-6 flex items-center space-x-4 relative group"
        >
          <!-- 카드 내용 -->
          <div>
            <h3 class="text-xl font-semibold text-white">{{ member.name }}</h3>
            <p class="text-gray-400">{{ member.position }}</p>
          </div>

          <!-- 포지션 툴팁 (애니메이션으로 위로 슬라이드) -->
          <div
            class="absolute top-0 left-1/2 transform -translate-x-1/2 mt-2 p-2 bg-gray-700 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-[-10px] transition-all duration-300"
          >
            {{ member.position }}
          </div>
        </div>
      </div>
    </section>

    <!-- 역대 임원 섹션 -->
    <section class="mb-12">
      <p class="text-2xl font-semibold text-white dark:text-white mb-6">
        역대 임원
      </p>
      <hr class="h-1 mb-8 bg-gray-800" />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-7">
        <div
          v-for="(member, index) in rightColumn"
          :key="index"
          class="bg-gray-800 shadow-md rounded-lg p-6 flex items-center space-x-4 relative group"
        >
          <div>
            <h3 class="text-xl font-semibold text-white">{{ member.name }}</h3>
            <p class="text-gray-400">{{ member.position }}</p>
          </div>
          <div
            class="absolute top-0 left-1/2 transform -translate-x-1/2 mt-2 p-2 bg-gray-700 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-[-10px] transition-all duration-300"
          >
            {{ member.position }}
          </div>
        </div>
      </div>
    </section>

    <!-- 방송 채널 섹션 -->
    <section class="mb-12">
      <p class="text-2xl font-semibold text-white dark:text-white mb-6">
        방송 채널
      </p>
      <hr class="h-1 mb-8 bg-gray-800" />
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- 첫 번째 카드 -->
        <div
          class="bg-gray-800 shadow-md rounded-lg p-6 flex items-center space-x-4 relative group"
        >
          <div class="relative">
            <h3 class="text-xl font-semibold text-white">CH 4-1</h3>
          </div>
          <!-- 문제 해결 텍스트가 카드 밖에 표시되도록 설정 -->
          <div
            class="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 p-4 bg-teal-700 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-[-10px] transition-all duration-300 w-full max-w-xs"
          >
            <!-- 채팅 스타일 디자인 -->
            <div
              class="bg-teal-500 p-3 rounded-lg text-white flex items-center space-x-2 pl-4 pr-4"
            >
              <i class="fas fa-comment-alt mr-2"></i>
              <span>문제 해결이 필요하시다면?</span>
            </div>
            <a
              href="https://cdn.lunaiz.com/kghs/Broadcast%20Solution.pdf"
              target="_blank"
              class="bg-teal-600 text-white py-2 px-4 rounded-full inline-block text-sm mt-2 hover:bg-teal-700 transition-all"
            >
              <i class="fas fa-book-open mr-2"></i> [보러가기]
            </a>
          </div>
        </div>

        <!-- 두 번째 카드 -->
        <div
          class="bg-gray-800 shadow-md rounded-lg p-6 flex items-center space-x-4 relative group"
        >
          <div class="relative">
            <h3 class="text-xl font-semibold text-white">CH 10-1</h3>
          </div>
          <!-- 문제 해결 텍스트가 카드 밖에 표시되도록 설정 -->
          <div
            class="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 p-4 bg-teal-700 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-[-10px] transition-all duration-300 w-full max-w-xs"
          >
            <!-- 채팅 스타일 디자인 -->
            <div
              class="bg-teal-500 p-3 rounded-lg text-white flex items-center space-x-2 pl-4 pr-4"
            >
              <i class="fas fa-comment-alt mr-2"></i>
              <span>문제 해결이 필요하시다면?</span>
            </div>
            <a
              href="https://cdn.lunaiz.com/kghs/Broadcast%20Solution.pdf"
              target="_blank"
              class="bg-teal-600 text-white py-2 px-4 rounded-full inline-block text-sm mt-2 hover:bg-teal-700 transition-all"
            >
              <i class="fas fa-book-open mr-2"></i> [보러가기]
            </a>
          </div>
        </div>

        <!-- 세 번째 카드 -->
        <div
          class="bg-gray-800 shadow-md rounded-lg p-6 flex items-center space-x-4 relative group"
        >
          <div class="relative">
            <h3 class="text-xl font-semibold text-white">CH 14-1</h3>
          </div>
          <!-- 문제 해결 텍스트가 카드 밖에 표시되도록 설정 -->
          <div
            class="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 p-4 bg-teal-700 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-[-10px] transition-all duration-300 w-full max-w-xs"
          >
            <!-- 채팅 스타일 디자인 -->
            <div
              class="bg-teal-500 p-3 rounded-lg text-white flex items-center space-x-2 pl-4 pr-4"
            >
              <i class="fas fa-comment-alt mr-2"></i>
              <span>문제 해결이 필요하시다면?</span>
            </div>
            <a
              href="https://cdn.lunaiz.com/kghs/Broadcast%20Solution.pdf"
              target="_blank"
              class="bg-teal-600 text-white py-2 px-4 rounded-full inline-block text-sm mt-2 hover:bg-teal-700 transition-all"
            >
              <i class="fas fa-book-open mr-2"></i> [보러가기]
            </a>
          </div>
        </div>
      </div>
    </section>
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
        {
          name: '손지민',
          position: '2023학년도 차장, 2022학년도 2학기 차장 대행',
        },
        { name: '김창서', position: '2022학년도 2학기 부장 대행' },
      ],
    };
  },
};
</script>
