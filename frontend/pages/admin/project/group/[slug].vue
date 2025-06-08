<template>
   <form class="space-y-6 w-full max-w-2xl" @submit.prevent="submit" enctype="multipart/form-data">
      <div>
         <h3 class="text-lg font-medium">Form Group Project</h3>
         <p class="text-sm text-muted-foreground">{{ slug == "add" ? "Add New" : "Edit" }} Project</p>
      </div>
      <Separator class="my-6" />
      <div class="grid w-full items-center gap-3.5">
         <Label for="picture">Page Banner</Label>
         <Input id="picture" @change="handleFile" type="file" />
      </div>
      <div class="grid w-full items-center gap-3.5">
         <Label for="name_en">Group Name (EN)</Label>
         <Input id="name_en" v-model="name_en" type="text" placeholder="Group Name (EN)" />
      </div>
      <div class="grid w-full items-center gap-3.5">
         <Label for="name_id">Group Name (ID)</Label>
         <Input id="name_id" v-model="name_id" type="text" placeholder="Group Name (ID)" />
      </div>
      <div class="flex gap-4">
         <Button type="submit"> Submit Data </Button>
         <NuxtLink to="/admin/project?tab=group">
            <Button variant="destructive" type="button"> Cancel </Button>
         </NuxtLink>
      </div>
   </form>
</template>

<script setup lang="ts">
definePageMeta({
   layout: "admin",
});

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "vue-sonner";

const slug = useRoute().params.slug;
const id = ref("");
const name_en = ref("");
const name_id = ref("");
const image = ref<File | null>(null);
const client = useSanctumClient();

const handleFile = (event: Event) => {
   const target = event.target as HTMLInputElement;
   const file = target.files?.[0];
   if (file) {
      image.value = file;
   }
};

const submit = async () => {
   const formData = new FormData();
   formData.append("name_en", name_en.value);
   formData.append("name_id", name_id.value);
   if (image.value) {
      formData.append("image", image.value);
   }

   if (id.value) {
      formData.append("id", id.value);
   }

   client("project/group", {
      method: "POST",
      body: formData,
      onResponse({ response }) {
         if (response._data.message) {
            useRouter().push("/admin/project?tab=group");
            toast({
               title: "Success",
               description: response._data.message,
            });
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

onMounted(async () => {
   if (slug && !isNaN(Number(slug))) {
      client(`project/group/${slug}`, {
         onResponse({ response }) {
            // Map Data
            const data = response._data.data;
            if (!data) {
               useRouter().push("/admin/project?tab=group");
               toast({
                  title: "Error",
                  description: "Group not found",
                  variant: "destructive",
               });
            }
            id.value = data.id;
            name_en.value = data.name_en;
            name_id.value = data.name_id;
         },
      });
   }
});
</script>
