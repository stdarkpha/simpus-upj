<script setup lang="ts">
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "vue-sonner";

const props = defineProps<{
   detail: string;
   id: number;
   id_request: string;
   fetch?: Function;
}>();
import { Icon } from "@iconify/vue";
import { Button } from "~/components/ui/button";
import type admin from "~/middleware/admin";
const { token } = useAuth();

const adminStore = useAdminStore();

import { useLocalStorage } from "@vueuse/core";

const scanned = useLocalStorage<any[]>("scanned-codes", []);

const setStatus = async (action: string) => {
   const res: any = await adminStore.setLending(props.id, action);

   // console.log("Response from setLending:", res);

   if (res.success) {
      toast.success(res.message);
      // Update the local storage status_request to action
      const index = scanned.value.findIndex((item) => item.id_request === props.id_request);
      console.log("Index of item to update:", index);
      if (index !== -1) {
         scanned.value[index].status_request = action;
      }
   } else {
      toast.error("Failed to update item status");
   }
};
</script>

<template>
   <DropdownMenu>
      <DropdownMenuTrigger>
         <Button variant="ghost" size="sm">
            <Icon icon="tabler:dots" />
         </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
         <DropdownMenuLabel>Action</DropdownMenuLabel>
         <DropdownMenuSeparator />
         <DropdownMenuItem>
            <NuxtLink :to="props.detail" class="flex items-center w-full">
               Detail
               <Icon icon="fluent:open-12-regular" class="ml-auto" />
            </NuxtLink>
         </DropdownMenuItem>
         <DropdownMenuItem class="text-green-700" @click="setStatus('approve')">
            Approve
            <Icon icon="akar-icons:check-box" class="ml-auto text-green-700" />
         </DropdownMenuItem>
         <DropdownMenuItem class="text-red-600" @click="setStatus('reject')">
            Reject
            <Icon icon="uil:times-square" class="ml-auto text-red-600" />
         </DropdownMenuItem>
      </DropdownMenuContent>
   </DropdownMenu>
</template>
