<template>
    <Hero>
        <template #head-txt>방송일정 관리</template>
    </Hero>
    <section class="max-w-screen-md mx-auto mb-10">
        <button @click="showScheduleForm = !showScheduleForm" class="bg-blue-500 text-white px-4 py-2 rounded">
            {{ showScheduleForm ? "Cancel" : "Add Schedule" }}
        </button>

        <div v-if="showScheduleForm" class="my-4 p-4 bg-gray-800 rounded">
            <input v-model="newSchedule.title" placeholder="방송 제목" class="bg-gray-700 border-gray-600 p-2 border rounded w-full mb-2" />
            <input v-model="newSchedule.period" placeholder="교시" class="bg-gray-700 border-gray-600 p-2 border rounded w-full mb-2" />
            <input v-model="newSchedule.date" type="date" max="9999-12-31" class="bg-gray-700 border-gray-600 p-2 border rounded w-full mb-2" />
            <button @click="addSchedule" class="bg-green-500 text-white px-4 py-2 rounded">Save Schedule</button>
        </div>

        <div v-for="schedule in schedules" :key="schedule._id" class="my-4 p-4 bg-gray-800 rounded">
            <h3 class="text-xl font-semibold"><span v-if="schedule.period">{{ schedule.period }}교시 </span>{{ schedule.title }}</h3>
            <p>{{ formatDisplayDate(schedule.date) }}</p>
            <button @click="deleteSchedule(schedule._id)" class="bg-red-500 text-white px-3 py-1 mt-2 rounded">
                Delete
            </button>
        </div>
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
            schedules: [],
            showScheduleForm: false,
            newSchedule: { title: "", period: "", date: "", author: "관리자" },
        };
    },
    methods: {
        handleLogout() {
            localStorage.removeItem("token"); // 토큰 삭제
            this.$router.push({ name: "Login" }); // 로그인 페이지로 이동
        },
        async fetchSchedules() {
            try {
                const response = await api.get("/schedules");
                this.schedules = response.data;
            } catch (error) {
                console.error("Failed to load schedules:", error);
            }
        },
        async addSchedule() {
            try {
                await api.post("/schedules", this.newSchedule);
                this.fetchSchedules(); // 업데이트된 목록 가져오기
                this.newSchedule = { title: "", period: "", date: "" }; // 입력 초기화
                this.showScheduleForm = false;
            } catch (error) {
                console.error("Failed to add schedule:", error);
            }
        },
        async deleteSchedule(id) {
            try {
                await api.delete(`/schedules/${id}`);
                this.fetchSchedules(); // 업데이트된 목록 가져오기
            } catch (error) {
                console.error("Failed to delete schedule:", error);
            }
        },
        formatDisplayDate(date) {
            const parsedDate = new Date(date);
            const year = parsedDate.getFullYear();
            const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
            const day = String(parsedDate.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
    },
    created() {
        this.fetchSchedules();
    },
};
</script>