<template>
    <Hero>
        <template #head-txt>신청곡 관리</template>
    </Hero>
    <section class="mb-10 max-w-screen-md mx-auto">
        <div v-if="songs.length > 0">
            <div v-for="song in songs" :key="song._id" class="my-4 p-4 bg-gray-800 rounded">
                <h3 class="text-xl font-semibold mb-2">{{ song.title }} - {{ song.artist }}</h3>
                <p>신청자: {{ song.author }}</p>
                <!-- 답변 상태 표시 -->
                <p v-if="song.done === true" class="text-green-600 font-semibold my-2">재생완료</p>
                <p v-else class="text-red-600 font-semibold my-2">미승인</p>
                <button v-if="song.done === false" @click="doneSong(song._id)" class="bg-blue-500 text-white px-3 py-2 mt-3 mr-4 rounded">
                    승인하기
                </button>
                <button v-if="song.done === true" @click="cancelSong(song._id)" class="bg-red-500 text-white px-3 py-2 mt-3 mr-4 rounded">
                    승인취소
                </button>
                <button @click="deleteSong(song._id)" class="bg-red-500 text-white px-3 py-2 mt-3 rounded">
                    삭제하기
                </button>
            </div>
        </div>
        <p v-else class="text-gray-500 mt-4">Loading songs or no notices available.</p>
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
            songs: [],
        };
    },
    methods: {
        handleLogout() {
            localStorage.removeItem("token"); // 토큰 삭제
            this.$router.push({ name: "Login" }); // 로그인 페이지로 이동
        },
        async fetchSongs() {
            try {
                const response = await api.get("/songs");
                this.songs = response.data;
            } catch (error) {
                console.error("Failed to load notices:", error);
            }
        },
        async doneSong(id) {
            try {
                await api.put(`/songs/${id}`, { done: true });
                this.fetchSongs(); // 업데이트된 목록 가져오기
            } catch (error) {
                console.error("Failed to update song:", error);
            }
        },
        async cancelSong(id) {
            try {
                await api.put(`/songs/${id}`, { done: false });
                this.fetchSongs(); // 업데이트된 목록 가져오기
            } catch (error) {
                console.error("Failed to update song:", error);
            }
        },
        async deleteSong(id) {
            try {
                await api.delete(`/songs/${id}`);
                this.fetchNotices(); // 업데이트된 목록 가져오기
            } catch (error) {
                console.error("Failed to delete song:", error);
            }
        },
        formatDate(date) {
            return new Date(date).toLocaleDateString();
        },
    },
    created() {
        this.fetchSongs();
    },
};
</script>