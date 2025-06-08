<template>
  <div>
    <Tabs :default-value="typeof query === 'string' && query == 'group' ? '2' : '1'">
      <TabsList :class="role == 1 || role == 2 ? 'grid gap-4 grid-cols-3 max-w-2xl' : ''">
        <TabsTrigger value="1">
          List Project
        </TabsTrigger>
        <TabsTrigger value="2">
          Group List
        </TabsTrigger>
        <TabsTrigger v-if="role == 1 || role == 2" value="3">
          Wording Setting
        </TabsTrigger>
      </TabsList>
      <TabsContent value="1">
        <div>
          <div class="text-2xl flex items-center justify-between my-4 font-semibold">
            <div>
              <h3 class="text-lg font-medium">
                Project List ({{ store.data_project.length }})
              </h3>
              <p class="text-sm text-muted-foreground">
                Manage the project data
              </p>
            </div>

            <NuxtLink :to="`${useRoute().path}/add`">
              <Button>Add Project</Button>
            </NuxtLink>
          </div>
          <DataTable :data="store.data_project" :columns="columnsProject" />
        </div>
      </TabsContent>
      <TabsContent value="2">
        <div class="text-2xl flex items-center justify-between my-4 font-semibold">
          <div>
            <h3 class="text-lg font-medium">
              Group List ({{ store.data_project_group.length }})
            </h3>
            <p class="text-sm text-muted-foreground">
              Manage the project group
            </p>
          </div>

          <NuxtLink :to="`${useRoute().path}/group/add`">
            <Button>Add Group</Button>
          </NuxtLink>
        </div>
        <DataTable :data="store.data_project_group" :columns="columns" />
      </TabsContent>
      <TabsContent v-if="role == 1 || role == 2" value="3">
        <div class="max-w-2xl">
          <div class="my-4">
            <h3 class="text-lg font-medium">
              Wording Setting
            </h3>
            <p class="text-sm text-muted-foreground">
              Manage Section Wording
            </p>
          </div>
          <Separator class="my-6" />
          <Suspense>
            <FormSection slug="services-header" :rule="rules" />
            <template #fallback>
              <div>Loading...</div>
            </template>
          </Suspense>
        </div>
      </TabsContent>
    </Tabs>
  </div>

</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'admin',
})

import { type UserData } from '@/components/admin/user/type';
const role = useSanctumUser<UserData>().value?.role_id;

const query = useRoute().query.tab

import FormSection from '~/components/admin/section/formsection.vue'
import Button from '~/components/ui/button/Button.vue'
import DataTable from '~/components/admin/base/datatable.vue'

import { useColumns } from '~/components/admin/project/column'
import { columns } from '~/components/admin/project/colgroup';

const { locale } = useI18n();
const columnsProject = useColumns(locale.value);

const rules = {
  title: true,
  image: true,
}

const store = useAdminStore();
await store.fetchProjectData();
await store.fetchGroupProjectData();
</script>

<style></style>