<template>
   <form class="space-y-6 w-full" @submit.prevent="submit">
      <div>
         <h3 class="text-lg font-medium">Form Group Service</h3>
         <p class="text-sm text-muted-foreground">{{ slug != "add" ? "Edit" : "Add New" }} Group Service</p>
      </div>
      <Separator class="my-6" />
      <div class="grid w-full items-center gap-3.5">
         <Label for="name_en">Group Name (EN)</Label>
         <Input id="name_en" v-model="name_en" type="text" placeholder="Group Name (EN)" />
      </div>
      <div class="grid w-full items-center gap-3.5">
         <Label for="name_id">Group Name (ID)</Label>
         <Input id="name_id" v-model="name_id" type="text" placeholder="Group Name (ID)" />
      </div>
      <div class="grid w-full items-center gap-3.5">
         <Label for="cta_en">CTA (EN)</Label>
         <Input id="cta_en" v-model="cta_en" type="text" placeholder="CTA (EN)" />
      </div>
      <div class="grid w-full items-center gap-3.5">
         <Label for="cta_id">CTA (ID)</Label>
         <Input id="cta_id" v-model="cta_id" type="text" placeholder="CTA (ID)" />
      </div>
      <div class="grid w-full items-center gap-3.5">
         <Label for="url">URL</Label>
         <Input id="url" v-model="url" type="text" placeholder="URL" />
      </div>
      <div class="flex gap-4">
         <Button type="submit"> Submit Data </Button>
         <NuxtLink to="/admin/service?tab=group">
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

import { type UserData } from "@/components/admin/user/type";
const role = useSanctumUser<UserData>().value?.role_id;
if (role != 1 && role != 2) {
   useRouter().push("/admin");
}

const name_en = ref("");
const name_id = ref("");
const cta_en = ref("");
const cta_id = ref("");
const url = ref("");
const id = ref<number | null>(null);
const emit = defineEmits();
const client = useSanctumClient();

const submit = async () => {
   const payload = {
      id: id.value ? id.value : null,
      name_en: name_en.value,
      name_id: name_id.value,
      cta_en: cta_en.value,
      cta_id: cta_id.value,
      url: url.value,
   };

   client("service/group", {
      method: "POST",
      body: payload,
      onResponse({ response }) {
         if (response._data.message) {
            toast({
               title: "Success",
               description: response._data.message,
            });
            useRouter().push("/admin/service?tab=group");
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

onMounted(async () => {
   if (slug && !isNaN(Number(slug))) {
      id.value = Number(slug);
      client(`service/group/${slug}`, {
         onResponse({ response }) {
            // Map Data
            const data = response._data.data;
            if (!data) {
               useRouter().push("/admin/service?tab=group");
               toast({
                  title: "Error",
                  description: "Group not found",
                  variant: "destructive",
               });
            }

            // mapping data
            name_en.value = data.name_en;
            name_id.value = data.name_id;
            cta_en.value = data.cta_en;
            cta_id.value = data.cta_id;
            url.value = data.url;
         },
      });
   }
});
</script>
