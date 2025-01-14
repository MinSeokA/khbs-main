<template>
    <Hero>
        <template #head-txt>공지사항 관리</template>
    </Hero>
    <section class="p-6 bg-gray-900 max-w-screen-lg mx-auto rounded-lg shadow-lg">
        <!-- 공지사항 관리 버튼 -->
        <div class="flex items-center justify-between mb-6">
            <h3 class="text-white text-xl font-semibold">공지사항 관리</h3>
            <button @click="showNoticeModal = true" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 transition">
                공지사항 등록
            </button>
        </div>

        <!-- 스크롤 가능 팁 -->
        <div class="relative mb-4 bg-gray-900 p-2 rounded-md shadow-md">
            <p class="text-gray-300 text-xs">목록 부분에서는 스크롤이 가능합니다.</p>
        </div>
        
        <!-- 공지사항 목록 -->
        <div v-if="notices.length > 0" class="max-h-[calc(50vh-50px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 relative" @scroll="handleScroll">
            <div v-for="(notice, index) in notices" :key="notice.id" 
                 :class="{ 'bg-gray-700': highlightedIndex === index }" 
                 class="p-4 rounded-lg mb-4 shadow-md flex flex-col sm:flex-row justify-between items-center">
                <div>
                    <h4 class="text-lg font-semibold text-white">{{ notice.title }}</h4>
                    <p class="text-gray-400 text-sm">{{ formatDate(notice.createdAt) }}</p>
                    <p class="text-gray-300 text-sm">{{ notice.content }}</p>
                </div>
                <div class="mt-4 sm:mt-0">
                    <button @click="deleteNotice(notice.id)" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400 transition">삭제</button>
                </div>
            </div>
        </div>

        <!-- 공지사항 없음 -->
        <p v-else-if="notices.length === 0" class="text-gray-500 mt-4 text-center">아직 등록된 공지사항이 없습니다.</p>

        <!-- 공지사항 등록 모달 -->
        <transition name="modal">
            <div v-if="showNoticeModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div class="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
                    <h3 class="text-white text-2xl mb-4">공지사항 등록</h3>
                    <input v-model="newNotice.title" placeholder="제목" class="bg-gray-700 border-gray-600 p-4 rounded-md w-full mb-4" />
                    <textarea v-model="newNotice.content" placeholder="내용" class="bg-gray-700 border-gray-600 p-4 rounded-md w-full mb-4"></textarea>
                    <div class="flex justify-between space-x-2">
                        <button @click="showNoticeModal = false" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-400 transition">취소</button>
                        <button @click="addNotice" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400 transition">등록하기</button>
                    </div>
                </div>
            </div>
        </transition>
    </section>
</template>

<script>
import Hero from "@/components/hero.vue";
import api from "@/plugins/axios";

export default {
    components: {
        Hero,
    },
    data() {
        return {
            notices: [],
            showNoticeModal: false,
            newNotice: { title: "", content: "", author: "관리자" },
            highlightedIndex: null, // 하이라이트된 인덱스
        };
    },
    methods: {
        handleLogout() {
            localStorage.removeItem("token"); // 토큰 삭제
            this.$router.push({ name: "Login" }); // 로그인 페이지로 이동
        },
        async fetchNotices() {
            try {
                const response = await api.get("/notice/all");
                this.notices = response.data.data;
            } catch (error) {
                console.error("Failed to load notices:", error);
            }
        },
        async addNotice() {
            try {
                await api.post("/notice", this.newNotice);
                this.fetchNotices(); // 업데이트된 목록 가져오기
                this.newNotice = { title: "", content: "" }; // 입력 초기화
                this.showNoticeModal = false;
            } catch (error) {
                console.error("Failed to add notice:", error);
            }
        },
        async deleteNotice(id) {
            try {
                await api.delete(`/notice/${id}`);
                this.fetchNotices(); // 업데이트된 목록 가져오기
            } catch (error) {
                console.error("Failed to delete notice:", error);
            }
        },
        formatDate(date) {
            return new Date(date).toLocaleDateString();
        },
        handleScroll(event) {
            const scrollTop = event.target.scrollTop;
            const scrollHeight = event.target.scrollHeight - event.target.clientHeight;
            this.highlightedIndex = Math.min(Math.floor(scrollTop / (scrollHeight / this.notices.length)), this.notices.length - 1);
        }
    },
    created() {
        this.fetchNotices();
    },
};
</script>
