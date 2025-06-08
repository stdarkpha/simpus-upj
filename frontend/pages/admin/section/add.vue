<template>
  <FormSection @close="() => {
    useRouter().push('/admin/section')
  }" title="Section Generate" detail="Create New Section Settings" :rule="rules" />
</template>

<script lang="ts" setup>
import FormSection from '~/components/admin/section/formsection.vue'
definePageMeta({
  layout: 'admin',
})

const rules = {
  title: true,
  subtitle: true,
  url: true,
  image: true,
  cta: true,
  content: true,
}
</script>

<style></style>