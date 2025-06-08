<template>
   <form class="space-y-6 max-w-2xl" @submit.prevent="submitData" enctype="multipart/form-data">
      <Separator class="my-6" />

      <div class="grid w-full items-center gap-3.5">
         <Label for="name">Name / Key</Label>
         <Input id="name" v-model="name" type="text" placeholder="Name / Key" />
      </div>
      <div class="grid w-full items-center gap-3.5">
         <Label for="data_file">File</Label>
         <Input id="data_file" @change="handleFile" type="file" />
      </div>

      <div class="grid w-full items-center gap-3.5">
         <Label for="name">Detail</Label>
         <Input id="name" v-model="detail" type="text" placeholder="Detail / File Name" />
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

const name = ref("");
const detail = ref("");
const data_file = ref<File | null>(null);
const emit = defineEmits();
const client = useSanctumClient();

const handleFile = (event: Event) => {
   const target = event.target as HTMLInputElement;
   const file = target.files?.[0];
   if (file) {
      data_file.value = file;
   }

   detail.value = file?.name.split(".").slice(0, -1).join(".") || "";
};

const submitData = async () => {
   const formData = new FormData();
   if (props.id) {
      formData.append("id", props.id.toString());
   }
   if (data_file.value) {
      formData.append("file", data_file.value);
   }
   formData.append("name", name.value);
   formData.append("value", detail.value);

   await client("setting", {
      method: "POST",
      body: formData,
      onResponse({ response }) {
         if (response._data.message) {
            emit("refresh");
            toast({
               title: "Success",
               description: response._data.message,
            });
            useAdminStore().fetchSettingData();
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
   client(`setting/${props.id}`, {
      onResponse({ response }) {
         // Map Data
         const data = response._data;
         if (!data) {
            emit("refresh");
            toast({
               title: "Error",
               description: "Setting Item not found",
               variant: "destructive",
            });
         }

         // set form data
         name.value = data.name;
         detail.value = data.value;
      },
   });
}
</script>
