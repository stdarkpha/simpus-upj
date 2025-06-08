<template>
  <Layout>
    <FormSection slug="about-company" title="Company Detail" detail="Update company detail" :rule="rules" />
  </Layout>
</template>

<script lang="ts" setup>
import FormSection from '~/components/admin/section/formsection.vue'
import Layout from '@/components/admin/about/layout.vue'
definePageMeta({
  layout: 'admin',
})

const rules = {
  title: true,
  subtitle: true,
  url: true,
  image: true,
  cta: true,
  content: true
}
</script>

<style></style>