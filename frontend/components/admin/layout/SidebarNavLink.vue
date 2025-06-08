<script setup lang="ts">
import { type SidebarMenuButtonVariants, useSidebar } from "~/components/ui/sidebar";
import { Icon } from "@iconify/vue";

withDefaults(
   defineProps<{
      item: any;
      size?: SidebarMenuButtonVariants["size"];
   }>(),
   {
      size: "default",
   }
);

const { setOpenMobile } = useSidebar();
</script>

<template>
   <SidebarMenu>
      <SidebarMenuItem>
         <SidebarMenuButton as-child :tooltip="item.title" :size="size">
            <NuxtLink :to="item.link" @click="setOpenMobile(false)">
               <Icon :icon="item.icon || ''" mode="svg" />
               <span>{{ item.title }}</span>
               <span v-if="item.new" class="rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-xs text-black leading-none no-underline group-hover:no-underline"> New </span>
            </NuxtLink>
         </SidebarMenuButton>
      </SidebarMenuItem>
   </SidebarMenu>
</template>

<style scoped></style>
