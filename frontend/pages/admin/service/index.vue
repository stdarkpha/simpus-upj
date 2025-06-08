<template>
  <div>
    <Tabs :default-value="typeof query === 'string' && query == 'group' ? '2' : '1'">
      <TabsList class="grid max-w-2xl grid-cols-3">
        <TabsTrigger value="1">
          List Services
        </TabsTrigger>
        <TabsTrigger value="2">
          Group List
        </TabsTrigger>
        <TabsTrigger value="3">
          Wording Setting
        </TabsTrigger>
      </TabsList>
      <TabsContent value="1">

        <div class="text-2xl flex items-center justify-between my-4 font-semibold">
          <div>
            <h3 class="text-lg font-medium">
              Services List ({{ store.data_services.length }})
            </h3>
            <p class="text-sm text-muted-foreground">
              Manage the services data
            </p>
          </div>

          <NuxtLink :to="`${useRoute().path}/add`">
            <Button>Add Item</Button>
          </NuxtLink>
        </div>
        <DataTable :data="store.data_services" :columns="columnsProject" />
      </TabsContent>
      <TabsContent value="2">
        <div class="text-2xl flex items-center justify-between my-4 font-semibold">
          <div>
            <h3 class="text-lg font-medium">
              Group List ({{ store.data_service_group.length }})
            </h3>
            <p class="text-sm text-muted-foreground">
              Manage the services group
            </p>
          </div>
          <NuxtLink :to="`${useRoute().path}/group/add`">
            <Button>Add Group</Button>
          </NuxtLink>
        </div>
        <DataTable :data="store.data_service_group" :columns="columns" />
      </TabsContent>
      <TabsContent value="3">
        <div class="my-4">
          <h3 class="text-lg font-medium">
            Wording Setting
          </h3>
          <p class="text-sm text-muted-foreground">
            Manage Section Wording
          </p>
        </div>
        <Suspense>
          <FormSection slug="services-header" :rule="rules" />
          <template #fallback>
            <div>Loading...</div>
          </template>
        </Suspense>
      </TabsContent>
    </Tabs>
  </div>

</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'admin',
})

const query = useRoute().query.tab

import { useColumns } from '~/components/admin/service/column'
import { columns } from '~/components/admin/service/colgroup';

const { locale } = useI18n();
const columnsProject = useColumns(locale.value);

import { type UserData } from '@/components/admin/user/type';
const role = useSanctumUser<UserData>().value?.role_id;
if (role != 1 && role != 2) {
  useRouter().push('/admin');
}


import DataTable from '~/components/admin/base/datatable.vue'
import FormSection from '~/components/admin/section/formsection.vue'
import Button from '~/components/ui/button/Button.vue'

const rules = {
  title: true,
  image: true,
}

const store = useAdminStore()
await store.fetchServiceData()
await store.fetchServiceGroupData()
</script>

<style></style>