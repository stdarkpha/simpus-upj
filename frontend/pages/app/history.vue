<template>
   <div>
      <div class="bg-red-600 w-full h-64 absolute top-0 left-0 -z-10 rounded-bl-2xl rounded-br-2xl"></div>

      <header>
         <div class="container p-4 flex flex-col gap-8">
            <div>
               <h1 class="text-2xl font-bold text-white">Riwayat Pinjaman</h1>
               <p class="text-white">Filter riwayat dengan tanggal</p>
            </div>

            <!-- Filter Search -->
            <label class="bg-white w-full flex items-center justify-center rounded-md px-3">
               <Icon icon="uiw:date" class="shrink-0 text-2xl text-red-600" />
               <input type="date" placeholder="Pilih Tanggal"
                  class="grow py-4 px-3 text-sm outline-none border-none rounded-md" />
            </label>
         </div>
      </header>

      <div class="flex items-baseline justify-between px-4 mt-8">
         <div>
            <h1 class="text-2xl font-bold">Daftar Riwayat</h1>
         </div>
         <div class="flex items-center gap-3">
            <button @click="refresh()" :disabled="pending"
               class="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               title="Refresh History">
               <Icon :icon="pending ? 'eos-icons:loading' : 'material-symbols:refresh'"
                  :class="pending ? 'animate-spin' : ''" class="text-lg" />
            </button>
            <div class="font-bold text-red-600">Total: {{ history_data?.data?.length || 0 }}</div>
         </div>
      </div>

      <div class="px-4">
         <!-- Loading state -->
         <div v-if="pending" class="flex flex-col items-center justify-center py-8">
            <Icon icon="eos-icons:loading" class="animate-spin text-4xl text-red-600 mb-4" />
            <p class="text-gray-500 font-medium">Memuat riwayat...</p>
         </div>

         <!-- Empty state -->
         <div v-else-if="!history_data?.data?.length" class="flex flex-col items-center justify-center py-8">
            <Icon icon="material-symbols:history" class="text-6xl text-gray-300 mb-4" />
            <p class="text-gray-500 font-medium">Belum ada riwayat peminjaman</p>
         </div>

         <!-- History items -->
         <motion.div v-else v-for="item in history_data?.data" :layout-id="`history-${item.id}`"
            @click="selected_item = item"
            class="container p-4 flex flex-col gap-2 rounded-md shadow-xl shadow-gray-400/10 bg-white mb-4">
            <div class="flex items-baseline-last justify-between w-full">
               <div class="font-bold uppercase">
                  {{ item.transaction_id }}
               </div>

               <div :class="getStatusColor(item.status)" class="text-white px-2 py-1.5 rounded-md text-xs">
                  {{ status_mapping[item.status] || item.status }}
               </div>
            </div>
            <motion.div :initial="false" :animate="{ height: 40 }"
               class="bg-gray-100 overflow-hidden text-gray-500 font-semibold my-1 rounded-md">
               <div class="flex gap-2 px-4 py-2" v-for="(data, index) in item.compact">
                  <div class="text-sm line-clamp-1">Buku: {{ data.book.title }}</div>
                  <div v-if="index == 0 && item.compact.length > 1" class="text-sm shrink-0">({{ item.compact.length - 1
                     }} Buku Lainnya)</div>
               </div>
            </motion.div>

            <div class="flex items-baseline-last justify-between w-full">
               <div class="flex flex-col gap-1">
                  <span class="text-gray-500 text-xs">Tanggal Peminjaman</span>
                  <span class="font-semibold text-red-600">{{ formatDate(item.created_at) }}</span>
               </div>

               <div class="flex flex-col gap-1 items-end">
                  <span class="text-gray-500 text-xs">Batas Peminjaman</span>
                  <span class="font-semibold text-red-600">{{ formatDate(item.return_date) }}</span>
               </div>
            </div>
         </motion.div>
      </div>

      <Teleport to="body">
         <motion.div v-if="selected_item" @click="
            selected_item = null;
         showqrcode = false;
         " :initial="{ bottom: '-20%', opacity: 0 }"
            :animate="{ bottom: '10%', opacity: 1, transition: { delay: 0.5, duration: 0.4 } }"
            class="w-16 h-16 rounded-full left-1/2 -translate-x-1/2 flex items-center justify-center z-[60] fixed bottom-0 bg-white">
            <Icon icon="uil:times" class="text-2xl" />
         </motion.div>
         <motion.div v-if="selected_item" :initial="{ background: 'rgba(231, 0, 11 0)' }"
            :animate="{ background: 'rgba(231, 0, 11 1)' }"
            class="fixed top-0 left-0 w-full bg-red-600 h-screen flex flex-col items-center justify-center p-4 shadow-lg z-50">
            <motion.div class="bg-white w-full pt-4 pb-12 rounded-md relative" v-on-click-outside="() => {
                  selected_item = null;
                  showqrcode = false;
               }
               ">
               <motion.div :initial="{ y: '-100%', opacity: 0 }"
                  :animate="{ y: '-50%', opacity: 1, transition: { delay: 0.5, duration: 0.4 } }"
                  class="w-10 h-10 rounded-full left-1/2 z-10 -translate-x-1/2 absolute top-0 bg-red-600"> </motion.div>
               <motion.div :initial="{ y: '100%', opacity: 0 }"
                  :animate="{ y: '50%', opacity: 1, transition: { delay: 0.5, duration: 0.4 } }"
                  class="w-10 h-10 rounded-full left-1/2 z-10 -translate-x-1/2 absolute bottom-0 bg-red-600">
               </motion.div>
               <div class="relative flex items-center justify-center">
                  <div :class="showqrcode ? 'rotate-y-180' : ''"
                     class="transition-all absolute w-full h-full duration-500 backface-hidden">
                     <motion.div :layout-id="`history-${selected_item.id}`"
                        :animate="{ height: ['auto', '100%'], transition: { duration: 0.4 } }"
                        class="container h-full p-4 flex flex-col gap-2 rounded-md bg-white">
                        <div class="flex items-baseline-last justify-between w-full">
                           <div class="font-bold uppercase">
                              {{ selected_item.transaction_id }}
                           </div>

                           <div :class="getStatusColor(selected_item.status)"
                              class="text-white px-2 py-1.5 rounded-md text-xs">
                              {{ status_mapping[selected_item.status] || selected_item.status }}
                           </div>
                        </div>
                        <motion.div :animate="{ height: [40, '100%'], transition: { duration: 0.4 } }"
                           class="bg-gray-100 text-gray-500 overflow-auto font-semibold my-1 rounded-md">
                           <div class="flex gap-2 px-4 py-2" v-for="item in selected_item.compact">
                              <div class="text-sm line-clamp-1">Buku: {{ item.book.title }}</div>
                           </div>
                        </motion.div>

                        <div class="flex items-baseline-last justify-between w-full">
                           <div class="flex flex-col gap-1">
                              <span class="text-gray-500 text-xs">Tanggal Peminjaman</span>
                              <span class="font-semibold text-red-600">{{ formatDate(selected_item.created_at) }}</span>
                           </div>

                           <div class="flex flex-col gap-1 items-end">
                              <span class="text-gray-500 text-xs">Batas Peminjaman</span>
                              <span class="font-semibold text-red-600">{{ formatDate(selected_item.return_date)
                                 }}</span>
                           </div>
                        </div>
                     </motion.div>
                  </div>
                  <div :class="!showqrcode ? 'rotate-y-180' : 'rotate-y-0 '"
                     class="w-full h-full aspect-square transition-all duration-500 pb-10 pt-4 backface-hidden">
                     <h2 class="mb-1 px-4 text-sm text-center capitalize">Gunakan QR berikut untuk mengambil buku</h2>
                     <img v-if="qr_data?.data?.qr_code" class="w-full h-full object-contain"
                        :src="qr_data?.data?.qr_code" alt="" />

                     <div v-else class="flex flex-col gap-4 items-center justify-center h-full">
                        <Icon icon="mingcute:loading-fill" class="animate-spin text-4xl" />
                        <p class="font-semibold">Memuat QR Code</p>
                     </div>
                  </div>
               </div>

               <div class="px-4">
                  <motion.button :initial="{ opacity: 0, scale: 0 }" @click="showqrcode = !showqrcode"
                     :animate="{ opacity: 1, scale: 1, transition: { duration: 0.4, delay: 0.5 } }"
                     :class="showqrcode ? 'bg-gray-900' : 'bg-red-600'"
                     class="w-full text-white text-xs py-3 px-6 rounded-full font-semibold hover:bg-red-700 transition-colors">
                     {{ showqrcode ? "Tutup QR Code" : "Tampilkan QR Code" }}
                  </motion.button>
               </div>
            </motion.div>
         </motion.div>
      </Teleport>
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

