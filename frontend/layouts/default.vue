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

                  <div :class="[useRoute().path != '/app/bag' && !isScroll ? 'text-white' : '']"
                     class="flex flex-col transition-all duration-500">
                     <p class="text-sm opacity-75">Selamat {{ greetings }},</p>
                     <h1 class="font-semibold capitalize leading-4 max-w-28 truncate">{{ data?.data?.name }}</h1>
                  </div>
               </div>

               <!-- Notification -->
               <div class="relative">
                  <div v-if="unreadCount > 0"
                     class="absolute -top-1 -right-1 bg-red-800 shadow z-10 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                     {{ unreadCount > 99 ? '99+' : unreadCount }}
                  </div>
                  <div class="relative w-10 h-10 bg-white p-2 rounded-full overflow-hidden cursor-pointer"
                     @click="toggleNotifications">
                     <Icon icon="akar-icons:bell" class="w-full h-full text-red-600" />
                     <!-- Notification Badge -->
                  </div>

               </div>
            </div>
         </nav>
      </teleport>

      <!-- Notifications Panel -->
      <teleport to="body">
         <div v-if="showNotifications" class="fixed inset-0 z-40 bg-black/25 backdrop-blur-sm"
            @click="showNotifications = false">
         </div>

         <transition enter-active-class="transition ease-out duration-300"
            enter-from-class="opacity-0 translate-y-[-100%]" enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-[-100%]">

            <div v-if="showNotifications" class="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg">

               <!-- Header -->
               <div class="flex items-center justify-between p-4 border-b">
                  <h3 class="font-semibold text-lg">Notifications</h3>
                  <button @click="showNotifications = false" class="p-1">
                     <Icon icon="mdi:close" class="w-6 h-6 text-gray-500" />
                  </button>
               </div>

               <!-- Notifications List -->
               <div class="max-h-80 overflow-y-auto">
                  <div v-if="notifications.length === 0" class="p-8 text-center text-gray-500">
                     <Icon icon="akar-icons:bell" class="w-12 h-12 mx-auto mb-2 opacity-50" />
                     <p>No notifications yet</p>
                  </div>

                  <div v-else>
                     <div v-for="notification in notifications" :key="notification.id"
                        class="p-4 border-b hover:bg-gray-50 transition-colors"
                        :class="{ 'bg-blue-50': !notification.is_read }">

                        <div class="flex items-start gap-3">
                           <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" :class="{
                              'bg-green-100 text-green-600': notification.type === 'success',
                              'bg-yellow-100 text-yellow-600': notification.type === 'warning',
                              'bg-red-100 text-red-600': notification.type === 'error',
                              'bg-blue-100 text-blue-600': notification.type === 'info'
                           }">
                              <Icon icon="akar-icons:bell" class="w-4 h-4" />
                           </div>

                           <div class="flex-1 min-w-0">
                              <h4 class="font-medium text-gray-900 truncate">{{ notification.title }}</h4>
                              <p class="text-sm text-gray-600 mt-1">{{ notification.message }}</p>
                              <p class="text-xs text-gray-400 mt-2">
                                 {{ formatDate(notification.timestamp ?? '') }}
                              </p>
                           </div>

                           <div v-if="!notification.is_read" class="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0">
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               <!-- Footer -->
               <div v-if="notifications.length > 0" class="p-4 border-t bg-gray-50">
                  <button @click="markAllAsRead" class="text-sm text-blue-600 hover:text-blue-800 font-medium">
                     Mark all as read
                  </button>
               </div>
            </div>
         </transition>
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
import Pusher from 'pusher-js'

const { data, status } = useAuth()
const config = useRuntimeConfig()

// Define notification type
interface Notification {
   id: number
   user_id: number
   type: 'info' | 'success' | 'warning' | 'error'
   title: string
   message: string
   data?: any
   timestamp?: string
   is_read: boolean
   created_at: string
}

// Define API response type
interface NotificationResponse {
   success: boolean
   data: Notification[]
   message?: string
}

// Notification state
const notifications = ref<Notification[]>([])
const unreadCount = ref<number>(0)
const showNotifications = ref<boolean>(false)

// Pusher connection
let pusher: Pusher | null = null
let notificationChannel: any = null

const greetings = computed(() => {
   const hour = new Date().getHours()
   if (hour < 10) return 'Pagi'
   if (hour < 15) return 'Siang'
   if (hour < 18) return 'Sore'
   return 'Malam'
})

// Toggle notifications panel
const toggleNotifications = () => {
   showNotifications.value = !showNotifications.value
}
const { token } = useAuth();

// Initialize Pusher for real-time notifications
const initializePusher = () => {
   console.log('🚀 Initializing Pusher...')
   console.log('User data:', data?.value?.data)
   console.log('User ID:', data?.value?.data?.id)

   if (!data?.value?.data?.id) {
      console.warn('❌ Cannot initialize Pusher: User ID not found')
      return
   }

   try {
      // Close existing connection if any
      if (pusher) {
         pusher.disconnect()
      }

      // Initialize Pusher
      pusher = new Pusher(config.public.PUSHER_KEY, {
         cluster: config.public.PUSHER_CLUSTER,
         // encrypted: true,
         authEndpoint: `${config.public.API_URL}/broadcasting/auth`,
         auth: {
            headers: {
               Authorization: `Bearer ${token.value}`,
               Accept: 'application/json'
            }
         }
      })

      // Connect to user-specific channel
      const channelName = `user.${data.value.data.id}`
      console.log('📡 Subscribing to channel:', channelName)

      notificationChannel = pusher.subscribe(channelName)

      // Handle connection state
      pusher.connection.bind('connected', () => {
         console.log('✅ Pusher connected successfully!')
      })

      pusher.connection.bind('disconnected', () => {
         console.log('� Pusher disconnected')
      })

      pusher.connection.bind('error', (error: any) => {
         console.error('❌ Pusher connection error:', error)
      })

      // Listen for notification events
      notificationChannel.bind('notification.created', (data: Notification) => {
         // console.log('🔔 NEW NOTIFICATION RECEIVED via Pusher!')
         console.log('📨 Notification data:', data)

         // Add notification to the list
         notifications.value.unshift({
            ...data,
            is_read: false
         })

         // Update unread count
         unreadCount.value = notifications.value.filter((n: Notification) => !n.is_read).length
         console.log('📊 Updated unread count:', unreadCount.value)

         // Show toast notification
         showNotificationToast(data)
      })

      console.log('🎯 Pusher setup completed')

   } catch (error: any) {
      console.error('💥 Failed to initialize Pusher:', error)
   }
}

