<template>
   <form class="space-y-6 max-w-2xl" @submit.prevent="formSubmit" enctype="multipart/form-data">
      <Separator class="my-6" />
      <div class="grid w-full items-center gap-3.5">
         <Label for="category">Category</Label>
         <Select id="category" v-model="category">
            <SelectTrigger>
               <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
               <SelectItem v-for="category in props.category_data" :key="category.id" :value="category.id">
                  {{ category.name_en }}
               </SelectItem>
            </SelectContent>
         </Select>
      </div>
      <div class="grid w-full items-center gap-3.5">
         <Label for="name">Client Name</Label>
         <Input id="name" v-model="name" type="text" placeholder="Page Name" />
      </div>
      <div class="grid w-full items-center gap-3.5">
         <Label for="picture">Picture</Label>
         <Input id="picture" @change="handleFile" type="file" />
      </div>
      <div class="grid w-full items-center gap-3.5">
         <Label for="status">Status</Label>
         <Select id="status" v-model="status">
            <SelectTrigger>
               <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
               <SelectItem value="active">Active</SelectItem>
               <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
         </Select>
      </div>
      <Button type="submit"> Submit </Button>
   </form>
</template>

<script setup lang="ts">
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "vue-sonner";

const props = defineProps<{
   category_data: any;
   id?: number;
}>();

const name = ref("");
const category = ref<number | null>(null);
const status = ref("active");
const image = ref<File | null>(null);
const emit = defineEmits();
const client = useSanctumClient();

const handleFile = (event: Event) => {
   const target = event.target as HTMLInputElement;
   const file = target.files?.[0];
   if (file) {
      image.value = file;
   }
   //get filename without extension
   name.value = file?.name.split(".").slice(0, -1).join(".") || "";
};

const formSubmit = async () => {
   const formData = new FormData();
   if (props.id) {
      formData.append("id", props.id.toString());
   }

   if (category.value !== null) {
      formData.append("client_category_id", category.value.toString());
   }

   if (image.value) {
      formData.append("image", image.value);
   }

   formData.append("name", name.value);
   formData.append("status", status.value);

   await client("client", {
      method: "POST",
      body: formData,
      onResponse({ response }) {
         if (response._data.message) {
            emit("refresh");
            toast({
               title: "Success",
               description: response._data.message,
            });
            useAdminStore().fetchClientData();
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
   await client(`client/${props.id}`, {
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

         // set form data
         name.value = data.name;
         status.value = data.status;
         category.value = data.client_category_id;
      },
   });
}
</script>
