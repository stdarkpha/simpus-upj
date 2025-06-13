<template>
    <div>
        <swiper-container :slides-per-view="2.5" :slides-offset-before="12" class="w-full">
            <swiper-slide v-for="item in latest_book?.data?.data" class=" w-full px-2" @click="item_active = item">
                <motion.div :layout-id="`latest-${item.id}`" class="aspect-[2/3] shadow-img shrink-0 relative">
                    <img :style="`box-shadow: 0 24px 32px -4px rgba(${item.color}, 1);`"
                        class="w-full h-full object-cover rounded-md" :src="item.img" alt="Clean Code">
                </motion.div>

                <h1 class="font-bold truncate leading-tight mt-4">
                    {{ item.title }}
                </h1>
                <p class="font-medium text-sm text-gray-500">
                    {{ item.author }}
                </p>
            </swiper-slide>
        </swiper-container>
        <UserDetail type="latest" v-if="item_active" :item_active="item_active" @close="() => item_active = null" />
    </div>
</template>

<script lang="ts" setup>
import { motion } from 'motion-v';
const config = useRuntimeConfig().public.API_URL;
const { data: latest_book } = await useAsyncData<any>("books", async () => {
    return await $fetch(`${config}books`, {
        params: {
            paginate: 9
        }
    });
});
const item_active = ref<any>(null)
</script>

<style></style>