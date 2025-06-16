<template>
   <div class="flex-col flex">
      <div class="flex-1 space-y-4">
         <div class="flex max-md:flex-wrap items-center justify-between space-y-2">
            <h2 class="text-3xl font-bold tracking-tight">Dashboard</h2>
         </div>
         <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
               <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle class="text-sm font-medium"> Total Buku </CardTitle>
                  <Icon icon="ph:books-fill" class="text-xl" />
               </CardHeader>
               <CardContent>
                  <div class="text-2xl font-bold">
                     <!-- {{ store.data_client.length }} -->
                  </div>
                  <p class="text-xs text-muted-foreground">Buku pada perpustakaan</p>
               </CardContent>
            </Card>
            <Card>
               <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle class="text-sm font-medium"> Total Pengguna </CardTitle>
                  <Icon icon="mdi:user-group" class="text-xl" />
               </CardHeader>
               <CardContent>
                  <div class="text-2xl font-bold">
                     <!-- {{ store.data_product.length }} -->
                  </div>
                  <p class="text-xs text-muted-foreground">Mahasiswa Terdaftar</p>
               </CardContent>
            </Card>
            <Card>
               <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle class="text-sm font-medium"> Total Peminjaman </CardTitle>
                  <Icon icon="mdi:book-play" class="text-xl" />
               </CardHeader>
               <CardContent>
                  <div class="text-2xl font-bold">
                     <!-- {{ store.data_project.length }} -->
                  </div>
                  <p class="text-xs text-muted-foreground">Peminjaman Buku</p>
               </CardContent>
            </Card>
            <Card>
               <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle class="text-sm font-medium"> Total Pengembalian </CardTitle>
                  <Icon icon="mdi:book-sync" class="text-xl" />
               </CardHeader>
               <CardContent>
                  <div class="text-2xl font-bold">
                     <!-- {{ store.data_contact.length }} -->
                  </div>
                  <p class="text-xs text-muted-foreground">Pengembalian Buku</p>
               </CardContent>
            </Card>
         </div>
         <div>
            <Card>
               <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle class="text-sm font-medium">Grafik Analitik </CardTitle>
                  <Icon icon="solar:chart-bold" class="text-xl" />
               </CardHeader>
               <CardContent>
                  <!-- <AdminOverview /> -->
               </CardContent>
            </Card>
         </div>
      </div>
   </div>
</template>

<script lang="ts" setup>
definePageMeta({
   layout: "admin",
   middleware: ["admin"], // Use the new admin-auth middleware
});

import { Icon } from "@iconify/vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
const { data } = useAuth();
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

// const store = useAdminStore();

onMounted(async () => {
   //  await store.fetchClientData();
   //  await store.fetchProductData();
   //  await store.fetchProjectData();
   //  await store.fetchContactData();
});

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
</script>

<style></style>
