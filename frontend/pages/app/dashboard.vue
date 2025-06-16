<template>
   <div>
      <div class="bg-red-600 w-full h-96 absolute top-0 left-0 -z-10 rounded-bl-2xl rounded-br-2xl"></div>
      <header>
         <div class="container p-4 flex flex-col gap-8">
            <div>
               <h1 class="text-2xl font-bold text-white">Laman Utama</h1>
               <p class="text-white">Cari buku berdasarkan judul</p>
            </div>

            <!-- Filter Search -->
            <div @click="useRouter().push('/app/book')" class="bg-white w-full flex items-center justify-center rounded-md px-3">
               <Icon icon="iconamoon:search-bold" class="shrink-0 text-2xl text-red-600" />
               <input type="text" placeholder="Cari buku berdasarkan judul" class="grow py-4 px-3 text-sm outline-none border-none rounded-md" />
               <Icon icon="mage:filter" class="shrink-0 text-2xl text-red-600" />
            </div>

            <!-- Card Peminjaman -->
            <div class="p-6 pb-8 relative bg-white z-10 shadow-xl shadow-gray-400/10 rounded-md">
               <div class="flex flex-col items-start gap-2 max-w-2/3">
                  <h1 class="text-base font-bold leading-tight">
                     Pinjam dengan Bijak, <br />
                     Kembalikan dengan Tepat!
                  </h1>
                  <p class="text-xs text-gray-500">Pengembalian terlambat dikenakan denda sesuai durasi keterlambatan</p>

                  <!-- CTA -->
                  <button class="bg-red-600 text-white text-xs py-3 px-6 mt-8 rounded-full font-semibold hover:bg-red-700 transition-colors">Info Lebih Lanjut</button>
               </div>
               <img class="absolute right-0 bottom-0 -z-10 h-[80%]" src="/buku.png" alt="buku" />
            </div>
         </div>
      </header>

      <!-- Latest Book -->
      <section class="mb-8">
         <div class="container flex items-baseline-last justify-between p-4">
            <h1 class="text-xl font-bold">Buku Terbaru</h1>
            <NuxtLink class="font-bold text-red-600" to="/app/book">Lihat Semua</NuxtLink>
         </div>

         <div class="max-w-screen w-full overflow-hidden">
            <Suspense>
               <UserHomeLatest />
               <template #fallback>
                  <div class="w-full py-24 text-gray-600 flex items-center justify-center">
                     <Icon icon="mingcute:loading-3-line" class="text-4xl animate-spin" />
                     Harap Tunggu...
                  </div>
               </template>
            </Suspense>
         </div>
      </section>

      <section class="mb-8">
         <div class="max-w-screen w-full overflow-hidden">
            <Suspense>
               <UserHomeLending />
               <template #fallback>
                  <div class="w-full py-24 text-gray-600 flex items-center justify-center">
                     <Icon icon="mingcute:loading-3-line" class="text-4xl animate-spin" />
                     Harap Tunggu...
                  </div>
               </template>
            </Suspense>
         </div>
      </section>

      <section class="mb-8">
         <div class="container flex items-baseline-last justify-between px-4">
            <h1 class="text-xl font-bold">Kategori Buku</h1>
            <a class="font-bold text-red-600" href="#">Lihat Semua</a>
         </div>

         <Suspense>
            <UserHomeCategory />
            <template #fallback>
               <div class="w-full py-24 text-gray-600 flex items-center justify-center">
                  <Icon icon="mingcute:loading-3-line" class="text-4xl animate-spin" />
                  Harap Tunggu...
               </div>
            </template>
         </Suspense>
      </section>
   </div>
</template>

<script lang="ts" setup>
definePageMeta({
   middleware: ["auth"],
   pageTransition: {
      name: "fade",
      mode: "out-in",
   },
});

import { Icon } from "@iconify/vue";
const colorMode = useColorMode();
colorMode.preference = "light";
</script>

<style></style>
