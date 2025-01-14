<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
      <h3 class="text-xl font-semibold text-center mb-4">알림</h3>
      <p class="text-center mb-4">{{ message }}</p>
      <div class="flex justify-center">
        <button
          @click="closeModal"
          class="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-all"
        >
          확인
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  methods: {
    closeModal() {
      this.$emit('update:isOpen', false); // 부모 컴포넌트로 isOpen을 false로 보내서 모달을 닫음
    },
  },
};
</script>

<style scoped>
/* Tailwind CSS로 기본 스타일 설정 */
</style>
