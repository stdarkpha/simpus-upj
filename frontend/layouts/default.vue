<template>
   <div>
      <teleport to="body">
         <nav :class="[status == 'unauthenticated' ? '-translate-y-24' : 'translate-y-0',
         isScroll ? 'bg-white shadow-lg' : 'bg-transparent']
            " class="fixed z-50 top-0 left-0 w-full transition-all duration-500">
            <div class="container relative flex items-center transition-all duration-1000 justify-between p-4">
               <!-- Akun -->
               <div class="flex items-center gap-4">
                  <div class="w-10 h-10 bg-white p-2 rounded-full overflow-hidden">
                     <img class="w-full h-full object-cover" src="/logo.png" alt="">
                  </div>

                  <div :class="[useRoute().path != '/app/bag' && !isScroll  ? 'text-white' : '']" class="flex flex-col transition-all duration-500">
                     <p class="text-sm opacity-75">Selamat {{ greetings }},</p>
                     <h1 class="font-semibold capitalize leading-4 max-w-28 truncate">{{ data?.data?.name }}</h1>
                  </div>
               </div>

               <!-- Notification -->
               <div class="w-10 h-10 bg-white p-2 rounded-full overflow-hidden">
                  <Icon icon="akar-icons:bell" class="w-full h-full text-red-600" />
               </div>
            </div>
         </nav>
      </teleport>

      <nav :class="status == 'unauthenticated' ? '-bottom-32' : 'bottom-0'"
         class="fixed z-50 transition-all duration-1000 left-0 w-full bg-white"
         style="box-shadow: 0 -px 16px 0 rgba(0,0,0,.1);">
         <div class="flex items-center justify-between">
            <template v-for="(item, index) in menu_data" :key="index">

               <motion.div :while-press="{ scale: .8 }" v-if="index != 2" class="flex-1">
                  <NuxtLink :to="item.route" active-class="text-red-600"
                     class="flex  flex-col items-center gap-1 text-gray-500 hover:text-red-600 focus:text-red-600">
                     <Icon :icon="item.icon" class="text-2xl" />
                     <span class="text-xs font-bold capitalize">{{ item.title }}</span>
                  </NuxtLink>
               </motion.div>
               <motion.div v-else :while-press="{ scale: .8 }">
                  <NuxtLink :to="item.route" active-class="-translate-y-2"
                     class="flex w-20 -translate-y-1/3 text-3xl transition-all group flex-col items-center justify-center gap-1 bg-red-500 shadow-xl shadow-red-400/50 text-white aspect-square rounded-full">
                     <Icon :icon="item.icon" />
                     <span class="font-bold group-[&.active]:hidden text-sm capitalize">{{ item.title }}

                     </span>
                  </NuxtLink>
               </motion.div>
            </template>
         </div>
      </nav>
      <div class="pb-24 pt-16">
         <slot />
      </div>
   </div>
</template>

<script lang="ts" setup>
import { motion } from 'motion-v'
const { data, status } = useAuth()
const greetings = computed(() => {
   const hour = new Date().getHours()
   if (hour < 10) return 'Pagi'
   if (hour < 15) return 'Siang'
   if (hour < 18) return 'Sore'
   return 'Malam'
})

onMounted(() => {
   const handleScroll = () => {
      if (window.scrollY > 0) {
         isScroll.value = true
      } else {
         isScroll.value = false
      }
   }
   window.addEventListener('scroll', handleScroll)
   // Call once to set initial state
   handleScroll()
})

const isScroll = ref(false)

import { Icon } from '@iconify/vue'

const menu_data = ref([
   {
      title: 'utama',
      icon: 'cuida:dashboard-outline',
      route: '/app/dashboard'
   },
   {
      title: 'buku',
      icon: 'material-symbols:book-outline',
      route: '/app/book'
   },
   {
      title: 'tas',
      icon: 'solar:bag-5-bold',
      route: '/app/bag'
   },
   {
      title: 'riwayat',
      icon: 'ic:round-history',
      route: '/app/history'
   },
   {
      title: 'akun',
      icon: 'mingcute:user-4-line',
      route: '/app/account'
   },
])


</script>

<style>
.fade-enter-active,
.fade-leave-active {
   transition: all ease 0.5s;
}

.fade-enter-from,
.fade-leave-to {
   opacity: 0;
}

.layout-enter-active,
.layout-leave-active {
   transition: all ease 0.5s;
}

.layout-enter-from {
   opacity: 0;
}

.layout-leave-to {
   opacity: 0;
}
</style>
