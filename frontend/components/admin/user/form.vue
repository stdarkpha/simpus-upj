<template>
   <form class="space-y-6 px-4 pb-8 scrollbar-thin max-w-2xl overflow-auto" @submit.prevent="submitForm">

      <div class="grid w-full items-center gap-3.5">
         <Label for="name">Name</Label>
         <Input id="name" v-model="name" type="text" placeholder="name" />
      </div>
      <div v-if="role != 'admin'" class="grid w-full items-center gap-3.5">
         <Label for="uid">{{ role == 'dosen' ? 'NIDN' : 'NIM' }}</Label>
         <Input id="uid" v-model="uid" type="uid" placeholder="uid" />
      </div>
      <div class="grid w-full items-center gap-3.5">
         <Label for="email">Email</Label>
         <Input id="email" v-model="email" type="email" placeholder="email" />
      </div>
      <div class="grid w-full items-center gap-3.5">
         <Label for="role">Role</Label>
         <Select v-model="role">
            <SelectTrigger class="w-full">
               <SelectValue placeholder="Select a Role" />
            </SelectTrigger>
            <SelectContent>
               <SelectGroup>
                  <SelectLabel>Roles</SelectLabel>
                  <SelectItem :value="item" v-for="item in role_list" :disabled="item == 'admin'">
                     {{ item }}
                  </SelectItem>
               </SelectGroup>
            </SelectContent>
         </Select>
      </div>
      <div class="grid w-full items-center gap-3.5">
         <Label for="password">Password</Label>
         <Input id="password" v-model="password" type="password" placeholder="password" />
      </div>
      <div class="grid w-full items-center gap-3.5">
         <Label for="confirm">Confirm Password</Label>
         <Input id="confirm" v-model="confirm_password" type="password" placeholder="confirm password" />
      </div>
      <Button type="submit" class="flex items-center gap-2 w-full">
         <Icon icon="mdi:loading" class="animate-spin" v-if="loading" />
         {{ loading ? "Loading..." : props.id ? "Update User" : "Add User" }}
      </Button>
   </form>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "vue-sonner";
import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectLabel,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select'

const role_list = [
   'admin',
   'mahasiswa',
   'dosen',
   'staff',
]


const props = defineProps<{
   id?: number;
}>();

const loading = ref(false);
const emit = defineEmits();
const name = ref("");
const email = ref("");
const password = ref("");
const confirm_password = ref("");
const role = ref("dosen");
const uid = ref("");

const { token } = useAuth()
const config = useRuntimeConfig();

const submitForm = async () => {
   loading.value = true;
   const formData = {
      id: props.id ? props.id : null,
      role: role.value,
      name: name.value,
      uid: uid.value,
      email: email.value,
      password: password.value,
      password_confirmation: confirm_password.value,
   };

   await $fetch(`${config.public.API_URL}user/store`, {
      headers: {
         Authorization: `Bearer ${token.value}`,
         "Accept": "application/json",
      },
      method: "POST",
      body: formData,
      onResponse({ response }) {
         if (response._data.success) {
            toast.success('Success Saving User');
            loading.value = false;
            emit("refresh");
            useAdminStore().fetchUserData();
         } else {
            loading.value = false;
            const errors = response._data.errors;
            // toast.error(errors);
            errors.map((error: any) => {
               toast.error(error);
            });
         }
      },
   })

};

if (props.id) {
   const data: any = await useAdminStore().fetchUserDetails(props.id);
   // console.log("User Data", data);

   if (data.success) {
      name.value = data.data.name;
      email.value = data.data.email;
      role.value = data.data.role;
      uid.value = data.data.uid;
   } else {
      emit("refresh");
      toast({
         title: "Error",
         description: "Client not found",
         variant: "destructive",
      });
   }
}
</script>
