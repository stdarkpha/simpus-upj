<template>
  <div>
    <div class="text-2xl flex items-center justify-between my-4 font-semibold">
      <div>
        <h3 class="text-lg font-medium">
          User List ({{ storeAdmin.data_users.length }})
        </h3>
        <p class="text-sm text-muted-foreground">
          Manage user data
        </p>
      </div>
      <Sheet @update:open="(value) => {
        if (!value) id = null;
        useRouter().push('/admin/user');
      }" v-model:open="open">
        <SheetTrigger>
          <Button>Add User</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Form User</SheetTitle>
          </SheetHeader>
          <Form @refresh="() => { id = null; open = false; useRouter().push('/admin/user'); }" :id="id" />
          <SheetDescription>
          </SheetDescription>
        </SheetContent>
      </Sheet>
    </div>
    <DataTable :data="storeAdmin.data_users" :columns="columns" />
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'admin',
  middleware: ["admin"], // Use the new admin-auth middleware
})

import Button from '~/components/ui/button/Button.vue'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import Form from '@/components/admin/user/form.vue'

const open = ref(false)

import DataTable from '~/components/admin/base/datatable.vue'
import { columns } from "~/components/admin/user/column";

const storeAdmin = useAdminStore()
await storeAdmin.fetchUserData()

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
</script>

<style></style>