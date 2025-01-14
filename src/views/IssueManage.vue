<template>
    <Hero>
        <template #head-txt>문의 관리</template>
    </Hero>
    <section class="mb-10 max-w-screen-md mx-auto">
        <div v-if="issues.length > 0">
            <div v-for="issue in issues" :key="issue.id" class="my-4 p-4 bg-gray-800 rounded">
                <h3 class="text-xl font-semibold mb-2">{{ issue.title }}</h3>
                <p>{{ issue.description }}</p>
                <p class="text-sm text-gray-500 mt-1">{{ issue.createAt }}</p>

                <!-- 답변 상태 표시 -->
                <p v-if="issue.response" class="text-green-600 font-semibold my-2">답변 있음</p>
                <p v-else class="text-red-600 font-semibold my-2">답변 없음</p>

                <!-- 답변 폼 토글 버튼 -->
                <button @click="toggleResponseForm(issue.id)" class="bg-blue-500 text-white px-4 py-2 mt-2 rounded">
                    {{ activeIssueId === issue.id ? "취소" : "답변하기" }}
                </button>
                <button @click="toggleDelete(issue.id)" class="bg-red-500 text-white px-4 py-2 mt-2 ml-5 rounded">
                    삭제하기
                </button>

                <!-- 답변 폼 -->
                <div v-if="activeIssueId === issue.id" class="my-4 p-4 bg-gray-700 rounded">
                    <textarea v-model="responseText" placeholder="답변"
                        class="p-2 border rounded w-full mb-2 bg-gray-600 text-gray-100"></textarea>
                    <button @click="submitResponse(issue.id)" class="bg-green-500 text-white px-4 py-2 rounded">
                        등록하기
                    </button>
                </div>

                <!-- 기존 답변 표시 -->
                <div v-if="issue.response" class="mt-4 p-4 bg-gray-700 rounded">
                    <h4 class="font-semibold">답변:</h4>
                    <p>{{ issue.response }}</p>
                </div>
            </div>
        </div>
        <p v-else class="text-gray-500 mt-4">Loading issues or no issues available.</p>
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
            issues: [],
            activeIssueId: null, // 현재 열려있는 답변 폼의 ID
            responseText: "", // 답변 텍스트
        };
    },
    methods: {
        async fetchIssues() {
            try {
                const response = await api.get("/issue/all");
                this.issues = response.data.data;
            } catch (error) {
                console.error("Failed to load issues:", error);
            }
        },
        toggleResponseForm(issueId) {
            // 이미 열려있는 폼을 다시 클릭하면 닫고, 그렇지 않으면 새로운 폼을 열기
            this.activeIssueId = this.activeIssueId === issueId ? null : issueId;
            this.responseText = ""; // 폼을 열 때마다 초기화
        },
        async submitResponse(issueId) {
            try {
                console.log("Submitting response for issue:", issueId);
                const response = {
                    id: issueId,
                    response: this.responseText,
                }

                await api.post(`/issue/answer`, response)
                this.fetchIssues(); // 업데이트된 목록 가져오기
                this.activeIssueId = null; // 답변 폼 닫기
                this.responseText = ""; // 답변 텍스트 초기화
            } catch (error) {
                console.error("Failed to add response:", error);
            }
        },
        async toggleDelete(issueId) {
            if (confirm("정말로 삭제하시겠습니까?")) {
                try {
                    await api.delete(`/issue/delete/${issueId}`);
                    this.fetchIssues(); // 업데이트된 목록 가져오기
                } catch (error) {
                    console.error("Failed to delete issue:", error);
                }
            }
        },
        formatDate(date) {
            return new Date(date).toLocaleDateString();
        },
    },
    created() {
        this.fetchIssues();
    },
};
</script>
