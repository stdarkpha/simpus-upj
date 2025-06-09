<script setup lang="ts">
import { useSidebar } from "~/components/ui/sidebar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuGroup, DropdownMenuSeparator } from "~/components/ui/dropdown-menu";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "~/components/ui/dialog";

import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";

defineProps<{
   user: {
      id: number; name: string; email: string; role: string; uid: string; img: string | null; token: string;
   };
}>();

const { isMobile } = useSidebar();
const { signOut } = useAuth();

const logoutUser = async () => {
   await signOut({ callbackUrl: "/admin/login" });
};

const showModalTheme = ref(false);
import { Icon } from "@iconify/vue";
</script>

<template>
   <SidebarMenu>
      <SidebarMenuItem>
         <DropdownMenu>
            <DropdownMenuTrigger as-child>
               <SidebarMenuButton size="lg"
                  class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                  <Avatar class="h-8 w-8 rounded-lg">
                     <AvatarImage v-if="user.img" :src="user.img" :alt="user.name" />
                     <AvatarFallback class="rounded-lg">
                        {{
                           user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                        }}
                     </AvatarFallback>
                  </Avatar>
                  <div class="grid flex-1 text-left text-sm leading-tight">
                     <span class="truncate font-semibold">{{ user.name }}</span>
                     <span class="truncate text-xs">{{ user.email }}</span>
                  </div>
                  <Icon icon="lucide-chevrons-up-down" class="ml-auto size-4" />
               </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="min-w-56 w-[--radix-dropdown-menu-trigger-width] rounded-lg"
               :side="isMobile ? 'bottom' : 'right'" align="end">
               <DropdownMenuLabel class="p-0 font-normal">
                  <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                     <Avatar class="h-8 w-8 rounded-lg">
                        <AvatarImage v-if="user.img" :src="user.img" :alt="user.name" />
                        <AvatarFallback class="rounded-lg">
                           {{
                              user.name
                                 .split(" ")
                                 .map((n) => n[0])
                                 .join("")
                           }}
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
                  <NuxtLink :to="`/admin/user?id=${user.id}`">
                     <DropdownMenuItem>
                        <Icon icon="lucide-user" />
                        Account
                     </DropdownMenuItem>
                  </NuxtLink>
                  <DropdownMenuItem>
                     <Icon icon="lucide-bell" />
                     Notifications
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
               </DropdownMenuGroup>
               <DropdownMenuSeparator />
               <DropdownMenuItem @click="logoutUser">
                  <Icon icon="lucide-log-out" />
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
            <DialogDescription class="text-xs text-muted-foreground"> Customize & Preview in Real Time
            </DialogDescription>
         </DialogHeader>
         <!-- <ThemeCustomize /> -->
      </DialogContent>
   </Dialog>
</template>

<style scoped></style>
