<template>
  <div>
    <Teleport to="body">
      <nav class="fixed top-0 left-0 w-full z-[60]">
        <div class="container flex items-center justify-between p-4">

          <motion.div :while-press="{ scale: 0.8 }" @click="emit('close')"
            class="w-10 h-10 bg-white/25 p-2 rounded-full overflow-hidden">
            <Icon icon="tabler:arrow-left" class="w-full h-full text-white" />
          </motion.div>

          <!-- Notification -->
          <div class="w-10 h-10 bg-white/25 p-2 rounded-full overflow-hidden">
            <!-- <Icon icon="material-symbols:bookmark-outline" class="w-full h-full text-white" /> -->
            <Icon icon="material-symbols:bookmark" class="w-full h-full text-white" />
          </div>
        </div>
      </nav>

      <motion.main :initial="{ backgroundColor: 'rgba(255, 255, 255, 0)' }"
        :animate="{ backgroundColor: 'rgba(255, 255, 255, 1)', transition: { delay: 0.2 } }"
        class="h-screen overflow-auto w-full fixed top-0 left-0 z-50 pb-24">
        <div class="flex flex-col items-center w-full relative pt-18 pb-12 p-8 overflow-hidden">
          <motion.div :layout-id="`${type}-${item_active.id}`" class="aspect-[2/3] max-h-96 shadow-img shrink-0 relative">
            <img :style="`box-shadow: 0 24px 32px -4px rgba(${item_active.color}, 1);`"
              class="w-full h-full object-cover rounded-md" :src="item_active.img" alt="Clean Code">
          </motion.div>

          <motion.div :initial="{ opacity: 0 }" :animate="{ opacity: 1, transition: { duration: 0.8 } }"
            class="w-full h-full absolute top-0 left-0 -z-20">
            <div class="bg-gradient-to-t w-full h-full from-white to-white/10 absolute top-0 left-0 content-[''] z-10">
            </div>
            <motion.div :initial="{ opacity: 0, scale: 1.5 }"
              :animate="{ opacity: 1, scale: 1.1, transition: { delay: 0.2, duration: 1.2 } }"
              class="w-full h-full absolute top-0 left-0">
              <img class="w-full h-full blur object-cover brightness-50 " :src="item_active.img" alt="Clean Code">
            </motion.div>
          </motion.div>
        </div>
        <motion.div :initial="{ opacity: 0, y: 100 }"
          :animate="{ opacity: 1, y: 0, transition: { delay: .2, duration: 0.6 } }"
          class="p-8 pt-0 flex flex-col items-start gap-2">
          <h1 class="font-bold text-center text-xl w-full leading-tight">
            {{ item_active.title }}
          </h1>
          <p class="font-semibold text-center text-lg w-full text-red-600">
            Author: {{ item_active.author }}
          </p>

          <div class="grid grid-cols-2 gap-4 w-full max-w-screen-sm mt-4">
            <div class="flex flex-col items-start gap-1 p-4 rounded shadow-md">
              <p class="text-sm text-gray-500">Kategori</p>
              <p class="font-bold text-red-600 capitalize">{{ item_active.category.name }}</p>
            </div>
            <div class="flex flex-col items-start gap-1 p-4 rounded shadow-md">
              <p class="text-sm text-gray-500">Tanggal Penerbitan</p>
              <p class="font-bold text-red-600">
                {{ formatDate(item_active.release_date) }}
              </p>
            </div>
            <div class="flex flex-col items-start gap-1 p-4 rounded shadow-md">
              <p class="text-sm text-gray-500">{{ item_active.stock ? 'Tersedia' : 'Status' }}</p>
              <p class="font-bold text-red-600" v-if="item_active.stock">{{ item_active.stock }} Buku</p>
              <p class="font-bold text-red-600" v-else>Tidak Tersedia</p>
            </div>
            <div class="flex flex-col items-start gap-1 p-4 rounded shadow-md">
              <p class="text-sm text-gray-500">Jumlah Halaman</p>
              <p class="font-bold text-red-600">{{ item_active.total_page }} Halaman</p>
            </div>
          </div>

          <h1 class="text-xl font-bold mt-4">Deskripsi</h1>
          <div v-html="item_active.description" class="text-justify"></div>
        </motion.div>
      </motion.main>

      <motion.div :initial="{ opacity: 0, y: 100 }"
        :animate="{ opacity: 1, y: 0, transition: { delay: .6, duration: 0.6 } }"
        class="fixed bg-gradient-to-t from-white via-white to-transparent w-full p-8 bottom-0 left-0 z-50">
        <motion.button v-if="!available && item_active.stock" @click="addToCart" :initial="false"
          :while-press="{ scale: 0.95, filter: 'brightness(0.8)' }"
          class="w-full flex items-center gap-2 justify-center bg-red-500 shadow-xl shadow-red-400/50 py-4 rounded-md font-semibold text-white"
          type="submit">
          <Icon v-if="loading" icon="mingcute:loading-fill" class="animate-spin text-2xl" />
          <Icon v-else icon="solar:cart-4-outline" class="text-2xl" />
          {{ loading ? 'Loading..' : 'Tambah ke Tas' }}
        </motion.button>
        <motion.button v-else
          class="w-full flex items-center gap-2 justify-center bg-gray-300 shadow-xl shadow-gray-400/50 py-4 rounded-md font-semibold text-gray-500"
          type="button" disabled>
          <Icon icon="octicon:no-entry-16" class="text-2xl" />
          {{ item_active.stock ? 'Sudah ada di Tas' : 'Tidak Tersedia' }}
        </motion.button>
      </motion.div>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
import { motion } from 'motion-v';
import { Icon } from '@iconify/vue';

const loading = ref(false);
const emit = defineEmits();
const available = ref(false);

const props = defineProps<{
  item_active: any;
  type: string;
}>();

const formatDate = (date: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(date).toLocaleDateString('id-ID', options);
};

const { token } = useAuth();

import Swal from 'sweetalert2';

const config = useRuntimeConfig().public.API_URL;

const addToCart = async () => {
  loading.value = true;

  await $fetch(`${config}lending/cart`, {
    method: 'POST',
    body: JSON.stringify({
      book_id: props.item_active.id,
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.value}`,
    },
    onResponse({ response }) {
      loading.value = false;
      if (response._data.success) {
        Swal.fire({
          title: 'Berhasil',
          text: response._data.message,
          icon: 'success',
          confirmButtonText: 'OK',
        });
        // emit('close');
      } else {
        Swal.fire({
          title: 'Gagal',
          text: response._data.message,
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
      available.value = true;
    },
  });
};
</script>

<style></style>