<template>
  <Layout>
    <Tabs default-value="1">
      <TabsList class="grid max-w-2xl grid-cols-2">
        <TabsTrigger value="1">
          List Reason
        </TabsTrigger>
        <TabsTrigger value="2">
          Wording Setting
        </TabsTrigger>
      </TabsList>
      <TabsContent value="1">
        <div class="text-2xl flex items-center justify-between mt-4 mb-8 font-semibold">
          <div>
            <h3 class="text-lg font-medium">
              Reason List ({{ store.data_reason.length }})
            </h3>
            <p class="text-sm text-muted-foreground">
              Update the ims reason settings
            </p>
          </div>
          <Sheet @update:open="(value) => {
            if (!value) id = null;
            useRouter().push('/admin/about/reason');
          }" v-model:open="open">
            <SheetTrigger>
              <Button>Add Reason</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetTitle>Form Reason</SheetTitle>
              <SheetDescription>
                Add / Update the reason data
              </SheetDescription>
              <FormReason @refresh="() => {
                open = false;
                id = null;
                useRouter().push('/admin/about/reason');
              }" :id="id" />
            </SheetContent>
          </Sheet>
        </div>
        <DataTable :data="store.data_reason" :columns="column_reason" />
      </TabsContent>
      <TabsContent value="2">
        <Card>
          <CardHeader class="flex-row items-center justify-between">
            <CardTitle>Wording Setting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense>
              <FormSection :rule="rules" slug="about-reason" />
              <template #fallback>
                <div>Loading...</div>
              </template>
            </Suspense>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
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
import Layout from '@/components/admin/about/layout.vue'
import FormSection from '~/components/admin/section/formsection.vue'
import FormReason from '@/components/admin/about/formreason.vue'
import Button from '~/components/ui/button/Button.vue'
import { columns } from "~/components/admin/about/column";
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

const rules = {
  title: true,
  subtitle: true
}

const store = useAdminStore()
await store.fetchReasonData()
</script>

<style></style>