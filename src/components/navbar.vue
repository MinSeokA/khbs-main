<template>
    <nav class= "bg-gray-900 shadow-lg">
      <div class="container mx-auto flex items-center justify-between px-6 py-4">
        <!-- 로고 -->
        <RouterLink to="/" class="flex items-center">
          <img
            src="https://cdn.lunaiz.com/kghs/khbs.svg"
            alt="khbs logo"
            class="w-32 hover:scale-105 transition-transform duration-300"
          />
        </RouterLink>
  
        <!-- 데스크톱 메뉴 -->
        <div class="hidden md:flex space-x-8">
          <RouterLink
            v-for="item in navItems"
            :key="item.name"
            :to="item.link"
            class="text-white font-semibold text-lg relative group hover:text-yellow-300"
          >
            <span
              class="absolute inset-x-0 -bottom-1 h-0.5 bg-yellow-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
            ></span>
            {{ item.name }}
          </RouterLink>
        </div>
  
        <!-- 모바일 메뉴 버튼 -->
        <button
          @click="toggleMobileMenu"
          class="md:hidden text-white focus:outline-none"
          aria-label="Toggle navigation"
        >
          <svg
            v-if="!isMobileMenuOpen"
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
  
        <!-- 모바일 메뉴 -->
        <div
          :class="['fixed inset-0 bg-black bg-opacity-75 z-50 flex flex-col items-center justify-center', isMobileMenuOpen ? 'block' : 'hidden']"
        >
          <button
            @click="toggleMobileMenu"
            class="absolute top-5 right-5 text-white focus:outline-none"
            aria-label="Close navigation"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
  
          <ul class="space-y-6 text-white text-xl font-semibold">
            <li
              v-for="item in navItems"
              :key="item.name"
              @click="toggleMobileMenu"
            >
              <RouterLink
                :to="item.link"
                class="hover:text-yellow-300 transition-colors"
              >
                {{ item.name }}
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  import { ref } from "vue";
  import { RouterLink } from "vue-router";
  
  export default {
    setup() {
      const isMobileMenuOpen = ref(false);
  
      const toggleMobileMenu = () => {
        isMobileMenuOpen.value = !isMobileMenuOpen.value;
      };
  
      const navItems = [
        { name: "소개", link: "/introduce" },
        { name: "신청곡", link: "/songrequest" },
        { name: "방송 일정", link: "/schedule" },
        { name: "공지사항", link: "/notices" },
        { name: "문제 신고", link: "/issue" },
      ];
  
      return { isMobileMenuOpen, toggleMobileMenu, navItems };
    },
  };
  </script>
  
  <style scoped>
  nav a {
    transition: color 0.3s ease;
  }
  
  nav a:hover {
    color: #facc15; /* Neon yellow */
  }
  
  nav ul li {
    position: relative;
  }
  
  nav ul li span {
    transition: transform 0.3s ease-in-out;
  }
  
  nav ul li:hover span {
    transform: scaleX(1);
  }
  </style>
  