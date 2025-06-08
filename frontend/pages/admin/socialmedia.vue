<template>
  <div>
    <div class="text-2xl flex items-center justify-between font-semibold">
      <div>
        <h3 class="text-lg font-medium">
          Social Media List ({{ store.data_social.length }})
        </h3>
        <p class="text-sm text-muted-foreground">
          Manage Social Media Website
        </p>

      </div>
      <Sheet @update:open="(value) => {
        if (!value) id = null;
        useRouter().push('/admin/socialmedia');
      }" v-model:open="open">
        <SheetTrigger>
          <Button>Add Item</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetTitle>Form Social Media</SheetTitle>
          <SheetDescription>
            Add / Update social media item
          </SheetDescription>
          <Form @refresh="() => {
            open = false
            id = null
            useRouter().push('/admin/socialmedia')
          }" :id="id" :length="store.data_social.length" />
        </SheetContent>
      </Sheet>
    </div>
    <Separator class="mt-6" />
    <DataTable :data="store.data_social" :columns="columns" />
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'admin',
})

import { type UserData } from '@/components/admin/user/type';
const role = useSanctumUser<UserData>().value?.role_id;

if (role != 1 && role != 2) {
  useRouter().push('/admin');
}

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import DataTable from '~/components/admin/base/datatable.vue'
import Form from '@/components/admin/socialmedia/form.vue'
import Button from '~/components/ui/button/Button.vue'
import { columns } from "~/components/admin/socialmedia/column";

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

await store.fetchSocialData()
</script>

<style></style>