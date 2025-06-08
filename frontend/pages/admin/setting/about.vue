<template>
  <Layout>
    <FormSection slug="footer-about" title="Footer Settings" detail="Update about footer description" :rule="rules" />
  </Layout>
</template>

<script lang="ts" setup>
import FormSection from '~/components/admin/section/formsection.vue'
import Layout from '@/components/admin/setting/layout.vue'
definePageMeta({
  layout: 'admin',
})

const rules = {
  title: true,
  content: true,
}
</script>

<style></style>