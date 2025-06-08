<script setup lang="ts">
const route = useRoute()

function setLinks() {
  if (route.fullPath === '/admin') {
    return [{ title: 'Admin', href: '/' }]
  }
  let path = route.fullPath.split('?')[0]
  if (path.startsWith('/admin')) {
    path = path.replace('/admin', '')
  }
  return path.split('/').map((item, index) => {
    const str = item.replace(/-/g, ' ')
    const title = str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')

    return {
      title: index > 0 ? title : 'Admin',
      href: index > 0 ? `/admin/${item}` : '/admin',
    }
  })
}

const links = ref<{
  title: string
  href: string
}[]>(setLinks())

watch(() => route.fullPath, (val) => {
  if (val) {
    links.value = setLinks()
  }
})

import BreadcrumbCustom from '@/components/admin/base/BreadcrumbCustom.vue'
</script>

<template>
  <header class="sticky top-0 z-10 h-16 flex items-center gap-4 border-b bg-background px-4 md:px-6">
    <div class="w-full flex items-center gap-4">
      <SidebarTrigger />
      <Separator orientation="vertical" class="h-4" />
      <BreadcrumbCustom :links="links" />
    </div>
    <div class="ml-auto">
      <slot />
    </div>
  </header>
</template>

<style scoped></style>
