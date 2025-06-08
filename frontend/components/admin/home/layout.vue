<script setup lang="ts">
import { type UserData } from '@/components/admin/user/type';
const role = useSanctumUser<UserData>().value?.role_id;
if (role != 1 && role != 2) {
  useRouter().push('/admin');
}
import SideNav from './sidenav.vue';
</script>

<template>
  <div class="pb-16 space-y-6">
    <div class="space-y-0.5">
      <h2 class="text-2xl font-bold tracking-tight">
        Home Page
      </h2>
      <p class="text-muted-foreground">
        Manage all content related to Home Page here!
      </p>
    </div>
    <Separator class="my-6" />
    <div class="flex flex-col lg:flex-row space-y-6 lg:space-x-12 lg:space-y-0">
      <div class="w-full overflow-x-auto pb-2 lg:w-1/6 lg:pb-0">
        <SideNav />
      </div>
      <div class="flex-1">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
