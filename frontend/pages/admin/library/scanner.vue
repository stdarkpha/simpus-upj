<template>
  <Layout>

  </Layout>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'admin',
  middleware: ["admin"], // Use the new admin-auth middleware
})

import Layout from '@/components/admin/library/layout.vue'
</script>

<style></style>