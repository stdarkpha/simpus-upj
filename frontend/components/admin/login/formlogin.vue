<script setup lang="ts">
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify/vue";

const email = ref("");
const password = ref("");
</script>

<template>
   <div :class="cn('grid gap-6', $attrs.class ?? '')">
      <form @submit.prevent="userLogin(email, password)">
         <div class="grid gap-2">
            <div class="grid gap-1">
               <Label class="sr-only" for="email"> Email </Label>
               <Input id="email" placeholder="name@example.com" type="email" auto-capitalize="none"
                  auto-complete="email" auto-correct="off" :disabled="isLoggin" v-model="email" />
            </div>
            <div class="grid gap-1">
               <Label class="sr-only" for="password"> Password </Label>
               <Input id="password" placeholder="*******" type="password" auto-capitalize="none"
                  auto-complete="password" auto-correct="off" :disabled="isLoggin" v-model="password" />
            </div>
            <Button :disabled="isLoggin">
               <Icon v-if="isLoggin" class="text-lg" icon="line-md:loading-twotone-loop" />
               Login
            </Button>
         </div>
      </form>
   </div>
</template>
