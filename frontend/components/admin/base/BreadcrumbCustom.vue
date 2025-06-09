<script setup lang="ts">
interface Links {
   title: string;
   href: string;
}
withDefaults(
   defineProps<{
      links: Links[];
      separator?: string;
   }>(),
   {
      separator: "lucide-chevron-right",
   }
);

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

import { Icon } from "@iconify/vue";
</script>

<template>
   <Breadcrumb>
      <BreadcrumbList>
         <template v-for="(link, index) in links" :key="index">
            <BreadcrumbItem>
               <BreadcrumbLink v-if="index !== links.length - 1" as-child>
                  <NuxtLink :to="link.href">
                     {{ link.title }}
                  </NuxtLink>
               </BreadcrumbLink>
               <BreadcrumbPage v-else>
                  {{ link.title }}
               </BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator v-if="index < links.length - 1">
               <Icon icon="lucide:chevron-right" />
            </BreadcrumbSeparator>
         </template>
      </BreadcrumbList>
   </Breadcrumb>
</template>

<style scoped></style>
