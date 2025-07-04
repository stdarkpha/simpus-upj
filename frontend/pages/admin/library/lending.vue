<template>
   <Layout>
      <Sheet @update:open="
         () => {
            useRouter().push('/admin/library/lending');
         }
      " v-model:open="open">
         <SheetContent class="gap-0">
            <SheetHeader class="border">
               <SheetTitle>Detail {{ lend_detail.data.status == "pending" ? "Peminjaman" : "Pengembalian" }}
               </SheetTitle>
            </SheetHeader>
            <div class="grow py-2 relative overflow-y-auto overflow-x-hidden">
               <div class="p-4 pt-0 relative">
                  <div class="flex items-center justify-between mb-2">
                     <div class="font-semibold uppercase">{{ lend_detail.data.transaction_id }}</div>
                     <div class="text-xs capitalize bg-orange-600 text-orange-100 px-2 py-1.5 rounded">{{
                        lend_detail.data.status }}</div>
                  </div>

                  <!-- Overdue Fine Calculation -->
                  <div
                     v-if="lend_detail.data.status == 'overdue' && differenceInCalendarDays(new Date(), lend_detail.data.return_date) > 0"
                     class="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                     <div class="flex items-center justify-between">
                        <div>
                           <div class="text-sm font-medium text-red-800">Denda Keterlambatan</div>
                           <div class="text-xs text-red-600">{{
                              overdueDays
                           }} hari terlambat</div>
                        </div>
                        <div class="text-right">
                           <div class="text-lg font-bold text-red-700">Rp {{ totalFine.toLocaleString('id-ID') }}
                           </div>
                           <div class="text-xs text-red-600">Rp 20.000 / hari</div>
                        </div>
                     </div>
                  </div>

                  <div class="text-sm my-2 capitalize w-full">
                     {{ lend_detail.data.status == "pending" ? "Peminjaman" : "Pengembalian" }}
                     <div class="p-2 bg-secondary font-medium w-full block rounded-md mt-1">
                        {{
                           new Date(lend_detail.data.lend_date).toLocaleDateString("id-ID", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                           })
                        }}
                        -
                        {{
                           new Date(lend_detail.data.return_date).toLocaleDateString("id-ID", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                           })
                        }}
                     </div>
                  </div>
                  <div class="text-sm my-2 capitalize w-full">
                     Nama
                     <div class="p-2 bg-secondary font-medium w-full block rounded-md mt-1">
                        {{ lend_detail.data.user.name }}
                     </div>
                  </div>
                  <div class="flex items-center gap-4 justify-between">
                     <div class="text-sm flex-1 capitalize">
                        <span class="block">Role </span>
                        <div class="p-2 bg-secondary font-medium w-full block rounded-md mt-1">
                           {{ lend_detail.data.user.role }}
                        </div>
                     </div>
                     <div class="text-sm flex-1 capitalize" v-if="lend_detail.data.user.uid">
                        <span class="block">{{ lend_detail.data.user.role == "mahasiswa" ? "NIM" : "NIDN"
                        }}</span>

                        <div class="p-2 bg-gray-200 font-medium w-full block rounded-md mt-1">
                           {{ lend_detail.data.user.uid }}
                        </div>
                     </div>
                  </div>
                  <hr class="my-4 border" />
                  <div class="mt-4">
                     <h2 class="font-bold">Daftar Buku ({{ lend_detail.data.items.length }})</h2>
                     <p class="text-sm text-gray-500 mb-4">Berikut adalah daftar buku yang dipinjam:</p>
                     <div v-for="data in lend_detail.data.items" class="mb-4">
                        <div class="flex items-center gap-4">
                           <img :src="data.book.img" class="w-auto h-24 rounded-md" alt="" />
                           <div>
                              <h3 class="font-semibold">{{ data.book.title }}</h3>
                              <p class="text-sm text-gray-500 capitalize">Author: {{ data.book.author }}</p>
                              <p class="text-sm text-gray-500 capitalize">Kategori: {{ data.book.category.name }}
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div class="flex gap-2 p-2 w-full z-50">
               <!-- Button Accept / Reject -->
               <motion.button @click="setStatus('reject')" :while-press="{ scale: 0.8 }"
                  class="flex-1 py-2 rounded-md bg-red-100 dark:bg-red-400/25 border border-red-500 text-red-600 dark:text-red-200">Reject
               </motion.button>
               <motion.button @click="setStatus('approve')" :while-press="{ scale: 0.8 }"
                  class="flex-1 py-2 rounded-md bg-green-100 dark:bg-green-400/25 border border-green-500 text-green-600 dark:text-green-200">Approve
               </motion.button>
            </div>
         </SheetContent>
      </Sheet>
      <Tabs default-value="2">
         <TabsList class="grid gap-1 grid-cols-2 max-w-2xl">
            <TabsTrigger value="1"> Request </TabsTrigger>
            <TabsTrigger value="2"> Riwayat </TabsTrigger>
         </TabsList>
         <TabsContent value="1">

            <div>
               <div class="text-2xl flex items-center justify-between my-4 font-semibold">
                  <div>
                     <h3 class="text-lg font-medium">Request Peminjaman ({{ filter_data.length }})</h3>
                     <p class="text-sm text-muted-foreground">Daftar Request Peminjaman</p>
                  </div>
               </div>
               <DataTable :data="filter_data" :columns="table_lending" />
            </div>
         </TabsContent>
         <TabsContent value="2">
            <div>
               <div class="text-2xl flex items-center justify-between my-4 font-semibold">
                  <div>
                     <h3 class="text-lg font-medium">History Peminjaman ({{ allLendings?.data.length || 0 }})</h3>
                     <p class="text-sm text-muted-foreground">Riwayat semua peminjaman buku</p>
                  </div>
               </div>
               <DataTable :data="allLendings?.data || []" :columns="table_history" />
            </div>
         </TabsContent>
      </Tabs>
   </Layout>
