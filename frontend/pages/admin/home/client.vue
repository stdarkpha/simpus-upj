<template>
  <Layout>
    <Tabs default-value="client">
      <TabsList class="grid max-w-2xl grid-cols-3">
        <TabsTrigger value="client">
          List Client
        </TabsTrigger>
        <TabsTrigger value="category">
          List Category
        </TabsTrigger>
        <TabsTrigger value="word">
          Wording Setting
        </TabsTrigger>
      </TabsList>
      <TabsContent value="client">
        <div class="text-2xl flex items-center justify-between my-4 font-semibold">
          <div>
            <h3 class="text-lg font-medium">
              Client List ({{ store.data_client.length }})
            </h3>
            <p class="text-sm text-muted-foreground">
              Manage the client data
            </p>
          </div>
          <Sheet @update:open="(value) => {
            if (!value) id = null;
            useRouter().push('/admin/home/client');
          }" v-model:open="open">
            <SheetTrigger>
              <Button>Add Client</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetTitle>Form Client</SheetTitle>
              <SheetDescription>
                Edit Client for page Home
              </SheetDescription>
              <FormClient @refresh="() => { id = null; open = false }" :id="id"
                :category_data="store.data_client_group" />
            </SheetContent>
          </Sheet>
        </div>
        <DataTable :data="store.data_client" :columns="column_client" />
      </TabsContent>
      <TabsContent value="category">
        <div class="text-2xl flex my-4 items-center justify-between font-semibold">
          <div>
            <h3 class="text-lg font-medium">
              Category List ({{ store.data_client_group.length }})
            </h3>
            <p class="text-sm text-muted-foreground">
              Manage the client data
            </p>
          </div>
          <Sheet @update:open="(value) => {
            if (!value) id = null;
            useRouter().push('/admin/home/client');
          }" v-model:open="open">
            <SheetTrigger>
              <Button>Add Category</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetTitle>Form Client</SheetTitle>
              <SheetDescription>
                Edit Client for page Home
              </SheetDescription>
              <FormCategory @refresh="() => { id = null; open = false }" :id="id" />
            </SheetContent>
          </Sheet>
        </div>
        <DataTable :data="store.data_client_group" :columns="columns" />
      </TabsContent>
      <TabsContent value="word">
        <div class="my-4">
          <h3 class="text-lg font-medium">
            Wording Setting
          </h3>
          <p class="text-sm text-muted-foreground">
            Manage Section Wording
          </p>
        </div>
        <Suspense>
          <FormSection slug="home-client" :rule="rules" />
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

import FormSection from '~/components/admin/section/formsection.vue'
import Button from '~/components/ui/button/Button.vue'
import FormClient from '@/components/admin/home/formclient.vue'
import FormCategory from '@/components/admin/home/formclientcategory.vue'
import Layout from '@/components/admin/home/layout.vue'
import DataTable from '~/components/admin/base/datatable.vue'
import { useColumns } from "~/components/admin/home/colclient";
import { columns } from "~/components/admin/home/colgroup";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'


const { locale } = useI18n();
const open = ref(false)
const rules = { title: true }
const column_client = useColumns(locale.value);
const id = ref<number | null>(null)
const query = useRoute().query.id
const store = useAdminStore()

onMounted(async () => {
  await store.fetchClientData()
  await store.fetchClientGroupData()
})

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