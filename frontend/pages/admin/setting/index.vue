<template>
  <Layout>
    <div class="text-2xl flex items-center justify-between font-semibold">
      <div>
        <h3 class="text-lg font-medium">
          List Settings ({{ store.data_setting.length }})
        </h3>
        <p class="text-sm text-muted-foreground">
          Manage Contact Info Address
        </p>
      </div>
      <Sheet @update:open="(value) => {
        if (!value) id = null;
        useRouter().push('/admin/setting');
      }" v-model:open="open">
        <SheetTrigger>
          <Button>Add Item</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetTitle>Form Settings</SheetTitle>
          <SheetDescription>
            Add / Update the general setting
          </SheetDescription>
          <Form @refresh="() => {
            open = false
            id = null
            useRouter().push('/admin/setting');
          }" :id="id" />
        </SheetContent>
      </Sheet>
    </div>
    <Separator class="mt-6" />
    <DataTable :data="store.data_setting" :columns="columns" />

  </Layout>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'admin',
})

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import DataTable from '~/components/admin/base/datatable.vue'
import Layout from '@/components/admin/setting/layout.vue'
import Form from '@/components/admin/setting/formgeneral.vue'
import Button from '~/components/ui/button/Button.vue'
import { columns } from "~/components/admin/setting/colgeneral";
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
await store.fetchSettingData()
</script>

<style></style>