</template>

<script lang="ts" setup>
definePageMeta({
   layout: "admin",
   middleware: ["admin"], // Use the new admin-auth middleware
});

import { motion } from "motion-v";

import { columns as table_lending } from "~/components/admin/library/confirm";
import { columns as table_history } from "~/components/admin/library/history";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DataTable from "~/components/admin/base/datatable.vue";

import { useLocalStorage } from "@vueuse/core";

const filter_data = computed(() => {
   return scanned.value.filter((item) => item.status_request === "pending");
});

import { differenceInCalendarDays, isAfter } from "date-fns";

const overdueDays = computed(() => {
   if (!lend_detail.value?.data?.return_date) return 0;
   const returnDate = new Date(lend_detail.value.data.return_date);
   const today = new Date();
   return differenceInCalendarDays(today, returnDate) || 1;
});

const totalFine = computed(() => {
   const days = overdueDays.value;
   if (days === 0) {
      return 20000
   };

   return days * 20000;
});

const scanned = useLocalStorage<any[]>("scanned-codes", []);

import Layout from "@/components/admin/library/layout.vue";

const open = ref(false);
const adminStore = useAdminStore();
const setStatus = async (action: string) => {
   const id_request = useRoute().query.request;
   const id = Number(useRoute().query.id);
   const res: any = await adminStore.setLending(id, action);

   // console.log("Response from setLending:", res);

   if (res.success) {
      useRouter().push('/admin/library/lending');
      toast.success(res.message);
      // Update the local storage status_request to action
      const index = scanned.value.findIndex((item) => item.id_request === id_request);
      console.log("Index of item to update:", index);
      if (index !== -1) {
         scanned.value[index].status_request = action;
      }
   } else {
      toast.error("Failed to update item status");
   }
};

onMounted(() => {
   if (useRoute().query.id) {
      open.value = true;
   }
});

import BeepSound from "/beep2.mp3";
let beep: any;

onMounted(() => {
   beep = new Audio(BeepSound);
});

let prevLength = filter_data.value.length;
import { toast } from "vue3-toastify";

watch(filter_data, (value) => {
   if (value.length > prevLength) {
      // Show toast
      toast.success("Ada request baru!");
      // Play beep
      if (beep) beep.play();
   }
   prevLength = value.length;
});

watch(
   () => useRoute().query.id,
   (value) => {
      if (value) {
         open.value = true;
      } else {
         open.value = false;
      }
   }
);

const config = useRuntimeConfig().public.API_URL;
const { token } = useAuth();

const { data: lend_detail, refresh } = await useAsyncData<any>(
   "qrcode",
   async () => {
      if (!useRoute().query.id) return null;
      return await $fetch(`${config}lending/history/detail/${useRoute().query.id}`, {
         method: "GET",
         headers: {
            Authorization: `Bearer ${token.value}`,
         },
      });
   },
   { watch: [open] }
);

// Fetch all lending records for history tab
const { data: allLendings } = await useAsyncData<any>(
   "all-lendings",
   async () => {
      return await $fetch(`${config}lending/all`, {
         method: "GET",
         headers: {
            Authorization: `Bearer ${token.value}`,
         },
      });
   }
);

watch(lend_detail, (value) => {
   console.log("Lend detail updated:", value?.data.return_date);
});
</script>

<style></style>
