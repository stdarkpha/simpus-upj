<script lang="ts" setup>
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { computed } from "vue";

interface Mail {
   id: string;
   name: string;
   subject: string;
   email: string;
   date?: string;
   text: string;
}

interface MailDisplayProps {
   mail: Mail | undefined;
}

const props = defineProps<MailDisplayProps>();

const mailFallbackName = computed(() => {
   return props.mail?.name
      .split(" ")
      .map((chunk) => chunk[0])
      .join("");
});

import { Icon } from "@iconify/vue";
import { toast } from "vue-sonner";

import { type UserData } from "@/components/admin/user/type";
const role = useSanctumUser<UserData>().value?.role_id;

const emit = defineEmits();
const open = ref(false);
const client = useSanctumClient();

const deleteItems = async () => {
   await client(`contact/${props.mail?.id}`, {
      headers: {
         "Content-Type": "application/json",
         Accept: "application/json",
      },
      method: "DELETE",
   }).then((response: any) => {
      toast({
         title: "Deleted",
         description: response.message,
      });
      emit("refresh");
      const store = useAdminStore();
      store.data_contact = store.data_contact.filter((item: any) => item.id !== props.mail?.id);
   });
};

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
</script>

<template>
   <div class="flex h-full flex-col">
      <div v-if="mail" class="flex flex-1 flex-col animate__animated animate__fadeIn">
         <div class="flex items-start p-4">
            <div class="flex items-start gap-4 text-sm">
               <Avatar>
                  <AvatarFallback>
                     {{ mailFallbackName }}
                  </AvatarFallback>
               </Avatar>
               <div class="grid gap-1">
                  <div class="font-semibold">
                     {{ mail.name }}
                  </div>
                  <div class="line-clamp-1 text-xs">
                     {{ mail.subject }}
                  </div>
                  <div class="line-clamp-1 text-xs"><span class="font-medium">Email:</span> {{ mail.email }}</div>
               </div>
            </div>
            <div v-if="mail.date" class="ml-auto text-xs text-muted-foreground">
               {{ format(new Date(mail.date), "PPpp") }}
            </div>
         </div>
         <Separator />
         <div class="flex-1 whitespace-pre-wrap p-4 text-sm">
            {{ mail.text }}
         </div>
         <Separator class="mt-auto" />
         <div class="p-4">
            <form>
               <div class="grid gap-4">
                  <div class="flex items-center">
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
                     <Button v-if="role == 1 || role == 2" @click="open = true" variant="destructive" type="button" size="sm" class="ml-auto"> Delete Message </Button>
                     <Button @click="emit('refresh')" type="button" size="sm" class="ml-4"> Close Message </Button>
                  </div>
               </div>
            </form>
         </div>
      </div>
      <div v-else class="p-8 text-center flex flex-col h-full items-center justify-center text-muted-foreground animate__animated animate__fadeIn">
         <Icon class="text-8xl animate__animated animate__headShake" icon="fluent:mail-inbox-28-regular" />
         <div class="text-xl text-white mt-4 mb-2 font-semibold">No mail selected</div>
         <p>Select a mail to read</p>
      </div>
   </div>
</template>
