<script setup lang="ts"></script>

<template>
   <SidebarMenu>
      <SidebarMenuItem>
         <SidebarMenuButton size="lg" class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
            <div class="aspect-square size-8 flex items-center justify-center rounded-lg">
               <!-- <img class="dark:grayscale dark:brightness-[5]" src="/assets/favicon.png" alt="Logo"> -->
            </div>
            <div class="grid flex-1 text-left text-sm leading-tight">
               <span class="truncate font-semibold"> IMS Global Services </span>
               <span class="truncate text-xs text-muted-foreground">CMS Admin - {{ new Date().getFullYear() }}</span>
            </div>
         </SidebarMenuButton>
      </SidebarMenuItem>
   </SidebarMenu>
</template>

<style scoped></style>
