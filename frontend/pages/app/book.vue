<template>
   <div>
      <div class="bg-red-600 w-full h-64 absolute top-0 left-0 -z-10 rounded-bl-2xl rounded-br-2xl"></div>
      <header>
         <div class="container p-4 flex flex-col gap-8">
            <div>
               <h1 class="text-2xl font-bold text-white">Buku Perpustakaan</h1>
               <p class="text-white">Cari buku berdasarkan judul</p>
            </div>

            <!-- Filter Search -->
            <div class="bg-white w-full flex items-center justify-center rounded-md px-3">
               <Icon icon="iconamoon:search-bold" class="shrink-0 text-2xl text-red-600" />
               <input type="text" placeholder="Cari buku berdasarkan judul" v-model="query" class="grow py-4 px-3 text-sm outline-none border-none rounded-md" />
               <Icon icon="mage:filter" class="shrink-0 text-2xl text-red-600" />
            </div>
         </div>
      </header>
      <section class="mb-8 mt-4">
         <div class="container flex items-baseline-last justify-between p-4">
            <h1 class="text-xl font-bold">
               {{ query ? `Hasil Pencarian: ${query}` : "Buku Perpustakaan" }}
            </h1>
         </div>

         <div v-if="!query" class="max-w-screen w-full overflow-hidden">
            <Suspense>
               <motion.div :initial="{ opacity: 0, y: 100 }" :animate="{ opacity: 1, y: 0, transition: { duration: 0.6 } }">
                  <UserHomeGrid />
               </motion.div>
               <template #fallback>
                  <div class="w-full py-24 text-gray-600 flex items-center justify-center">
                     <Icon icon="mingcute:loading-3-line" class="text-4xl animate-spin" />
                     Harap Tunggu...
                  </div>
               </template>
            </Suspense>
         </div>
         <div v-else>
            <div v-if="search_result?.data?.length > 0" class="w-full flex flex-col gap-4">
               <motion.div :initial="{ opacity: 0, y: 100 }" :animate="{ opacity: 1, y: 0, transition: { duration: 0.6 } }" class="w-full h-48 flex flex-row group items-end p-4 rounded-md gap-3 relative z-10" v-for="item in search_result?.data" @click="item_active = item">
                  <motion.div :layout-id="`category-${item.id}`" class="aspect-[2/3] h-full shadow-img shrink-0 relative">
                     <img :style="`box-shadow: 0 24px 32px -4px rgba(${item.color}, 0);`" class="w-full h-full object-cover rounded-md" :src="item.img" alt="Clean Code" />
                  </motion.div>

                  <div class="h-full flex flex-col items-start justify-between overflow-hidden grow py-2 gap-2">
                     <div class="w-full flex flex-col gap-2">
                        <h1 class="font-bold text-lg leading-tight line-clamp-2">
                           {{ item.title }}
                        </h1>
                        <p class="text-sm font-bold text-red-600">Author: {{ item.author }}</p>
                        <div v-html="item.description ?? 'Tidak Ada Deskripsi'" class="text-xs text-gray-500 line-clamp-2"></div>
                     </div>

                     <div class="flex items-center text-xs justify-between font-medium w-full">
                        <p v-if="item.stock">
                           Tersedia
                           <span class="font-bold text-red-600"> {{ item.stock }} Buku </span>
                        </p>
                        <p v-else class="text-red-600">Status: Tidak Tersedia</p>
                        <p class="flex items-center gap-1 font-medium group-hover:text-red-600 group-hover:gap-2 transition-all">
                           Detail
                           <Icon icon="mdi:arrow-right" />
                        </p>
                     </div>
                  </div>

                  <div class="w-full h-full bg-white shadow rounded-lg absolute left-0 bottom-0 -z-10"></div>
               </motion.div>
            </div>

            <motion.div :initial="{ opacity: 0, y: 100 }" :animate="{ opacity: 1, y: 0 }" v-else-if="search_result?.data?.length === 0 || search_result?.success === false" class="w-full text-gray-600 gap-2 flex flex-col items-center justify-center">
               <img src="/404.png" alt="Not Found" class="w-2/3 h-auto" />
               <h1 class="text-center font-bold px-8 max-w-md">
                  Maaf kami tidak dapat menemukan pencarian
                  <span class="text-red-600">“{{ query }}”</span>
               </h1>
               <p class="text-center text-xs px-8 max-w-sm">Silahkan mencoba lagi dengan gunakan frasa atau kata yang berbeda</p>
            </motion.div>

            <motion.div :initial="{ opacity: 0, y: 100 }" :animate="{ opacity: 1, y: 0, transition: { duration: 0.6 } }" v-else class="w-full py-24 gap-4 text-gray-600 flex flex-col items-center justify-center">
               <Icon icon="mingcute:loading-3-line" class="text-6xl animate-spin" />
               Mencari Buku...
            </motion.div>

            <UserDetail type="category" v-if="item_active" :item_active="item_active" @close="() => (item_active = null)" />
         </div>
      </section>
   </div>
</template>

<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import { motion } from "motion-v";
definePageMeta({
   middleware: ["auth"],
   pageTransition: {
      name: "fade",
      mode: "out-in",
   },
});

const query = ref<string | null>(null);
const item_active = ref<any>(null);

const config = useRuntimeConfig().public.API_URL;
const { data: search_result } = await useAsyncData<any>(
   "query",
   async () => {
      if (!query.value || query?.value?.length < 3) return null;
      return await $fetch(`${config}books/search`, {
         method: "GET",
         params: {
            query: query.value,
         },
      });
   },
   { watch: [query], immediate: true }
);
</script>

<style></style>
