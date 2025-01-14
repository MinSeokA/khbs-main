<template>
    <Hero>
        <template #head-txt>방송 일정</template>
    </Hero>
    <div class="p-4 max-w-screen-md mx-auto">
        <div v-for="(items, date) in groupedSchedules" :key="date" class="mb-8">
            <h2 class="text-lg font-bold text-gray-100">{{ formatDate(date) }}</h2>
            <div v-for="schedule in items" :key="schedule._id" class="mx-2 bg-gray-700 rounded mt-2 p-4">
                <h2 class="text-xl font-semibold"><span v-if="schedule.period">{{ schedule.period }}교시 </span>{{ schedule.title }}</h2>
            </div>
        </div>
    </div>
</template>

<script>
import api from "@/plugins/axios";
import Hero from "@/components/hero.vue";

export default {
    components: {
        Hero,
    },
    data() {
        return {
            schedules: [],
        };
    },
    computed: {
        groupedSchedules() {
            const groups = {};

            // 날짜별로 그룹화
            this.schedules.forEach((schedule) => {
                const date = schedule.date.split("T")[0]; // 'YYYY-MM-DD' 형식으로 날짜 추출
                if (!groups[date]) {
                    groups[date] = [];
                }
                groups[date].push(schedule);
            });

            return groups;
        },
    },
    methods: {
        formatDate(date) {
            const d = new Date(date);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");
            return `${year}.${month}.${day}.`;
        },
        async fetchSchedules() {
            try {
                const response = await api.get("/schedules");
                this.schedules = response.data.map((item) => ({
                    ...item,
                    period: item.period || "", // 교시 정보가 없을 경우 빈 문자열로 설정
                }));
            } catch (error) {
                console.error("Failed to load schedules:", error);
            }
        },
    },
    created() {
        this.fetchSchedules();
    },
};
</script>

<style scoped>
/* 필요한 스타일 추가 가능 */
</style>