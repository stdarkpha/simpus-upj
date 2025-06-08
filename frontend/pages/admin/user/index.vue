<template>
  <Tabs :default-value="useRoute().query.tab?.toString() || '1'">
    <TabsList class="grid max-w-2xl grid-cols-2">
      <TabsTrigger value="1">
        List Users
      </TabsTrigger>
      <TabsTrigger value="2">
        Manage Roles
      </TabsTrigger>
    </TabsList>
    <TabsContent value="1">
      <div class="text-2xl flex items-center justify-between my-4 font-semibold">
        <div>
          <h3 class="text-lg font-medium">
            User List ({{ store.data_users.length }})
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
            <SheetTitle>Form User</SheetTitle>
            <SheetDescription>
              Add / Edit User Data
            </SheetDescription>
            <Form @refresh="() => { id = null; open = false; useRouter().push('/admin/user'); }" :id="id"
              :category_data="store.data_roles" />
          </SheetContent>
        </Sheet>
      </div>
      <DataTable :data="store.data_users" :columns="columns" />
    </TabsContent>
    <TabsContent value="2">
      <div class="text-2xl flex my-4 items-center justify-between font-semibold">
        <div>
          <h3 class="text-lg font-medium">
            User List ({{ store.data_roles.length }})
          </h3>
          <p class="text-sm text-muted-foreground">
            Manage user data
          </p>
        </div>
        <Sheet @update:open="(value) => {
          if (!value) id = null;
          useRouter().push('/admin/user?tab=2');
        }" v-model:open="open">
          <SheetTrigger>
            <Button>Add Role</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle>Form Role</SheetTitle>
            <SheetDescription>
              Add / Edit Role User
            </SheetDescription>
            <FormRole @refresh="() => { id = null; open = false }" :id="id" />
          </SheetContent>
        </Sheet>
      </div>
      <DataTable :data="store.data_roles" :columns="group" />
    </TabsContent>
  </Tabs>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'admin',
})


import { type UserData } from '@/components/admin/user/type';
const role = useSanctumUser<UserData>().value?.role_id;

if (role != 1) {
  useRouter().push('/admin');
}

import Button from '~/components/ui/button/Button.vue'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import Form from '@/components/admin/user/form.vue'
import FormRole from '@/components/admin/user/formrole.vue'

const open = ref(false)

import DataTable from '~/components/admin/base/datatable.vue'
import { columns } from "~/components/admin/user/column";
import { group } from "~/components/admin/user/group";

const store = useAdminStore()
onMounted(async () => {
  await store.fetchUserData()
  await store.fetchRolesData()
})

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