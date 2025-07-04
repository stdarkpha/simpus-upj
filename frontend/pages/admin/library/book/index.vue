<template>
   <Layout>
      <Tabs :default-value="tabs.toString()">
         <TabsList class="grid gap-1 grid-cols-2 max-w-2xl">
            <TabsTrigger value="1"> List Book </TabsTrigger>
            <TabsTrigger value="2"> Book Category </TabsTrigger>
         </TabsList>
         <TabsContent value="1">
            <div>
               <div class="text-2xl flex items-center justify-between my-4 font-semibold">
                  <div>
                     <h3 class="text-lg font-medium">Book List ({{ adminStore.data_books.length }})</h3>
                     <p class="text-sm text-muted-foreground">Manage the book collection</p>
                  </div>

                  <NuxtLink :to="`${useRoute().path}/add`">
                     <Button>Add Book</Button>
                  </NuxtLink>
               </div>
               <DataTable :data="adminStore.data_books" :columns="books" />
            </div>
         </TabsContent>
         <TabsContent value="2">
            <div class="text-2xl flex items-center justify-between my-4 font-semibold">
               <div>
                  <h3 class="text-lg font-medium">Book Category ({{ adminStore.data_books_category.length }})</h3>
                  <p class="text-sm text-muted-foreground">Manage book categories</p>
               </div>

               <Sheet
                  @update:open="
                     (value) => {
                        if (!value) id = null;
                        useRouter().push('/admin/library/book?tab=2');
                     }
                  "
                  v-model:open="open"
               >
                  <SheetTrigger>
                     <Button>Add Category</Button>
                  </SheetTrigger>
                  <SheetContent>
                     <SheetHeader>
                        <SheetTitle>Form Category Book</SheetTitle>
                     </SheetHeader>
                     <Form
                        @refresh="
                           () => {
                              id = null;
                              open = false;
                              useRouter().push('/admin/library/book?tab=2');
                           }
                        "
                        :id="id"
                     />
                     <SheetDescription></SheetDescription>
                  </SheetContent>
               </Sheet>
            </div>
            <DataTable :data="adminStore.data_books_category" :columns="category" />
         </TabsContent>
      </Tabs>
   </Layout>
</template>

<script lang="ts" setup>
definePageMeta({
   layout: "admin",
   middleware: ["admin"],
});

import Layout from "@/components/admin/library/layout.vue";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import Button from "~/components/ui/button/Button.vue";
import DataTable from "~/components/admin/base/datatable.vue";
import Form from "@/components/admin/library/form.vue";

import { columns as books } from "~/components/admin/library/columnbooks";
import { columns as category } from "~/components/admin/library/column";

const adminStore = useAdminStore();

await adminStore.fetchBooks();
await adminStore.fetchBooksCategory();

const id = ref<number | null>(null);
const query = useRoute().query.id;
const open = ref(false);
const tabs = useRoute().query.tab || "1";

if (query) {
   id.value = parseInt(query as string);
   open.value = true;
} else {
   id.value = null;
   open.value = false;
}

// watch if query value change
watch(
   () => useRoute().query.id,
   (value) => {
      if (value) {
         id.value = parseInt(value as string);
         open.value = true;
      } else {
         id.value = null;
         open.value = false;
      }
   }
);
</script>

<style></style>
