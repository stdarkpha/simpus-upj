<script setup lang="ts">
// import type { NavGroup, NavMenu } from '~/types/nav'
// import { navMenu } from '@/constants/menus'

interface MenuItem {
  title: string
  icon?: string
  link?: string
  children?: MenuItem[]
}

const navMenu: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'material-symbols:dashboard-2-outline-rounded',
    link: '/admin',
  },
  {
    title: 'Inbox',
    icon: 'ic:outline-mail',
    link: '/admin/inbox',
  },
  {
    title: 'Section',
    icon: 'material-symbols:team-dashboard-outline',
    link: '/admin/section',
  },
  {
    title: 'Manage User',
    icon: 'ic:outline-people',
    link: '/admin/user',
  },
  {
    title: 'Social Media',
    icon: 'ion:share-social-outline',
    link: '/admin/socialmedia',
  },
  {
    title: 'Setting',
    icon: 'ic:outline-settings',
    children: [
      {
        title: 'General',
        link: '/admin/setting',
      },
      {
        title: 'About Footer',
        link: '/admin/setting/about',
      },
      {
        title: 'Contact Info',
        link: '/admin/setting/contact',
      },
    ],
  },

  {
    title: 'Home',
    icon: 'meteor-icons:home',
    children: [
      {
        title: 'Header',
        link: '/admin/home',
      },
      {
        title: 'Product',
        link: '/admin/home/product',
      },
      {
        title: 'Call Us',
        link: '/admin/home/contact',
      },
      {
        title: 'Client',
        link: '/admin/home/client',
      },
    ],
  },
  {
    title: 'About',
    icon: 'cuida:building-outline',
    children: [
      {
        title: 'Header',
        link: '/admin/about',
      },
      {
        title: 'Company',
        link: '/admin/about/company',
      },
      {
        title: 'Reason',
        link: '/admin/about/reason',
      },
    ]
  },
  {
    title: 'Services',
    icon: 'material-symbols:design-services-outline-rounded',
    link: '/admin/service',
  },
  {
    title: 'Projects',
    icon: 'material-symbols:news-outline',
    link: '/admin/project',
  },
  {
    title: 'Contact',
    icon: 'ic:outline-contact-page',
    link: '/admin/setting/contact',
  }
];


const { metaSymbol } = useShortcuts()

const openCommand = ref(false)
const router = useRouter()

defineShortcuts({
  Meta_K: () => openCommand.value = true,
})

function handleSelectLink(link: string) {
  router.push(link)
  openCommand.value = false
}

import Kbd from '@/components/admin/base/Kbd.vue'
</script>

<template>
  <SidebarMenuButton as-child tooltip="Search">
    <Button variant="outline" size="sm" class="text-xs" @click="openCommand = !openCommand">
      <Icon name="i-lucide-search" />
      <span class="font-normal group-data-[collapsible=icon]:hidden">Search Feature</span>
      <div class="ml-auto flex items-center space-x-0.5 group-data-[collapsible=icon]:hidden">
        <Kbd>{{ metaSymbol }}</Kbd>
        <Kbd>K</Kbd>
      </div>
    </Button>
  </SidebarMenuButton>

  <CommandDialog v-model:open="openCommand">
    <CommandInput placeholder="Type a name..." />
    <CommandList class="scrollbar-thin">
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandSeparator />
      <template v-for="nav in navMenu" :key="nav.title">
        <CommandGroup v-if="nav.children" :heading="nav.title">
          <CommandItem v-for="item in nav.children" :key="item.title" class="gap-2" :value="item.title"
            @select="item.link && handleSelectLink(item.link)">
            <Icon name="i-radix-icons-circle" />
            {{ item.title }}
          </CommandItem>
        </CommandGroup>
        <CommandGroup class="p-0" v-else>
          <CommandItem class="gap-2" :value="nav.title" @select="nav.link && handleSelectLink(nav.link)">
            <Icon name="i-radix-icons-circle" />
            {{ nav.title }}
          </CommandItem>
        </CommandGroup>
      </template>
    </CommandList>
  </CommandDialog>
</template>

<style scoped></style>
