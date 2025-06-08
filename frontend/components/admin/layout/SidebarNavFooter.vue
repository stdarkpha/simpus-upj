<script setup lang="ts">
import { useSidebar } from "~/components/ui/sidebar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuGroup, DropdownMenuSeparator } from "~/components/ui/dropdown-menu";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "~/components/ui/dialog";

import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";

defineProps<{
   user: {
      name: string;
      email: string;
      avatar: string | null;
   };
}>();

const { isMobile } = useSidebar();

const logoutUser = async () => {
   await useSanctumAuth().logout();
};

const showModalTheme = ref(false);
import { Icon } from "@iconify/vue";
</script>

<template>
   <SidebarMenu>
      <SidebarMenuItem>
         <DropdownMenu>
            <DropdownMenuTrigger as-child>
               <SidebarMenuButton size="lg" class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                  <Avatar class="h-8 w-8 rounded-lg">
                     <AvatarImage v-if="user.avatar" :src="user.avatar" :alt="user.name" />
                     <AvatarFallback class="rounded-lg">
                        <!-- {{
                           user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                        }} -->
                     </AvatarFallback>
                  </Avatar>
                  <div class="grid flex-1 text-left text-sm leading-tight">
                     <span class="truncate font-semibold">{{ user.name }}</span>
                     <span class="truncate text-xs">{{ user.email }}</span>
                  </div>
                  <Icon icon="i-lucide-chevrons-up-down" class="ml-auto size-4" />
               </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="min-w-56 w-[--radix-dropdown-menu-trigger-width] rounded-lg" :side="isMobile ? 'bottom' : 'right'" align="end">
               <DropdownMenuLabel class="p-0 font-normal">
                  <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                     <Avatar class="h-8 w-8 rounded-lg">
                        <AvatarImage v-if="user.avatar" :src="user.avatar" :alt="user.name" />
                        <AvatarFallback class="rounded-lg">
                           <!-- {{
                              user.name
                                 .split(" ")
                                 .map((n) => n[0])
                                 .join("")
                           }} -->
                        </AvatarFallback>
                     </Avatar>
                     <div class="grid flex-1 text-left text-sm leading-tight">
                        <span class="truncate font-semibold">{{ user.name }}</span>
                        <span class="truncate text-xs">{{ user.email }}</span>
                     </div>
                  </div>
               </DropdownMenuLabel>
               <DropdownMenuSeparator />
               <DropdownMenuGroup>
                  <NuxtLink to="/admin/user">
                     <DropdownMenuItem>
                        <Icon icon="i-lucide-user" />
                        Account
                     </DropdownMenuItem>
                  </NuxtLink>
                  <!-- <DropdownMenuItem as-child>
              <NuxtLink to="/settings" @click="setOpenMobile(false)">
                <Icon name="i-lucide-settings" />
                Settings
              </NuxtLink>
            </DropdownMenuItem> -->
                  <DropdownMenuItem>
                     <Icon icon="i-lucide-bell" />
                     Notifications
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
               </DropdownMenuGroup>
               <DropdownMenuSeparator />
               <DropdownMenuItem @click="logoutUser">
                  <Icon icon="i-lucide-log-out" />
                  Log out
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      </SidebarMenuItem>
   </SidebarMenu>

   <Dialog v-model:open="showModalTheme">
      <DialogContent>
         <DialogHeader>
            <DialogTitle>Customize</DialogTitle>
            <DialogDescription class="text-xs text-muted-foreground"> Customize & Preview in Real Time </DialogDescription>
         </DialogHeader>
         <!-- <ThemeCustomize /> -->
      </DialogContent>
   </Dialog>
</template>

<style scoped></style>