// Poll for notifications (fallback method)
const startPolling = () => {
   console.log('🔄 Starting notification polling as fallback...')

   const pollInterval = setInterval(async () => {
      try {
         const response = await $fetch<NotificationResponse>(`/notifications`, {
            baseURL: config.public.API_URL,
            headers: {
               'Authorization': `Bearer ${token.value}`,
               'Accept': 'application/json'
            }
         })

         if (response.success && response.data.length > 0) {
            console.log('📨 Checking notifications via polling')

            // Update notifications if new ones are found
            const existingIds = notifications.value.map(n => n.id)
            const newNotifications = response.data.filter(n => !existingIds.includes(n.id))

            if (newNotifications.length > 0) {
               console.log('📨 New notifications via polling:', newNotifications.length)
               newNotifications.forEach((notification: Notification) => {
                  notifications.value.unshift(notification)
                  if (!notification.is_read) {
                     showNotificationToast(notification)
                  }
               })
               unreadCount.value = notifications.value.filter((n: Notification) => !n.is_read).length
            }
         }
      } catch (error) {
         console.error('❌ Polling error:', error)
      }
   }, 30000) // Poll every 30 seconds

   // Cleanup polling on unmount
   onBeforeUnmount(() => {
      clearInterval(pollInterval)
   })
}

// Show notification toast
const showNotificationToast = (notification: Notification) => {
   // You can use your preferred toast library here
   // For now, we'll use a simple browser notification if supported
   if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
         body: notification.message,
         icon: '/logo.png'
      })
   } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
         if (permission === 'granted') {
            new Notification(notification.title, {
               body: notification.message,
               icon: '/logo.png'
            })
         }
      })
   }
}

// Load initial notifications
const loadNotifications = async () => {

   try {
      const response = await $fetch<NotificationResponse>('/notifications', {
         baseURL: config.public.API_URL,
         headers: {
            'Authorization': `Bearer ${token.value}`,
            'Accept': 'application/json'
         }
      })

      if (response.success) {
         notifications.value = response.data.map((n: Notification) => ({ ...n, is_read: n.is_read || false }))
         unreadCount.value = notifications.value.filter((n: Notification) => !n.is_read).length
      }
   } catch (error: any) {
      console.error('Failed to load notifications:', error)
   }
}

// Format date for display
const formatDate = (dateString: string): string => {
   const date = new Date(dateString)
   const now = new Date()
   const diffMs = now.getTime() - date.getTime()
   const diffMins = Math.floor(diffMs / 60000)
   const diffHours = Math.floor(diffMs / 3600000)
   const diffDays = Math.floor(diffMs / 86400000)

   if (diffMins < 1) return 'Just now'
   if (diffMins < 60) return `${diffMins}m ago`
   if (diffHours < 24) return `${diffHours}h ago`
   if (diffDays < 7) return `${diffDays}d ago`

   return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
   })
}

// Mark all notifications as read
const markAllAsRead = async (): Promise<void> => {
   try {
      const response = await $fetch<{ success: boolean }>('/notifications/read-all', {
         method: 'PUT',
         baseURL: config.public.API_URL,
         headers: {
            'Authorization': `Bearer ${token.value}`,
            'Accept': 'application/json'
         }
      })

      if (response.success) {
         notifications.value.forEach((n: Notification) => n.is_read = true)
         unreadCount.value = 0
         showNotifications.value = false
      }
   } catch (error: any) {
      console.error('Failed to mark all notifications as read:', error)
   }
}

// Test Pusher notification (for debugging)
const testPusherNotification = async (): Promise<void> => {
   console.log('🧪 Testing Pusher notification...')
   try {
      const response = await $fetch<{ success: boolean; message: string }>('/test/pusher', {
         method: 'POST',
         baseURL: config.public.API_URL,
         headers: {
            'Authorization': `Bearer ${token.value}`,
            'Accept': 'application/json'
         }
      })

      console.log('🧪 Test response:', response)
      if (response.success) {
         console.log('✅ Test notification created - check Pusher connection for real-time update')
      }
   } catch (error: any) {
      console.error('❌ Failed to create test notification:', error)
   }
}

onMounted(async () => {


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


   await loadNotifications()

   // Wait a bit to ensure user data is fully loaded
   await new Promise(resolve => setTimeout(resolve, 500))

   // Try Pusher first, fallback to polling if it fails
   try {
      initializePusher()
      // Also start polling as a backup
      // setTimeout(() => startPolling(), 5000)
   } catch (error) {
      console.error('❌ Pusher failed, using polling only:', error)
      startPolling()
   }

   // Cleanup connections on unmount
   onBeforeUnmount(() => {
      if (pusher) {
         pusher.disconnect()
      }
   })
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
