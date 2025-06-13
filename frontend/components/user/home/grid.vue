<template>
    <div>
        <div class="w-full grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
            <div v-for="item in latest_book?.data" class=" w-full" @click="item_active = item">
                <motion.div :layout-id="`latest-${item.id}`" class="aspect-[2/3] shadow-img shrink-0 relative">
                    <img :style="`box-shadow: 0 24px 32px -4px rgba(${item.color}, 1);`"
                        class="w-full h-full object-cover rounded-md" :src="item.img" alt="Clean Code">
                </motion.div>

                <h1 class="font-bold text-sm line-clamp-2 leading-tight mt-4">
                    {{ item.title }}
                </h1>
                <p class="font-medium text-xs text-gray-500">
                    {{ item.author }}
                </p>
            </div>
        </div>
        <UserDetail type="latest" v-if="item_active" :item_active="item_active" @close="() => item_active = null" />
    </div>
</template>

<script lang="ts" setup>
import { motion } from 'motion-v';
const config = useRuntimeConfig().public.API_URL;
const { data: latest_book } = await useAsyncData<any>("all", async () => {
    return await $fetch(`${config}books`);
});
const item_active = ref<any>(null)
</script>

<style></style>