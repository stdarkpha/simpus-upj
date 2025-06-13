<template>
   <div class="w-full h-screen flex flex-col items-center justify-center px-8 gap-16">
      <img class="w-32 h-auto" src="/Logo-upj.webp" alt="Logo website">
      <form @submit.prevent="userLogin(email, password)" class="w-full flex flex-col gap-6 max-w-sm">
         <h2 class="font-bold text-zinc-800">Masuk untuk meminjam</h2>
         <label for="email">
            <input class="shadow-md rounded-md shadow-slate-500/10 font-semibold w-full py-3 px-4" id="email"
               placeholder="Email.." type="email" v-model="email" required />
         </label>
         <label for="password">
            <input class="shadow-md rounded-md shadow-slate-500/10 font-semibold w-full py-3 px-4" id="password"
               placeholder="Sandi.." type="password" v-model="password" required />
         </label>
         <motion.button :initial="false" :while-press="{ scale: 0.95, filter: 'brightness(0.8)' }"
            class="w-full flex items-center gap-2 justify-center bg-red-500 shadow-xl shadow-red-400/50 py-4 rounded-md font-semibold text-white"
            type="submit">
            <Icon v-if="isLoggin" icon="mingcute:loading-fill" class="animate-spin text-xl" />
            {{ isLoggin ? 'Loading..' : 'Masuk' }}
         </motion.button>
      </form>

      <p class="text-zinc-400 font-medium">
         Tidak punya akun? <nuxt-link class="font-bold text-red-500" to="/register">Daftar</nuxt-link>
      </p>
   </div>
</template>

<script setup lang="ts">
definePageMeta({
   middleware: ["guest"],
});

import { motion } from 'motion-v'
import { Icon } from '@iconify/vue';

const email = ref("farouq@upj.com");
const password = ref("admin123");
</script>
