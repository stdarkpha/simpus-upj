<script setup lang="ts">
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify/vue";
import { toast } from "vue-sonner";

const isLoading = ref(false);
const email = ref("");
const password = ref("");

const { login } = useSanctumAuth();

const handleSubmit = async () => {
   isLoading.value = true;
   const credentials = {
      email: email.value,
      password: password.value,
   };
   try {
      await login(credentials);
      toast({
         title: "Success",
         description: "Welcome back!",
      });
   } catch (error) {
      console.error(error);
      toast({
         title: "Error",
         description: "Invalid email or password",
         variant: "destructive",
      });
   }
   isLoading.value = false;
};
</script>

<template>
   <div :class="cn('grid gap-6', $attrs.class ?? '')">
      <form @submit.prevent="handleSubmit">
         <div class="grid gap-2">
            <div class="grid gap-1">
               <Label class="sr-only" for="email"> Email </Label>
               <Input id="email" placeholder="name@example.com" type="email" auto-capitalize="none" auto-complete="email" auto-correct="off" :disabled="isLoading" v-model="email" />
            </div>
            <div class="grid gap-1">
               <Label class="sr-only" for="password"> Password </Label>
               <Input id="password" placeholder="*******" type="password" auto-capitalize="none" auto-complete="password" auto-correct="off" :disabled="isLoading" v-model="password" />
            </div>
            <Button :disabled="isLoading">
               <Icon v-if="isLoading" class="text-lg" icon="line-md:loading-twotone-loop" />
               Login
            </Button>
         </div>
      </form>
   </div>
</template>
