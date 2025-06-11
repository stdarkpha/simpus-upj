<template>
   <div class="relative">
      <div class="bg-red-600 w-full h-96 absolute top-0 left-0 -z-10 rounded-bl-2xl rounded-br-2xl">


      </div>
      <nav>
         <div class="container flex items-center justify-between p-4">
            <!-- Akun -->
            <div class="flex items-center gap-4">
               <div class="w-10 h-10 bg-white p-2 rounded-full overflow-hidden">
                  <img class="w-full h-full object-cover" src="/logo.png" alt="">
               </div>

               <div class="flex flex-col text-white">
                  <p class="text-sm opacity-75">Selamat Pagi,</p>
                  <h1 class="font-semibold capitalize leading-4">{{ data?.data?.name }}</h1>
               </div>
            </div>

            <!-- Notification -->
            <div class="w-10 h-10 bg-white p-2 rounded-full overflow-hidden">
               <Icon icon="akar-icons:bell" class="w-full h-full text-red-600" />
            </div>
         </div>
      </nav>

      <header>
         <div class="container p-4 flex flex-col gap-8">
            <div>
               <h1 class="text-4xl font-bold text-white">Laman Utama</h1>
               <p class="text-xl text-white">Cari buku berdasarkan judul</p>
            </div>

            <!-- Filter Search -->
            <div class="bg-white w-full flex items-center justify-center rounded-md px-3">
               <Icon icon="iconamoon:search-bold" class="shrink-0 text-2xl text-red-600" />
               <input type="text" placeholder="Cari buku berdasarkan judul"
                  class="grow py-4 px-3 text-sm outline-none border-none rounded-md" />
               <Icon icon="mage:filter" class="shrink-0 text-2xl text-red-600" />

            </div>

            <!-- Card Peminjaman -->
            <div class="p-6 pb-8 relative bg-white z-10 shadow-xl shadow-gray-400/10 rounded-md">
               <div class="flex flex-col items-start gap-2 max-w-2/3">
                  <h1 class="text-lg font-bold leading-tight">
                     Pinjam dengan Bijak, <br />
                     Kembalikan dengan Tepat!
                  </h1>
                  <p class="text-sm text-gray-500">
                     Pengembalian terlambat dikenakan denda sesuai durasi keterlambatan
                  </p>

                  <!-- CTA -->
                  <button
                     class="bg-red-600 text-white text-sm py-3 px-6 mt-8 rounded-full font-semibold hover:bg-red-700 transition-colors">
                     Info Lebih Lanjut
                  </button>
               </div>
               <img class="absolute right-0 bottom-0 -z-10 h-[90%]" src="/buku.png" alt="buku">
            </div>
         </div>
      </header>

      <!-- Latest Book -->
      <section>
         <div class="container flex items-baseline-last justify-between p-4">
            <h1 class="text-xl font-bold">
               Buku Terbaru
            </h1>
            <a class="font-bold text-red-600" href="#">Lihat Semua</a>
         </div>

         <div class="max-w-screen w-full overflow-hidden">
            <swiper-container :slides-per-view="2.5" :slides-offset-before="16" class="w-full">
               <swiper-slide v-for="item in book_data" class="overflow-hidden w-full px-2">
                  <div class="w-full aspect-[2/3] rounded-md overflow-hidden"
                     :style="`box-shadow: 0 24px 24px -8px ${shadow};`">
                     <img class="w-full h-full object-cover" :src="item.img" alt="Clean Code">
                  </div>

                  <h1 class="font-bold text-lg truncate leading-tight mt-4">
                     Clean Code: A Handbook of Agile Software Craftsmanship
                  </h1>
                  <p class="font-medium text-gray-500">
                     Robert C. Martin
                  </p>
               </swiper-slide>
            </swiper-container>
         </div>
      </section>
   </div>
</template>

<script lang="ts" setup>
definePageMeta({
   middleware: ["auth"],
});

const colorMode = useColorMode();

colorMode.preference = "light";

import { FastAverageColor } from "fast-average-color";

const getAverageColor = async (imageUrl: string) => {
   const fac = new FastAverageColor();
   const color = await fac.getColorAsync(imageUrl);
   return {
      hex: color.hex,
      rgb: color.rgb,
      value: color.value,
      shadow: `rgba(${color.value.slice(0, 3).map((v: number) => v < 100 ? v + 50 : v).join(', ')}, 1)`
   };
};

const { value: color, shadow } = await getAverageColor("/clean.jpg");
const config = useRuntimeConfig().public.API_URL;
const { data: latest_book } = await useAsyncData<any>("user", async () => {
   return await $fetch(`${config}books`);
});

const book_data = ref<any[]>([]);

watch(latest_book, async (val) => {
   if (!val) return;
   const list = val.data || [];
   book_data.value = await Promise.all(
      list.map(async (item: any) => {
         const { shadow } = await getAverageColor(item.img);
         return {
            ...item,
            shadow,
         };
      })
   );
}, { immediate: true });

import { Icon } from "@iconify/vue";
const { data, signOut, token } = useAuth();
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

onMounted(() => {
   if (loggedIn.value) {
      //@ts-ignore
      toast(`Welcome, ${data.value?.data?.name}`, {
         theme: "auto",
         type: "success",
         pauseOnHover: false,
      });

      loggedIn.value = false;
   }
});
</script>

<style></style>
