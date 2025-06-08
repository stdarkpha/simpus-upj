<template>
  <Layout>
    <FormSection slug="about-header" title="Header Settings" detail="Update about header" :rule="rules" />
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
  image: true,
}
</script>

<style></style>