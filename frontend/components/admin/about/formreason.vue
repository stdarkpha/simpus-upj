<template>
   <form class="space-y-6 max-w-2xl" @submit.prevent="formSubmit">
      <Separator class="my-6" />
      <div class="grid w-full items-center gap-3.5">
         <Label for="category">Icon</Label>
         <Select id="category" v-model="select_icon">
            <SelectTrigger>
               <SelectValue placeholder="Select a Icon" />
            </SelectTrigger>
            <SelectContent>
               <SelectItem v-for="item in icon" :key="item" :value="item">
                  <div class="flex items-center gap-2">
                     <Icon :icon="item" class="text-2xl" />
                     {{ item }}
                  </div>
               </SelectItem>
            </SelectContent>
         </Select>
      </div>
      <Tabs default-value="en">
         <TabsList class="my-2">
            <TabsTrigger value="en">EN</TabsTrigger>
            <TabsTrigger value="id">ID</TabsTrigger>
         </TabsList>
         <TabsContent class="space-y-4" value="en">
            <div class="grid w-full items-center gap-3.5">
               <Label for="title-en">Title (EN)</Label>
               <Input id="title-en" v-model="titleEn" />
            </div>
            <div class="grid w-full items-center gap-3.5">
               <Label for="description-en">Description (EN)</Label>
               <Textarea id="description-en" v-model="descriptionEn" placeholder="Reason Description.." />
            </div>
         </TabsContent>
         <TabsContent class="space-y-4" value="id">
            <div class="grid w-full items-center gap-3.5">
               <Label for="title-id">Title (ID)</Label>
               <Input id="title-id" v-model="titleId" />
            </div>
            <div class="grid w-full items-center gap-3.5">
               <Label for="description-id">Description (ID)</Label>
               <Textarea id="description-id" class="scrollbar-thin" v-model="descriptionId" placeholder="Reason Description.." />
            </div>
         </TabsContent>
      </Tabs>
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
import { Icon } from "@iconify/vue";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "vue-sonner";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const props = defineProps<{
   id?: number;
}>();

const icon = ref(["mingcute:user-2-line", "iconamoon:news-light", "fluent:person-support-16-regular", "mdi:rocket-outline", "ion:diamond-outline", "cil:chat-bubble"]);

// ref
const titleEn = ref("");
const descriptionEn = ref("");
const titleId = ref("");
const descriptionId = ref("");
const select_icon = ref("");
const status = ref("active");
const emit = defineEmits();
const client = useSanctumClient();

const formSubmit = async () => {
   const reason_data = {
      id: props.id ?? null,
      icon: select_icon.value,
      status: status.value,
      translations: [
         {
            locale: "en",
            title: titleEn.value,
            description: descriptionEn.value,
         },
         {
            locale: "id",
            title: titleId.value,
            description: descriptionId.value,
         },
      ],
   };

   client("about", {
      method: "POST",
      body: JSON.stringify(reason_data),
      onResponse({ response }) {
         if (response._data.message) {
            emit("refresh");
            toast({
               title: "Success",
               description: response._data.message,
            });
            useAdminStore().fetchReasonData();
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

// map if props.data is not empty
if (props.id) {
   client(`about/${props.id}`, {
      onResponse({ response }) {
         // Map Data
         const data = response._data.data;
         if (!data) {
            emit("refresh");
            toast({
               title: "Error",
               description: "Group not found",
               variant: "destructive",
            });
         }

         select_icon.value = data.icon;
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
