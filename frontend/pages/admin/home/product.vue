<template>
  <Layout>
    <Tabs default-value="product">
      <TabsList class="grid max-w-2xl grid-cols-2">
        <TabsTrigger value="product">
          List Product
        </TabsTrigger>
        <TabsTrigger value="word">
          Wording Setting
        </TabsTrigger>
      </TabsList>
      <TabsContent value="product">
        <div class="text-2xl flex items-center justify-between my-4 font-semibold">
          <div>
            <h3 class="text-lg font-medium">
              Product List ({{ store.data_product.length }})
            </h3>
            <p class="text-sm text-muted-foreground">
              Manage the product highlight
            </p>
          </div>

          <Sheet @update:open="(value) => {
            if (!value) id = null;
            useRouter().push('/admin/home/product');
          }" v-model:open="open">
            <SheetTrigger>
              <Button>Add Product</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetTitle>Form Product</SheetTitle>
              <SheetDescription>
                Edit Product for page Home
              </SheetDescription>
              <FormProduct @refresh="() => {
                id = null;
                open = false;
                useRouter().push('/admin/home/product');
              }" :id="id" />
            </SheetContent>
          </Sheet>
        </div>
        <DataTable :data="store.data_product" :columns="column_product" />
      </TabsContent>
      <TabsContent value="word">
        <div class="py-4">
          <h3 class="text-lg font-medium">
            Wording Setting
          </h3>
          <p class="text-sm text-muted-foreground">
            Manage Section Wording
          </p>
        </div>
        <Suspense>
          <FormSection slug="home-product" :rule="rules" />
          <template #fallback>
            <div>Loading...</div>
          </template>
        </Suspense>
      </TabsContent>
    </Tabs>
  </Layout>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'admin',
})

import { columns } from "~/components/admin/home/colproduct";
import DataTable from '~/components/admin/base/datatable.vue'
import FormProduct from '@/components/admin/home/formproduct.vue'
import FormSection from '~/components/admin/section/formsection.vue'
import Layout from '@/components/admin/home/layout.vue'
import Button from '~/components/ui/button/Button.vue'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'

const rules = {
  title: true,
  subtitle: true,
}

const { locale } = useI18n();
const column_product = columns(locale.value);
const open = ref(false)
const store = useAdminStore()
const id = ref<number | null>(null)
const query = useRoute().query.id

await store.fetchProductData()

if (query) {
  id.value = parseInt(query as string)
  open.value = true
} else {
  id.value = null
  open.value = false
}

// watch if query value change
watch(() => useRoute().query.id, (value) => {
  if (value) {
    id.value = parseInt(value as string)
    open.value = true
  } else {
    id.value = null
    open.value = false
  }
})
</script>

<style></style>