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
            title: "Inbox",
            icon: "ic:outline-mail",
            link: "/admin/inbox",
         },
         {
            title: "Section",
            icon: "material-symbols:team-dashboard-outline",
            link: "/admin/section",
            only: [1],
         },
         {
            title: "Manage User",
            icon: "ic:outline-people",
            link: "/admin/user",
            only: [1],
         },
         {
            title: "Social Media",
            icon: "ion:share-social-outline",
            link: "/admin/socialmedia",
            only: [1, 2],
         },
         {
            title: "Setting",
            icon: "ic:outline-settings",
            only: [1, 2],
            children: [
               {
                  title: "General",
                  link: "/admin/setting",
               },
               {
                  title: "About Footer",
                  link: "/admin/setting/about",
               },
               {
                  title: "Contact Info",
                  link: "/admin/setting/contact",
               },
            ],
         },
      ],
   },
   {
      heading: "Pages CMS",
      items: [
         {
            title: "Home",
            icon: "meteor-icons:home",
            only: [1, 2],
            children: [
               {
                  title: "Header",
                  link: "/admin/home",
               },
               {
                  title: "Product",
                  link: "/admin/home/product",
               },
               {
                  title: "Call Us",
                  link: "/admin/home/contact",
               },
               {
                  title: "Client",
                  link: "/admin/home/client",
               },
            ],
         },
         {
            title: "About",
            icon: "cuida:building-outline",
            only: [1, 2],
            children: [
               {
                  title: "Header",
                  link: "/admin/about",
               },
               {
                  title: "Company",
                  link: "/admin/about/company",
               },
               {
                  title: "Reason",
                  link: "/admin/about/reason",
               },
            ],
         },
         {
            title: "Services",
            icon: "material-symbols:design-services-outline-rounded",
            link: "/admin/service",
         },
         {
            title: "Projects",
            icon: "material-symbols:news-outline",
            link: "/admin/project",
         },
         {
            title: "Contact",
            only: [1, 2],
            icon: "ic:outline-contact-page",
            link: "/admin/setting/contact",
         },
      ],
   },
];

import { type UserData } from "@/components/admin/user/type";

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
         <SidebarNavFooter :user="{ name: '', email: '', avatar: null }" />
      </SidebarFooter>
   </Sidebar>
</template>
