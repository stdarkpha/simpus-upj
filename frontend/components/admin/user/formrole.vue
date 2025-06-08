<template>
   <form class="space-y-6 max-w-2xl" @submit.prevent="submitForm">
      <Separator class="my-6" />
      <div class="grid w-full items-center gap-3.5">
         <Label for="name">Name</Label>
         <Input id="name" v-model="name" type="text" placeholder="Name" />
      </div>
      <Button type="submit"> Submit </Button>
   </form>
</template>

<script setup lang="ts">
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "vue-sonner";

const props = defineProps<{
   id?: number;
}>();

const emit = defineEmits();
const name = ref("");
const client = useSanctumClient();

const submitForm = async () => {
   const formData = {
      id: props.id ? props.id.toString() : undefined,
      name: name.value,
   };

   await client("user/role/add", {
      method: "POST",
      body: formData,
      onResponse({ response }) {
         if (response._data.message) {
            emit("refresh");
            toast({
               title: "Success",
               description: response._data.message,
            });
            useAdminStore().fetchRolesData();
         }
      },
      onResponseError({ response }) {
         Object.keys(response._data.errors).forEach((key) => {
            response._data.errors[key].forEach(async (error: any) => {
               toast({
                  title: "Error",
                  description: error,
                  variant: "destructive",
               });
            });
         });
      },
   });
};

if (props.id) {
   client(`user/role/${props.id}`, {
      onResponse({ response }) {
         // Map Data
         const data = response._data.data;
         if (!data) {
            emit("refresh");
            toast({
               title: "Error",
               description: "Client not found",
               variant: "destructive",
            });
         }
         console.log("Data", data);

         // set form data
         name.value = data.name;
      },
   });
}
</script>
