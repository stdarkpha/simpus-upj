<template>
    <div>
        <div class="max-w-screen w-full overflow-hidden">
            <swiper-container slides-per-view="auto" :slides-offset-before="12" :space-between="8" class="w-full">
                <swiper-slide v-for="(item, index) in category_book.data" class="!w-auto py-2">
                    <button @click="category_index = index"
                        :class="index == category_index ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-white hover:bg-zinc-100 shadow'"
                        class=" text-xs py-2.5 px-4 rounded-full font-semibold transition-colors capitalize">
                        {{ item.name }} ({{ item.books.length }})
                    </button>
                </swiper-slide>
            </swiper-container>
        </div>

        <div class="w-full flex flex-col gap-4">
            <div v-show="index == category_index" v-for="(data, index) in category_book?.data">
                <div class="w-full h-48 flex flex-row group items-end p-4 rounded-md gap-3 relative z-10"
                    v-for="(item) in data.books" @click="item_active = item">
                    <motion.div :layout-id="`category-${item.id}`"
                        class="aspect-[2/3] h-full shadow-img shrink-0 relative">
                        <img :style="`box-shadow: 0 24px 32px -4px rgba(${item.color}, 0);`"
                            class="w-full h-full object-cover rounded-md" :src="item.img" alt="Clean Code">
                    </motion.div>

                    <div class="h-full flex flex-col items-start justify-between overflow-hidden grow py-2 gap-2">
                        <div class="w-full flex flex-col gap-2">
                            <h1 class="font-bold text-lg leading-tight line-clamp-2">
                                {{ item.title }}
                            </h1>
                            <p class="text-sm font-bold text-red-600">
                                Author: {{ item.author }}
                            </p>
                            <div v-html="item.description ?? 'Tidak Ada Deskripsi'"
                                class="text-xs text-gray-500 line-clamp-2">
                            </div>
                        </div>

                        <div class="flex items-center text-xs justify-between font-medium w-full">
                            <p v-if="item.stock">Tersedia
                                <span class="font-bold text-red-600">
                                    {{ item.stock }} Buku
                                </span>
                            </p>
                            <p v-else class="text-red-600">Status: Tidak Tersedia</p>
                            <p
                                class="flex items-center gap-1 font-medium group-hover:text-red-600 group-hover:gap-2 transition-all">
                                Detail
                                <Icon icon="mdi:arrow-right" />
                            </p>
                        </div>
                    </div>

                    <div class="w-full h-full bg-white shadow rounded-lg absolute left-0 bottom-0 -z-10">
                    </div>
                </div>
            </div>
        </div>

        <UserDetail type="category" v-if="item_active" :item_active="item_active" @close="() => item_active = null" />
    </div>
</template>

<script lang="ts" setup>
import { motion } from "motion-v";
import { Icon } from '@iconify/vue';
const config = useRuntimeConfig().public.API_URL;
const category_index = ref(0);
const { data: category_book } = await useAsyncData<any>("category_books", async () => {
    return await $fetch(`${config}books/category`);
});

const item_active = ref<any>(null);
</script>

<style></style>