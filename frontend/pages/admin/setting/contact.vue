<template>
  <Layout>
    <Tabs default-value="1">
      <TabsList class="grid max-w-2xl grid-cols-3">
        <TabsTrigger value="1">
          Maps Setting
        </TabsTrigger>
        <TabsTrigger value="2">
          List Contact Address
        </TabsTrigger>
        <TabsTrigger value="3">
          Wording Setting
        </TabsTrigger>
      </TabsList>
      <TabsContent value="1">
        <FormMaps />
      </TabsContent>
      <TabsContent value="2">
        <div class="text-2xl flex items-center justify-between font-semibold">
          <div>
            <h3 class="text-lg font-medium">
              Contact List ({{ store.data_address.length }})
            </h3>
            <p class="text-sm text-muted-foreground">
              Manage Contact Info Address
            </p>

          </div>
          <Sheet @update:open="(value) => {
            if (!value) id = null;
            useRouter().push('/admin/setting/contact');
          }" v-model:open="open">
            <SheetTrigger>
              <Button>Add Item</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetTitle>Form Contact</SheetTitle>
              <SheetDescription>
                Add / Update the contact data
              </SheetDescription>
              <FormAddress @refresh="() => {
                open = false
                id = null
                useRouter().push('/admin/setting/contact');
              }" :id="id" />
            </SheetContent>
          </Sheet>
        </div>
        <Separator class="mt-6" />
        <DataTable :data="store.data_address" :columns="column_reason" />
      </TabsContent>
      <TabsContent value="3">
        <div class="flex flex-col gap-8 w-full">
          <FormSection class="w-full" slug="contact-header" title="Contact Banner"
            detail="Update wording and Banner Contact" :rule="{
              title: true, image: true,
            }" />
          <FormSection class="w-full" slug="contact-form" title="Form Contact" detail="Update wording Form" :rule="{
            title: true
          }" />
        </div>
      </TabsContent>
    </Tabs>

  </Layout>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'admin',
})

import FormSection from '~/components/admin/section/formsection.vue'

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import DataTable from '~/components/admin/base/datatable.vue'
import Layout from '@/components/admin/setting/layout.vue'
import FormAddress from '@/components/admin/setting/formaddress.vue'
import FormMaps from '~/components/admin/setting/formmaps.vue'
import Button from '~/components/ui/button/Button.vue'
import { columns } from "~/components/admin/setting/colcontact";
const { locale } = useI18n();
const column_reason = columns(locale.value);
const open = ref(false)

const id = ref<number | null>(null)
const query = useRoute().query.id

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

const store = useAdminStore()
await store.fetchAddressData()
</script>

<style></style>