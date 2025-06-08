<template>
   <form class="space-y-6 h-full overflow-auto scrollbar-thin pr-4" @submit.prevent="submitForm" enctype="multipart/form-data">
      <div>
         <h3 class="text-lg font-medium">Form Service</h3>
         <p class="text-sm text-muted-foreground">{{ slug != "add" ? "Edit" : "Add New" }} Service</p>
      </div>
      <Separator class="my-6" />

      <Tabs default-value="en">
         <TabsList>
            <TabsTrigger value="en"> EN </TabsTrigger>
            <TabsTrigger value="id"> ID </TabsTrigger>
         </TabsList>
         <TabsContent class="space-y-6 py-4" value="en">
            <div class="grid w-full items-center gap-3.5">
               <Label for="titleEn">Title EN</Label>
               <Input id="titleEn" v-model="titleEn" type="text" placeholder="Title En" />
            </div>
            <div class="grid w-full items-center gap-3.5">
               <Label for="subtitleEn">Subtitle EN</Label>
               <Input id="subtitleEn" v-model="subtitleEn" type="text" placeholder="Subtitle En" />
            </div>
            <div class="grid w-full items-center gap-3.5">
               <Label for="contentEn">Content EN</Label>
               <Editor api-key="fey8wj8gkyvmqosk9z11eji4hyyx2bvyrm0mtgkh79wc0zgw" :init="editorInit" v-model="contentEn" />
            </div>
         </TabsContent>
         <TabsContent class="space-y-6 py-4" value="id">
            <div class="grid w-full items-center gap-3.5">
               <Label for="titleId">Title ID</Label>
               <Input id="titleId" v-model="titleId" type="text" placeholder="Title ID" />
            </div>
            <div class="grid w-full items-center gap-3.5">
               <Label for="subtitleId">Subtitle ID</Label>
               <Input id="subtitleId" v-model="subtitleId" type="text" placeholder="Subtitle ID" />
            </div>
            <div class="grid w-full items-center gap-3.5">
               <Label for="contentId">Content ID</Label>
               <Editor api-key="fey8wj8gkyvmqosk9z11eji4hyyx2bvyrm0mtgkh79wc0zgw" :init="editorInit" v-model="contentId" />
            </div>
         </TabsContent>
      </Tabs>

      <div class="grid w-full items-center gap-3.5">
         <Label for="category">Group</Label>
         <Select id="category" v-model="group_id">
            <SelectTrigger>
               <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
               <SelectItem v-for="item in store.data_service_group" :key="item.id" :value="item.id">
                  <span class="capitalize">{{ item.name_en }}</span>
               </SelectItem>
            </SelectContent>
         </Select>
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

      <div class="flex gap-4">
         <Button type="submit"> Submit Data </Button>
         <NuxtLink to="/admin/service">
            <Button variant="destructive" type="button"> Cancel </Button>
         </NuxtLink>
      </div>
   </form>
</template>

<script setup lang="ts">
definePageMeta({
   layout: "admin",
});

import { type UserData } from "@/components/admin/user/type";
const role = useSanctumUser<UserData>().value?.role_id;
if (role != 1 && role != 2) {
   useRouter().push("/admin");
}

import { toast } from "vue-sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import Editor from "@tinymce/tinymce-vue";

const picture = ref<File | null>(null);
const slug = useRoute().params.slug;

const editorInit = computed(() => ({
   toolbar_mode: "sliding",
   plugins: "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
   toolbar: "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
   skin: useColorMode().value === "dark" ? "oxide-dark" : "oxide",
   content_css: useColorMode().value === "dark" ? "dark" : "default",
}));

watch(useColorMode(), async () => {
   window.location.reload();
});

const handleFile = (event: Event) => {
   const target = event.target as HTMLInputElement;
   const file = target.files?.[0];
   if (file) {
      picture.value = file;
   }
};

const id = ref("");
const titleEn = ref("");
const subtitleEn = ref("");
const contentEn = ref("");
const titleId = ref("");
const subtitleId = ref("");
const contentId = ref("");
const group_id = ref(null);
const status = ref("active");
const client = useSanctumClient();

const submitForm = async () => {
   const formData = new FormData();
   if (id.value) {
      formData.append("id", id.value);
   }

   if (!group_id.value) {
      toast({
         title: "Error",
         description: "Please select a group",
         variant: "destructive",
      });
      return;
   }

   formData.append("group_id", group_id.value);
   formData.append("status", status.value);

   if (picture.value) {
      formData.append("image", picture.value);
   }

   formData.append(
      "translations",
      JSON.stringify([
         {
            locale: "en",
            title: titleEn.value,
            sub: subtitleEn.value,
            description: contentEn.value,
         },
         {
            locale: "id",
            title: titleId.value,
            sub: subtitleId.value,
            description: contentId.value,
         },
      ])
   );

   await client("service", {
      method: "POST",
      body: formData,
      onResponse({ response }) {
         if (response._data.message) {
            useRouter().push("/admin/service");
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
      client(`service/id/${slug}`, {
         onResponse({ response }) {
            // Map Data
            const data = response._data.data;
            if (!data) {
               useRouter().push("/admin/service");
               toast({
                  title: "Error",
                  description: "Service not found",
                  variant: "destructive",
               });
            }

            // mapping data
            id.value = data.id;
            group_id.value = data.service_group_id;
            status.value = data.status;
            const translations = data.translations;
            translations.forEach((item: any) => {
               if (item.locale === "en") {
                  titleEn.value = item.title;
                  subtitleEn.value = item.sub;
                  contentEn.value = item.description;
               } else if (item.locale === "id") {
                  titleId.value = item.title;
                  subtitleId.value = item.sub;
                  contentId.value = item.description;
               }
            });
         },
      });
   }
});

const store = useAdminStore();
await store.fetchServiceGroupData();
</script>
