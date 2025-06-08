<template>
   <form class="" @submit.prevent="submitForm" enctype="multipart/form-data">
      <div>
         <h3 class="text-lg font-medium">Form Project</h3>
         <p class="text-sm text-muted-foreground">{{ slug != "add" ? "Edit" : "Add New" }} Project</p>
      </div>
      <Separator class="my-6" />
      <div class="flex max-md:flex-col gap-8">
         <div class="space-y-6 max-md:order-2">
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
                     <Label for="contentId">Content ID</Label>
                     <Editor api-key="fey8wj8gkyvmqosk9z11eji4hyyx2bvyrm0mtgkh79wc0zgw" :init="editorInit" v-model="contentId" />
                  </div>
               </TabsContent>
            </Tabs>

            <div class="flex gap-4">
               <Button type="submit"> Submit Data </Button>
               <NuxtLink to="/admin/project">
                  <Button variant="destructive" type="button"> Cancel </Button>
               </NuxtLink>
            </div>
         </div>

         <div class="space-y-6 max-md:order-1">
            <div class="grid w-full items-center gap-3.5">
               <Label for="category">Group</Label>
               <Select id="category" v-model="group_id">
                  <SelectTrigger>
                     <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem v-for="item in store.data_project_group" :key="item.id" :value="item.id">
                        <span class="capitalize">{{ item.name_en }}</span>
                     </SelectItem>
                  </SelectContent>
               </Select>
            </div>

            <div class="grid w-full items-center gap-3.5">
               <Label for="picture">Banner</Label>
               <Input id="picture" @change="handleFile" type="file" />
            </div>

            <div class="grid w-full items-center gap-3.5">
               <Label>Date</Label>
               <Popover>
                  <PopoverTrigger as-child>
                     <div>
                        <Button type="button" variant="outline" class="text-muted-foreground w-full ps-3 text-start font-normal">
                           <span>{{ date ? date : "Pick a date" }}</span>
                           <!-- <Icon  class="ms-auto h-4 w-4 opacity-50" /> -->
                           <Icon icon="ep:calendar" class="opacity-50 ms-auto h-4 w-4" />
                        </Button>
                        <input hidden />
                     </div>
                  </PopoverTrigger>
                  <PopoverContent class="w-auto p-0">
                     <AdminBaseDatePicker v-model="date" initial-focus />
                     <!-- <Calendar v-model:placeholder="placeholder" v-model="date" calendar-label="Date" initial-focus /> -->
                  </PopoverContent>
               </Popover>
            </div>
            <div class="grid w-full items-center gap-3.5">
               <Label for="location">Location</Label>
               <Input id="location" v-model="location" type="text" placeholder="Location" />
            </div>
            <div class="grid w-full items-center gap-3.5">
               <Label for="owner">Owner</Label>
               <Input id="owner" v-model="owner" type="text" placeholder="Owner" />
            </div>
            <div class="grid w-full items-center gap-3.5">
               <Label for="layer">Layer</Label>
               <Input id="layer" v-model="layer" type="text" placeholder="Layer" />
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
         </div>
      </div>
   </form>
</template>

<script setup lang="ts">
definePageMeta({
   layout: "admin",
});

import { Icon } from "@iconify/vue";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "vue-sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getLocalTimeZone, today } from "@internationalized/date";
import Editor from "@tinymce/tinymce-vue";
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

const picture = ref<File | null>(null);

const handleFile = (event: Event) => {
   const target = event.target as HTMLInputElement;
   const file = target.files?.[0];
   if (file) {
      picture.value = file;
   }
};

const id = ref(null);
const titleEn = ref("");
const contentEn = ref("");
const titleId = ref("");
const contentId = ref("");
const group_id = ref(null);
const status = ref("active");
const date = ref(today(getLocalTimeZone()));
const location = ref("");
const owner = ref("");
const layer = ref("");

const submitForm = async () => {
   const formData = new FormData();
   if (!group_id.value) {
      toast({
         title: "Error",
         description: "Please select a group",
         variant: "destructive",
      });
      return;
   }
   if (id.value) {
      formData.append("id", id.value);
   }
   if (picture.value) {
      formData.append("image", picture.value);
   }
   formData.append("group_id", group_id.value || "");
   formData.append("status", status.value);
   formData.append("date", date.value.toString());
   formData.append("location", location.value);
   formData.append("owner", owner.value);
   formData.append("layer", layer.value);
   formData.append(
      "translations",
      JSON.stringify([
         {
            locale: "en",
            title: titleEn.value,
            description: contentEn.value,
         },
         {
            locale: "id",
            title: titleId.value,
            description: contentId.value,
         },
      ])
   );

   client("project", {
      method: "POST",
      body: formData,
      onResponse({ response }) {
         if (response._data.message) {
            useRouter().push("/admin/project");
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

const slug = useRoute().params.slug;
const client = useSanctumClient();

onMounted(async () => {
   if (slug && !isNaN(Number(slug))) {
      client(`project/id/${slug}`, {
         onResponse({ response }) {
            // Map Data
            const data = response._data.data;
            if (!data) {
               useRouter().push("/admin/project");
               toast({
                  title: "Error",
                  description: "Project not found",
                  variant: "destructive",
               });
            }
            id.value = data.id;
            location.value = data.location;
            owner.value = data.owner;
            layer.value = data.layer;
            status.value = data.status;
            date.value = data.date;
            group_id.value = data.project_group_id;
            const translations = data.translations;
            const enTranslation = translations.find((t: any) => t.locale === "en");
            const idTranslation = translations.find((t: any) => t.locale === "id");

            if (enTranslation) {
               titleEn.value = enTranslation.title;
               contentEn.value = enTranslation.description;
            }

            if (idTranslation) {
               titleId.value = idTranslation.title;
               contentId.value = idTranslation.description;
            }
         },
      });
   }
});

const store = useAdminStore();
await store.fetchGroupProjectData();
</script>
