<template>
  <div>
    <div class="text-2xl flex items-center justify-between my-4 font-semibold">
      <div>
        <h3 class="text-lg font-medium">
          Section Global List ({{ store.data_section.length }})
        </h3>
        <p class="text-sm text-muted-foreground">
          Manage Section Directly Here
        </p>
      </div>

      <NuxtLink :to="`${useRoute().path}/add`">
        <Button>Add Section</Button>
      </NuxtLink>
    </div>
    <DataTable :data="store.data_section" :columns="columnsProject" />
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'admin',
})

import DataTable from '~/components/admin/base/datatable.vue'

import { useColumns } from '~/components/admin/section/column'

const { locale } = useI18n();
const columnsProject = useColumns(locale.value);
const store = useAdminStore();
store.fetchSectionData();

import { type UserData } from '@/components/admin/user/type';
const role = useSanctumUser<UserData>().value?.role_id;

if (role != 1) {
  useRouter().push('/admin');
}
</script>

<style></style>