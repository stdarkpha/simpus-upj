<script setup lang="ts">
import AppSidebar from "@/components/admin/AppSidebar.vue";
import Header from "@/components/admin/layout/Header.vue";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Icon } from "@iconify/vue";

const colorMode = useColorMode();

console.log(colorMode.value);

if (colorMode.value === "dark") {
   document.body.classList.add("!scrollbar-thumb-zinc-600");
   document.body.classList.add("!scrollbar-track-zinc-900");
}

watch(
   () => colorMode.value,
   (val) => {
      if (val === "dark") {
         document.body.classList.add("!scrollbar-thumb-zinc-600");
         document.body.classList.add("!scrollbar-track-zinc-900");
      } else {
         document.body.classList.remove("!scrollbar-thumb-zinc-600");
         document.body.classList.remove("!scrollbar-track-zinc-900");
      }
   }
);

// const { setLocale, locale } = useI18n();

// watch(
//    () => locale.value,
//    () => {
//       window.location.reload();
//    }
// );
</script>

<template>
   <div>
      <Toaster :duration="2000" />
      <SidebarProvider>
         <AppSidebar />
         <div class="flex flex-col fixed sm:hidden bottom-0 right-0 m-4 gap-2 z-50">
            <DropdownMenu>
               <DropdownMenuTrigger as-child>
                  <Button variant="outline">
                     <Icon icon="ion:language" class="h-[1.2rem] w-[1.2rem] transition-all" />
                  </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end">
                  <!-- <DropdownMenuItem @click="setLocale('en')"> English </DropdownMenuItem>
                  <DropdownMenuItem @click="setLocale('id')"> Indonesia </DropdownMenuItem> -->
               </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
               <DropdownMenuTrigger as-child>
                  <Button variant="outline">
                     <Icon icon="radix-icons:moon" class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                     <Icon icon="radix-icons:sun" class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                     <span class="sr-only">Toggle theme</span>
                  </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end">
                  <DropdownMenuItem @click="colorMode.preference = 'light'"> Light </DropdownMenuItem>
                  <DropdownMenuItem @click="colorMode.preference = 'dark'"> Dark </DropdownMenuItem>
                  <DropdownMenuItem @click="colorMode.preference = 'system'"> System </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </div>

         <main class="w-full">
            <Header class="z-40 bg-background/50 backdrop-blur-xl">
               <!-- <DateRangePicker /> -->
               <!-- Toggle Dark Mode -->
               <div class="flex max-sm:hidden bottom-0 right-0 m-4 flex-row gap-4">
                  <DropdownMenu>
                     <DropdownMenuTrigger as-child>
                        <Button variant="outline">
                           <Icon icon="ion:language" class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                           <!-- <span class="hidden md:block">{{ locale == "en" ? "English" : "Indonesia" }}</span> -->
                           <Icon class="hidden md:block" icon="iconamoon:arrow-down-2-bold" />
                        </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end">
                        <!-- <DropdownMenuItem @click="setLocale('en')"> English </DropdownMenuItem>
                        <DropdownMenuItem @click="setLocale('id')"> Indonesia </DropdownMenuItem> -->
                     </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                     <DropdownMenuTrigger as-child>
                        <Button variant="outline">
                           <Icon icon="radix-icons:moon" class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                           <Icon icon="radix-icons:sun" class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                           <span class="sr-only">Toggle theme</span>
                        </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end">
                        <DropdownMenuItem @click="colorMode.preference = 'light'"> Light </DropdownMenuItem>
                        <DropdownMenuItem @click="colorMode.preference = 'dark'"> Dark </DropdownMenuItem>
                        <DropdownMenuItem @click="colorMode.preference = 'system'"> System </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
               </div>
            </Header>
            <SidebarInset>
               <div class="min-w-0 w-full flex-1 overflow-x-auto p-4 lg:p-6">
                  <Suspense>
                     <div>
                        <slot />
                     </div>
                     <template #fallback>
                        <div class="flex flex-col justify-center items-center h-64">
                           <Icon icon="eos-icons:three-dots-loading" class="text-8xl text-black dark:text-white" />
                           <span class="text-muted-foreground">Processing data...</span>
                        </div>
                     </template>
                  </Suspense>
               </div>
            </SidebarInset>
         </main>
      </SidebarProvider>
   </div>
</template>
