<template>
   <div>
      <h2>User Login</h2>
      <form @submit.prevent="userLogin(email, password)">
         <div>
            <label for="email">Email</label>
            <input id="email" type="email" v-model="email" required />
         </div>
         <div>
            <label for="password">Password</label>
            <input id="password" type="password" v-model="password" required />
         </div>
         <button type="submit">Login</button>
      </form>
   </div>
</template>

<script setup lang="ts">
definePageMeta({
   middleware: ["guest"],
});

const email = ref("");
const password = ref("");
</script>
