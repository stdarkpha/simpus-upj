<template>
   <form class="space-y-6 max-w-2xl" @submit.prevent="addProduct" enctype="multipart/form-data">
      <Separator class="my-6" />

      <div class="grid w-full items-center gap-3.5">
         <Label for="name">Product Name</Label>
         <Input id="name" v-model="name" type="text" placeholder="Product Name" />
      </div>
      <div class="grid w-full items-center gap-3.5">
         <Label for="image">Image</Label>
         <Input id="image" @change="handleFile" type="file" />
      </div>

      <Tabs default-value="en">
         <TabsList>
            <TabsTrigger value="en"> EN </TabsTrigger>
            <TabsTrigger value="id"> ID </TabsTrigger>
         </TabsList>
         <TabsContent class="space-y-6 py-4" value="en">
            <div class="grid w-full items-center gap-3.5">
               <Label for="titleEn">Title EN</Label>
               <Input id="titleEn" v-model="titleEn" type="text" placeholder="Title EN" />
            </div>
            <div class="grid w-full items-center gap-3.5">
               <Label for="descriptionEn">Description EN</Label>
               <Textarea id="descriptionEn" v-model="descriptionEn" type="text" placeholder="Description EN" />
            </div>
         </TabsContent>
         <TabsContent class="space-y-6 py-4" value="id">
            <div class="grid w-full items-center gap-3.5">
               <Label for="titleId">Title ID</Label>
               <Input id="titleId" v-model="titleId" type="text" placeholder="Title ID" />
            </div>
            <div class="grid w-full items-center gap-3.5">
               <Label for="descriptionId">Description ID</Label>
               <Textarea id="descriptionId" v-model="descriptionId" type="text" placeholder="Description ID" />
            </div>
         </TabsContent>
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
      </Tabs>

      <Button type="submit"> Submit </Button>
   </form>
</template>

<script setup lang="ts">
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "vue-sonner";

const name = ref("");
const titleEn = ref("");
const descriptionEn = ref("");
const titleId = ref("");
const descriptionId = ref("");
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
};

const addProduct = async () => {
   const formData = new FormData();
   if (props.id) {
      formData.append("id", props.id.toString());
   }
   if (image.value) {
      formData.append("image", image.value);
   }
   formData.append("name", name.value);
   formData.append("status", status.value);
   formData.append(
      "translations",
      JSON.stringify([
         { locale: "en", title: titleEn.value, description: descriptionEn.value },
         { locale: "id", title: titleId.value, description: descriptionId.value },
      ])
   );

   await client("product", {
      method: "POST",
      body: formData,
      onResponse({ response }) {
         if (response._data.message) {
            emit("refresh");
            toast({
               title: "Success",
               description: response._data.message,
            });
            useAdminStore().fetchProductData();
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
   id?: number;
}>();

if (props.id) {
   client(`product/${props.id}`, {
      onResponse({ response }) {
         // Map Data
         const data = response._data.data;
         if (!data) {
            emit("refresh");
            toast({
               title: "Error",
               description: "Product not found",
               variant: "destructive",
            });
         }

         // set form data
         name.value = data.name;
         status.value = data.status;
         const translations = data.translations;
         translations.forEach((translation: any) => {
            if (translation.locale === "en") {
               titleEn.value = translation.title;
               descriptionEn.value = translation.description;
            } else if (translation.locale === "id") {
               titleId.value = translation.title;
               descriptionId.value = translation.description;
            }
         });
      },
   });
}
</script>
