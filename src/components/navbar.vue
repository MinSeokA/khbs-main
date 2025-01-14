<template>

    <nav class="border-gray-700">
        <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <RouterLink to="/" class="flex items-center rtl:space-x-reverse">
                <object data="https://cdn.lunaiz.com/kghs/khbs.svg" class="w-[7.5rem] md:hidden block" alt="khbs logo" style="pointer-events: none;">
                    <img src="https://cdn.lunaiz.com/kghs/khbs.svg" alt="khbs logo" />
                </object>
                <img src="https://cdn.lunaiz.com/kghs/khbs.svg" alt="khbs logo" class="w-[7.5rem] md:block hidden" />
            </RouterLink>
            <button data-collapse-toggle="navbar-coll" type="button"
                class="inline-flex items-center p-2 w-10 h-10 z-50 justify-center text-sm rounded-lg md:hidden text-gray-400 hover:bg-gray-700 focus:ring-gray-600"
                aria-controls="navbar-dropdown" aria-expanded="false">
                <span class="sr-only">open navbar menu</span>
                <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 17 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M1 1h15M1 7h15M1 13h15" />
                </svg>
            </button>

            <div class="hidden w-full md:block md:w-auto" id="navbar-coll">
                <ul
                    class="flex flex-col font-medium text-lg p-4 md:p-0 mt-4 border rounded md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0  bg-gray-800 md:bg-gray-900 border-gray-700">
                    <li>
                        <RouterLink to="/introduce" style="text-decoration: none!important"
                            class="block py-2 px-3 rounded md:border-0 md:p-0 no-underline hover:no-underline text-white md:hover:text-gray-300 hover:bg-gray-700 hover:text-white md:hover:bg-transparent">
                            소개</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/songrequest" style="text-decoration: none!important"
                            class="block py-2 px-3 rounded md:border-0 md:p-0 no-underline hover:no-underline text-white md:hover:text-gray-300 hover:bg-gray-700 hover:text-white md:hover:bg-transparent">
                            신청곡</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/schedule" style="text-decoration: none!important"
                            class="block py-2 px-3 rounded md:border-0 md:p-0 no-underline hover:no-underline text-white md:hover:text-gray-300 hover:bg-gray-700 hover:text-white md:hover:bg-transparent">
                            방송 일정</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/notices" style="text-decoration: none!important"
                            class="block py-2 px-3 rounded md:border-0 md:p-0 hover:no-underline text-white md:hover:text-gray-300 hover:bg-gray-700 hover:text-white md:hover:bg-transparent">
                            공지사항</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/issue"  style="text-decoration: none!important"
                            class="block py-2 px-3 rounded md:border-0 md:p-0 hover:no-underline text-white md:hover:text-gray-300 hover:bg-gray-700 hover:text-white md:hover:bg-transparent">
                            문제 신고</RouterLink>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
import { ref, computed } from "vue";
import { useRouter, RouterLink } from "vue-router";

export default {
    setup() {
        const router = useRouter();

        const logout = () => {
            localStorage.removeItem("token");
            router.push({ name: "Login" });
        };

        const isAdmin = computed(() => {
            const token = localStorage.getItem("token");
            if (!token) return false;
            // 실제 토큰에서 isAdmin을 확인하는 로직이 필요합니다.
            return true; // 이 예제에서는 임의로 true 설정
        });

        return { logout, isAdmin };
    },
};
</script>

<style scoped>
nav a {
    color: white;
    text-decoration: none;
}

nav a:hover {
    text-decoration: underline;
}
</style>