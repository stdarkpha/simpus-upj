<template>
   <div>
      ini dashboard page

      {{ data }}
      <!-- <code>{{ data.data?.role === "admin" }}</code> -->

      <!-- Button Logout -->
      <div class="flex justify-end">
         <button class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" @click="signOut({ callbackUrl: '/login' })">Logout</button>
      </div>
   </div>
</template>

<script lang="ts" setup>
definePageMeta({
   middleware: ["auth"],
});

const { data, signOut } = useAuth();
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

onMounted(() => {
   if (loggedIn.value) {
      //@ts-ignore
      toast(`Welcome, ${data.value?.data?.name}`, {
         theme: "auto",
         type: "success",
         pauseOnHover: false,
      });

      loggedIn.value = false;
   }
});
</script>

<style></style>
