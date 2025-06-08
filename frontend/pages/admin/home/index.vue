<template>
  <Layout>
    <FormSection slug="home-header" title="Header Settings" detail="Update the header section" :rule="rules" />
  </Layout>
</template>

<script lang="ts" setup>
import FormSection from '~/components/admin/section/formsection.vue'
import Layout from '@/components/admin/home/layout.vue'
definePageMeta({
  layout: 'admin',
})

const rules = {
  title: true,
  subtitle: true,
  url: true,
  image: true,
  cta: true,
}
</script>

<style></style>