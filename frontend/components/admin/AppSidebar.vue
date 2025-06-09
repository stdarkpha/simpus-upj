<script setup lang="ts">
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";

// Menu items.
const navMenu: any = [
   {
      heading: "General",
      items: [
         {
            title: "Dashboard",
            icon: "material-symbols:dashboard-2-outline-rounded",
            link: "/admin",
         },
         {
            title: "Manage User",
            icon: "ic:outline-people",
            link: "/admin/user",
            // only: [1],
         },
      ],
   },
   {
      heading: "Library",
      items: [
         {
            title: "Book",
            icon: "material-symbols:design-services-outline-rounded",
            link: "/admin/library/book",
         },
         {
            title: "Lending",
            icon: "material-symbols:news-outline",
            link: "/admin/library/lending",
         },
         {
            title: "Scanner",
            icon: "iconamoon:scanner-light",
            link: "/admin/library/scanner",
            // only: [1],
         },
      ],
   },
];

const { data } = useAuth();

import NavHeader from "@/components/admin/layout/SidebarNavHeader.vue";
import LayoutSidebarNavGroup from "@/components/admin/layout/SidebarNavGroup.vue";
import LayoutSidebarNavLink from "@/components/admin/layout/SidebarNavLink.vue";
import Search from "@/components/admin/Search.vue";
import SidebarNavFooter from "@/components/admin/layout/SidebarNavFooter.vue";
</script>

<template>
   <Sidebar class="z-50">
      <SidebarHeader>
         <NavHeader />
         <Search />
      </SidebarHeader>
      <SidebarContent>
         <SidebarContent>
            <SidebarGroup v-for="(nav, indexGroup) in navMenu" :key="indexGroup">
               <SidebarGroupLabel v-if="nav.heading">
                  {{ nav.heading }}
               </SidebarGroupLabel>
               <template v-for="(item, index) in nav.items" :key="index">
                  <template v-if="item.children">
                     <LayoutSidebarNavGroup v-if="!item.only" :item="item" />
                  </template>
                  <template v-else>
                     <LayoutSidebarNavLink v-if="!item.only" :item="item" />
                  </template>
               </template>
            </SidebarGroup>
         </SidebarContent>
      </SidebarContent>
      <SidebarFooter>
         <SidebarNavFooter v-if="data?.data" :user="data.data" />
      </SidebarFooter>
   </Sidebar>
</template>
