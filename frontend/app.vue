<template>
   <NuxtLayout>
      <Toaster rich-colors />
      <Suspense>
         <NuxtPage />
         <template #fallback>
            <div class="w-full py-24 text-gray-600 h-screen flex items-center justify-center">
               <Icon icon="mingcute:loading-3-line" class="text-4xl animate-spin " />
               Harap Tunggu...
            </div>
         </template>
      </Suspense>
   </NuxtLayout>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'
</script>