import { motion } from "motion-v";
import { vOnClickOutside } from "@vueuse/components";
import Pusher from 'pusher-js'
import { toast } from "vue-sonner";

const showqrcode = ref(false);

import { Icon } from "@iconify/vue";
const selected_item = ref<any>(null);
const config = useRuntimeConfig().public.API_URL;
const { token } = useAuth();

const { data: history_data, refresh, pending } = await useAsyncData<any>("history", async () => {
   return await $fetch(`${config}lending/history`, {
      method: "GET",
      headers: {
         Authorization: `Bearer ${token.value}`,
      },
   });
});

// WebSocket setup for real-time updates
let pusher: Pusher | null = null
let notificationChannel: any = null
const { data: userData } = await useAuth()

onMounted(() => {
   initializeWebSocket()
})

onUnmounted(() => {
   if (notificationChannel) {
      notificationChannel.unbind_all()
      notificationChannel.unsubscribe()
   }
   if (pusher) {
      pusher.disconnect()
   }
})

const initializeWebSocket = () => {
   try {
      if (!userData.value?.data?.id) {
         console.warn('Cannot initialize WebSocket: User ID not found')
         return
      }

      // Initialize Pusher for this page
      const runtimeConfig = useRuntimeConfig()
      pusher = new Pusher(runtimeConfig.public.PUSHER_KEY, {
         cluster: runtimeConfig.public.PUSHER_CLUSTER,
         forceTLS: true,
      })

      const channelName = `user.${userData.value.data.id}`
      console.log('📡 History page subscribing to channel:', channelName)

      notificationChannel = pusher.subscribe(channelName)

      // Listen for lending-related notifications
      notificationChannel.bind('notification.created', (data: any) => {
         console.log('🔔 History page received notification:', data)

         // Check if this notification is related to lending status changes
         if (data.data && (data.data.lending_id || data.data.action)) {
            const lendingActions = ['approved', 'rejected', 'returned', 'returned_overdue']

            if (lendingActions.includes(data.data.action)) {
               console.log('🔄 Refreshing history data due to lending status change')
               refresh()

               // Show toast notification
               toast.success('Riwayat Diperbarui', {
                  description: 'Riwayat peminjaman telah diperbarui secara otomatis',
                  duration: 3000,
               })
            }
         }
      })

      pusher.connection.bind('connected', () => {
         console.log('✅ History page Pusher connected')
      })

   } catch (error) {
      console.error('💥 Failed to initialize WebSocket on history page:', error)
   }
}

const selectedItemId = computed(() => selected_item.value?.id);

const { data: qr_data, refresh: qr } = await useAsyncData<any>(
   "qrcode",
   async () => {
      if (!showqrcode.value) return null;
      return await $fetch(`${config}lending/history/${selectedItemId.value}`, {
         method: "GET",
         headers: {
            Authorization: `Bearer ${token.value}`,
         },
      });
   },
   { watch: [selectedItemId, showqrcode] }
);

function formatDate(dateString: string): string {
   return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
   });
}

function getStatusColor(status: string): string {
   switch (status) {
      case 'pending':
         return 'bg-yellow-600'
      case 'claim':
         return 'bg-blue-600'
      case 'returned':
         return 'bg-green-600'
      case 'overdue':
         return 'bg-orange-600'
      case 'reject':
         return 'bg-red-600'
      default:
         return 'bg-gray-600'
   }
}

const status_mapping: Record<string, string> = {
   pending: "Belum Diambil",
   claim: "Sudah Diambil",
   returned: "Dikembalikan",
   overdue: "Terlambat",
   reject: "Ditolak",
};
</script>

<style></style>
