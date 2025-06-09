<script setup lang="ts">
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "vue-sonner";

const props = defineProps<{
   edit: string;
   delete: string;
   fetch?: Function;
}>();
import { Icon } from "@iconify/vue";
import { Button } from "~/components/ui/button";
const { token } = useAuth();
// const client = useSanctumClient();

const deleteItems = async () => {
   await $fetch(`${props.delete}`, {
      headers: {
         Authorization: `Bearer ${token.value}`,
         Accept: "application/json",
      },
      method: "DELETE",
      onResponse({ response }) {
         if (response._data.success) {
            toast.success("Item deleted successfully");
            open.value = false;
            if (props.fetch) {
               props.fetch();
            }
         } else {
            toast.error(response._data.message || "Failed to delete item");
         }
      },
   })
};

const open = ref(false);
</script>

<template>
   <AlertDialog v-model:open="open">
      <AlertDialogContent>
         <AlertDialogHeader>
            <AlertDialogTitle>Delete Item?</AlertDialogTitle>
            <AlertDialogDescription> Are you sure you want to delete this item? </AlertDialogDescription>
         </AlertDialogHeader>
         <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction @click="deleteItems">Continue</AlertDialogAction>
         </AlertDialogFooter>
      </AlertDialogContent>
   </AlertDialog>
   <DropdownMenu>
      <DropdownMenuTrigger>
         <Button variant="ghost" size="sm">
            <Icon icon="tabler:dots" />
         </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
         <DropdownMenuLabel>Action</DropdownMenuLabel>
         <DropdownMenuSeparator />
         <NuxtLink :to="edit">
            <DropdownMenuItem>
               Edit
               <Icon icon="lucide:edit" class="ml-auto" />
            </DropdownMenuItem>
         </NuxtLink>

         <DropdownMenuItem @click="open = true">
            Delete
            <Icon icon="mi:delete" class="ml-auto" />
         </DropdownMenuItem>
      </DropdownMenuContent>
   </DropdownMenu>
</template>
