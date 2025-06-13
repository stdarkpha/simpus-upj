export const useUserStore = defineStore("user", () => {
    const detail_book = ref<any>(null)

    return {
        detail_book,
    }
})