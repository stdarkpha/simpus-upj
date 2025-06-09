<script setup lang="ts">
import { cn } from '@/lib/utils'
import { Icon } from '@iconify/vue'

interface Item {
    icon: string
    title: string
    link: string
}

const route = useRoute()

const sidebarNavItems: Item[] = [
    {
        icon: "material-symbols:design-services-outline-rounded",
        title: "Book",
        link: "/admin/library/book",
    },
    {
        icon: "material-symbols:news-outline",
        title: "Lending",
        link: "/admin/library/lending",
    },
    {
        icon: "iconamoon:scanner-light",
        title: "Scanner",
        link: "/admin/library/scanner",
    },
]
</script>

<template>
    <nav class="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-1">
        <Button v-for="(item, index) in sidebarNavItems" :key="item.title" variant="ghost" :class="cn(
            'w-full text-left justify-start items-start',
            route.path === item.link && 'bg-muted hover:bg-muted',
        )" as-child>
            <NuxtLink :to="item.link" class="flex items-center gap-2">
                <Icon :icon="item.icon" />
                {{ index < 10 ? '0' + (index + 1) : (index + 1) }}. {{ item.title }} </NuxtLink>
        </Button>
    </nav>
</template>
