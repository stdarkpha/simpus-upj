<template>
   <form class="space-y-6" @submit.prevent="submitSection" enctype="multipart/form-data">
      <template v-if="props.title">
         <div>
            <h3 class="text-lg font-medium">
               {{ props.title }}
            </h3>
            <p class="text-sm text-muted-foreground">
               {{ props.detail }}
            </p>
         </div>
         <Separator class="my-6" />
      </template>

      <Tabs v-if="props.rule" default-value="en">
         <TabsList>
            <TabsTrigger value="en"> EN </TabsTrigger>
            <TabsTrigger value="id"> ID </TabsTrigger>
         </TabsList>
         <TabsContent class="space-y-6 py-4" value="en">
            <div v-if="props.rule?.title" class="grid w-full items-center gap-3.5">
               <Label for="titleEn">Title EN</Label>
               <Input id="titleEn" v-model="titleEn" type="text" placeholder="Title En" />
            </div>
            <div v-if="props.rule?.subtitle" class="grid w-full items-center gap-3.5">
               <Label for="subtitleEn">Subtitle EN</Label>
               <Input id="subtitleEn" v-model="subtitleEn" type="text" placeholder="Subtitle En" />
            </div>
            <div v-if="props.rule?.cta" class="grid w-full items-center gap-3.5">
               <Label for="ctaTextEn">CTA Text EN</Label>
               <Input id="ctaTextEn" v-model="ctaTextEn" type="text" placeholder="CTA Text En" />
            </div>
            <div v-if="props.rule?.content" class="grid w-full items-center gap-3.5">
               <Label for="contentEn">Content EN</Label>
               <Editor api-key="fey8wj8gkyvmqosk9z11eji4hyyx2bvyrm0mtgkh79wc0zgw" :init="editorInit" v-model="contentEn" />
            </div>
         </TabsContent>
         <TabsContent class="space-y-6 py-4" value="id">
            <div v-if="props.rule?.title" class="grid w-full items-center gap-3.5">
               <Label for="titleId">Title ID</Label>
               <Input id="titleId" v-model="titleId" type="text" placeholder="Title ID" />
            </div>
            <div v-if="props.rule?.subtitle" class="grid w-full items-center gap-3.5">
               <Label for="subtitleId">Subtitle ID</Label>
               <Input id="subtitleId" v-model="subtitleId" type="text" placeholder="Subtitle ID" />
            </div>
            <div v-if="props.rule?.cta" class="grid w-full items-center gap-3.5">
               <Label for="ctaTextId">CTA Text ID</Label>
               <Input id="ctaTextId" v-model="ctaTextId" type="text" placeholder="CTA Text ID" />
            </div>
            <div v-if="props.rule?.content" class="grid w-full items-center gap-3.5">
               <Label for="contentId">Content ID</Label>
               <Editor api-key="fey8wj8gkyvmqosk9z11eji4hyyx2bvyrm0mtgkh79wc0zgw" :init="editorInit" v-model="contentId" />
            </div>
         </TabsContent>
      </Tabs>

      <template v-if="!props.slug">
         <div class="grid w-full items-center gap-3.5">
            <Label for="sectionName">Section Name</Label>
            <Input id="sectionName" v-model="sectionName" type="text" placeholder="Section Name" />
         </div>
         <div class="grid w-full items-center gap-3.5">
            <Label for="pageLocation">Page Location / Section Group</Label>
            <Input id="pageLocation" v-model="page" type="text" placeholder="Page Location" />
         </div>
      </template>
      <div v-if="props.rule?.url" class="grid w-full items-center gap-3.5">
         <Label for="sectionUrl">Url</Label>
         <Input id="sectionUrl" v-model="url" type="text" placeholder="Url Location" />
      </div>

      <div v-if="props.rule?.image" class="grid w-full items-center gap-3.5">
         <Label for="picture">Picture</Label>
         <Input id="picture" @change="handleFile" type="file" />
      </div>
      <Button type="submit"> Update Section </Button>
   </form>
</template>

<script setup lang="ts">
const props = defineProps<{
   title?: string;
   detail?: string;
   slug?: string;
   rule: {
      url?: boolean;
      image?: boolean;
      title?: boolean;
      subtitle?: boolean;
      cta?: boolean;
      content?: boolean;
   };
}>();

import { toast } from "vue-sonner";

import { ref } from "vue";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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

const sectionName = ref("");
const page = ref("");
const url = ref("");
const titleEn = ref("");
const subtitleEn = ref("");
const ctaTextEn = ref("");
const contentEn = ref("");
const titleId = ref("");
const subtitleId = ref("");
const ctaTextId = ref("");
const contentId = ref("");
const client = useSanctumClient();
const emit = defineEmits();

const submitSection = async () => {
   const formData = new FormData();
   if (props.slug) {
      formData.append("slug", props.slug);
   }
   formData.append("name", sectionName.value);
   formData.append("page", page.value);
   formData.append("url", url.value);
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
            cta: ctaTextEn.value,
            content: contentEn.value,
         },
         {
            locale: "id",
            title: titleId.value,
            sub: subtitleId.value,
            cta: ctaTextId.value,
            content: contentId.value,
         },
      ])
   );

   client("section", {
      method: "POST",
      body: formData,
      onResponse({ response }) {
         if (response._data.message) {
            emit("close");
            toast({
               title: "Success",
               description: "Section saved successfully",
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

if (props.slug) {
   await useSanctumFetch<any>(`section/${props.slug}`, {
      onResponse({ response }) {
         if (response._data.message) {
            console.log(response._data.data);

            const section = response._data.data;
            // console.log(section.name)

            sectionName.value = section.name;
            page.value = section.page;
            url.value = section.url;

            const enTranslation = section.translations.find((t: any) => t.locale === "en");
            if (enTranslation) {
               titleEn.value = enTranslation.title;
               subtitleEn.value = enTranslation.sub;
               ctaTextEn.value = enTranslation.cta;
               contentEn.value = enTranslation.content;
            }

            const idTranslation = section.translations.find((t: any) => t.locale === "id");
            if (idTranslation) {
               titleId.value = idTranslation.title;
               subtitleId.value = idTranslation.sub;
               ctaTextId.value = idTranslation.cta;
               contentId.value = idTranslation.content;
            }
         }
      },
   });
}
</script>
