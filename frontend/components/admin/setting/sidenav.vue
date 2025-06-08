<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Item {
  title: string
  href: string
}

const route = useRoute()

const sidebarNavItems: Item[] = [
  {
    title: 'General Info',
    href: '/admin/setting',
  },
  {
    title: 'About Footer',
    href: '/admin/setting/about',
  },
  {
    title: 'Contact Info',
    href: '/admin/setting/contact',
  },
]
</script>

<template>
  <nav class="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-1">
    <Button v-for="(item, index) in sidebarNavItems" :key="item.title" variant="ghost" :class="cn(
      'w-full text-left justify-start items-start',
      route.path === item.href && 'bg-muted hover:bg-muted',
    )" as-child>
      <NuxtLink :to="item.href">
        {{ index < 10 ? '0' + (index + 1) : (index + 1) }}. {{ item.title }} </NuxtLink>
    </Button>
  </nav>
</template>
