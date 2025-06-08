<script lang="ts" setup>
import Mail from '@/components/admin/mail/Mail.vue'
definePageMeta({
  layout: 'admin',
})

const store = useAdminStore()
store.fetchContactData()
</script>

<template>
  <div class="h-[85vh] border overflow-auto">
    <Mail :mails="store.contact_map" :nav-collapsed-size="4" />
  </div>
</template>
