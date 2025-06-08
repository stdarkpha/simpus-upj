<template>
   <form class="space-y-6 max-w-2xl" @submit.prevent="addCategory">
      <Separator class="my-6" />
      <div class="grid w-full items-center gap-3.5">
         <Label for="nameEn">Name EN</Label>
         <Input id="nameEn" v-model="nameEn" type="text" placeholder="Name EN" />
      </div>
      <div class="grid w-full items-center gap-3.5">
         <Label for="nameId">Name ID</Label>
         <Input id="nameId" v-model="nameId" type="text" placeholder="Name ID" />
      </div>
      <Button type="submit"> Submit </Button>
   </form>
</template>

<script setup lang="ts">
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "vue-sonner";

const nameEn = ref("");
const nameId = ref("");
const emit = defineEmits();
const client = useSanctumClient();

const addCategory = async () => {
   const payload = {
      id: props.id ?? null,
      name_en: nameEn.value,
      name_id: nameId.value,
   };

   await client("client/category", {
      method: "POST",
      body: JSON.stringify(payload),
      onResponse({ response }) {
         if (response._data.message) {
            emit("refresh");
            toast({
               title: "Success",
               description: response._data.message,
            });
            useAdminStore().fetchClientGroupData();
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

const props = defineProps<{
   id?: number | null;
}>();

if (props.id) {
   await client(`client/category/${props.id}`, {
      onResponse({ response }) {
         // Map Data
         const data = response._data.data;
         if (!data) {
            emit("refresh");
            toast({
               title: "Error",
               description: "Categories not found",
               variant: "destructive",
            });
         }

         // set form data
         nameEn.value = data.name_en;
         nameId.value = data.name_id;
      },
   });
}
</script>
