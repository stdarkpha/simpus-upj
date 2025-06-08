<template>
   <div class="flex-col flex">
      <div class="flex-1 space-y-4">
         <div class="flex max-md:flex-wrap items-center justify-between space-y-2">
            <h2 class="text-3xl font-bold tracking-tight">Dashboard</h2>
         </div>
         <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
               <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle class="text-sm font-medium"> Total Client </CardTitle>
                  <Icon icon="mdi:user-group" class="text-xl" />
               </CardHeader>
               <CardContent>
                  <div class="text-2xl font-bold">
                     <!-- {{ store.data_client.length }} -->
                  </div>
                  <p class="text-xs text-muted-foreground">IMS Global Client</p>
               </CardContent>
            </Card>
            <Card>
               <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle class="text-sm font-medium"> Total Product </CardTitle>
                  <Icon icon="ant-design:product-filled" class="text-xl" />
               </CardHeader>
               <CardContent>
                  <div class="text-2xl font-bold">
                     <!-- {{ store.data_product.length }} -->
                  </div>
                  <p class="text-xs text-muted-foreground">Highlight Product Home</p>
               </CardContent>
            </Card>
            <Card>
               <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle class="text-sm font-medium"> Total Project </CardTitle>
                  <Icon icon="basil:document-solid" class="text-xl" />
               </CardHeader>
               <CardContent>
                  <div class="text-2xl font-bold">
                     <!-- {{ store.data_project.length }} -->
                  </div>
                  <p class="text-xs text-muted-foreground">Reference Project</p>
               </CardContent>
            </Card>
            <Card>
               <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle class="text-sm font-medium"> Inbox </CardTitle>
                  <Icon icon="ic:round-mail" class="text-xl" />
               </CardHeader>
               <CardContent>
                  <div class="text-2xl font-bold">
                     <!-- {{ store.data_contact.length }} -->
                  </div>
                  <p class="text-xs text-muted-foreground">Inbox Contact Us</p>
               </CardContent>
            </Card>
         </div>
         <div>
            <Card>
               <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle class="text-sm font-medium"> Analytics Overview </CardTitle>
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
});

import { Icon } from "@iconify/vue";

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
