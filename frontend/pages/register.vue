<template>
   <div class="w-full h-screen flex flex-col items-center justify-center px-8 gap-16">
      <img class="w-32 h-auto" src="/Logo-upj.webp" alt="Logo website" />
      <form @submit.prevent="handleRegister" class="w-full flex flex-col gap-6 max-w-sm">
         <h2 class="font-bold text-zinc-800">Pendaftaran Akun (Mahasiswa)</h2>
         <label for="name">
            <input class="shadow-md rounded-md shadow-slate-500/10 font-semibold w-full py-3 px-4" id="name" placeholder="Nama.." type="name" v-model="name" required />
         </label>
         <label for="nim">
            <input class="shadow-md rounded-md shadow-slate-500/10 font-semibold w-full py-3 px-4" id="nim" placeholder="NIM Mahasiswa.." type="nim" v-model="nim" required />
         </label>
         <label for="email">
            <input class="shadow-md rounded-md shadow-slate-500/10 font-semibold w-full py-3 px-4" id="email" placeholder="Email.." type="email" v-model="email" required />
         </label>
         <label for="password">
            <input class="shadow-md rounded-md shadow-slate-500/10 font-semibold w-full py-3 px-4" id="password" placeholder="Sandi.." type="password" v-model="password" required />
         </label>
         <label for="pass_confirm">
            <input class="shadow-md rounded-md shadow-slate-500/10 font-semibold w-full py-3 px-4" id="pass_confirm" placeholder="Konfirmasi Sandi.." type="password" v-model="pass_confirm" required />
         </label>
         <motion.button :initial="false" :while-press="{ scale: 0.95, filter: 'brightness(0.8)' }" class="w-full flex items-center gap-2 justify-center bg-red-500 shadow-xl shadow-red-400/50 py-4 rounded-md font-semibold text-white" type="submit">
            <Icon v-if="isLoading" icon="mingcute:loading-fill" class="animate-spin text-xl" />
            {{ isLoading ? "Loading.." : "Daftar" }}
         </motion.button>
      </form>

      <p class="text-zinc-400 font-medium">Punya akun? <nuxt-link class="font-bold text-red-500" to="/login">Masuk</nuxt-link></p>
   </div>
</template>

<script setup lang="ts">
definePageMeta({
   middleware: ["guest"],
});

import { motion } from "motion-v";
import { Icon } from "@iconify/vue";
import { toast } from "vue-sonner";

const email = ref("");
const password = ref("");
const name = ref("");
const nim = ref("");
const pass_confirm = ref("");
const isLoading = ref(false);

const config = useRuntimeConfig().public.API_URL;

const handleRegister = async () => {
   if (password.value !== pass_confirm.value) {
      alert("Password dan konfirmasi password tidak cocok.");
      return;
   }

   isLoading.value = true;

   await $fetch(`${config}user/register`, {
      method: "POST",
      body: {
         name: name.value,
         email: email.value,
         uid: nim.value,
         password: password.value,
         password_confirmation: pass_confirm.value,
      },
      onResponse: ({ response }) => {
         isLoading.value = false;
         if (response._data.success) {
            toast.success("Pendaftaran berhasil! Silakan masuk.");
            navigateTo("/login");
         } else {
            toast.error(response._data.message || "Pendaftaran gagal. Silakan coba lagi.");
         }
      },
   });
};
</script>
