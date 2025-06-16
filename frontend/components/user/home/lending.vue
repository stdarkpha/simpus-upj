<template>
   <div>
      <div v-if="lending_data?.data?.items" class="container flex items-baseline-last justify-between p-4">
         <h1 class="text-xl font-bold">Buku Pinjaman</h1>
         <NuxtLink class="font-bold text-red-600" to="/app/history">Lihat Semua</NuxtLink>
      </div>

      <swiper-container :slides-per-view="1.2" :slides-offset-before="12" :slides-offset-after="20" :space-between="20" class="w-full">
         <swiper-slide v-for="item in lending_data?.data?.items" class="w-full pt-4 pb-2">
            <div class="w-full h-48 flex flex-row group items-end p-4 rounded-md gap-3 relative z-10" @click="item_active = item.book">
               <div class="h-full transition-all cover">
                  <motion.div :layout-id="`reminder-${item.book.id}`" class="aspect-[2/3] h-full shadow-img shrink-0 relative">
                     <img :style="`box-shadow: 0 24px 32px -4px rgba(${item.color}, 0);`" class="w-full h-full object-cover rounded-md" :src="item.book.img" alt="Clean Code" />
                  </motion.div>
               </div>

               <div class="h-full flex flex-col items-start justify-between overflow-hidden grow py-2 gap-2">
                  <div class="w-full flex flex-col gap-2">
                     <h1 class="font-bold text-lg leading-tight line-clamp-2">
                        {{ item.book.title }}
                     </h1>
                     <p class="text-sm font-bold text-red-600">Author: {{ item.book.author }}</p>
                     <!-- Bar -->
                     <div :style="`width: ${percentage}%`" class="h-1.5 bg-red-500 rounded my-1"></div>
                     <div class="text-xs">
                        Sisa waktu:
                        <span class="font-bold text-red-600">
                           {{ elapse_time }}
                        </span>
                     </div>
                  </div>
               </div>

               <div :style="`background: rgba(${item.book.color}, .1)`" class="w-full h-full rounded-lg absolute left-0 bottom-0 -z-10"></div>
            </div>
         </swiper-slide>
      </swiper-container>

      <UserDetail type="reminder" v-if="item_active" :item_active="item_active" @close="() => (item_active = null)" />
   </div>
</template>

<script lang="ts" setup>
import { motion } from "motion-v";
import { Icon } from "@iconify/vue";
const config = useRuntimeConfig().public.API_URL;
const category_index = ref(1);
const { token } = useAuth();
const { data: lending_data } = await useAsyncData<any>("lending_data", async () => {
   return await $fetch(`${config}lending/reminder`, {
      headers: {
         Authorization: `Bearer ${token.value}`,
      },
   });
});

const item_active = ref<any>(null);

const countTime = (date: string) => {
   const now = new Date();
   const endDate = new Date(date);
   const diffTime = endDate.getTime() - now.getTime();
   // if date is days return days left if less than 1 day return hours left
   if (diffTime < 0) {
      return "Sudah lewat";
   }
   const daysLeft = Math.floor(diffTime / (1000 * 60 * 60 * 24));
   if (daysLeft >= 1) {
      return `${daysLeft} hari`;
   }
   const hoursLeft = Math.floor(diffTime / (1000 * 60 * 60));
   return `${hoursLeft} jam`;
};

const elapse_time = ref(countTime(lending_data?.value.data?.return_date));

// count percentage from now, start from: lend_date to return_date
const countPercentage = (lend_date: string, return_date: string) => {
   if (!lend_date || !return_date) return 0;

   const startDate = new Date(lend_date);
   const endDate = new Date(return_date);
   const now = new Date();

   if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return 0;

   const totalDuration = endDate.getTime() - startDate.getTime();
   const elapsedDuration = now.getTime() - startDate.getTime();

   if (totalDuration <= 0) return 100;
   if (elapsedDuration < 0) return 0;
   if (elapsedDuration >= totalDuration) return 100;

   const percentage = (elapsedDuration / totalDuration) * 100;
   return Math.round(percentage);
};

const percentage = ref(countPercentage(lending_data?.value.data?.lend_date, lending_data?.value.data?.return_date));
</script>

<style>
.swiper-slide-active .cover {
   height: 180px;
   margin-bottom: 8px;
}
</style>
