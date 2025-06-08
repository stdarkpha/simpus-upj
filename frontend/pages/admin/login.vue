<script setup lang="ts">
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import UserAuthForm from "@/components/admin/login/formlogin.vue";

definePageMeta({
   layout: "blank",
   middleware: ["guest"],
});
</script>

<template>
   <div class="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <NuxtLink to="/" :class="cn(buttonVariants({ variant: 'ghost' }), 'absolute right-4 top-4 md:right-8 md:top-8')"> Home </NuxtLink>
      <div class="relative hidden h-full flex-col p-10 text-white dark:border-r lg:flex">
         <div class="absolute inset-0">
            <img src="https://images.pexels.com/photos/2041540/pexels-photo-2041540.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" class="w-full h-full object-cover dark:grayscale opacity-40" alt="Background Admin" />
         </div>
         <div class="relative z-20 flex gap-4 items-center text-lg font-medium">
            <!-- <img class="grayscale brightness-[5]" src="/assets/favicon.png" alt="Logo"> -->
            IMS Global
         </div>
      </div>
      <div class="lg:p-8">
         <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div class="flex flex-col space-y-2 text-center">
               <h1 class="text-2xl font-semibold tracking-tight">CMS LOGIN IMS GLOBAL</h1>
               <p class="text-sm text-muted-foreground">Sign in to your account</p>
            </div>
            <UserAuthForm />
         </div>
      </div>
   </div>
</template>
