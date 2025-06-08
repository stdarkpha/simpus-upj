<template>
   <form class="space-y-6 max-w-2xl" @submit.prevent="submitForm">
      <Separator class="my-6" />
      <div class="grid w-full items-center gap-3.5">
         <Label for="name">Name</Label>
         <Input id="name" v-model="name" type="text" placeholder="Name" />
      </div>
      <div class="grid w-full items-center gap-3.5">
         <Label for="email">Email</Label>
         <Input id="email" v-model="email" type="email" placeholder="email" />
      </div>
      <div class="grid w-full items-center gap-3.5">
         <Label for="role">Role</Label>
         <Select id="role" v-model="category">
            <SelectTrigger>
               <SelectValue placeholder="select user role" />
            </SelectTrigger>
            <SelectContent>
               <template v-for="category in props.category_data" :key="category.id">
                  <SelectItem class="capitalize" v-if="category.name != 'root'" :value="category.id">
                     {{ category.name }}
                  </SelectItem>
               </template>
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
      <Button type="submit"> Submit </Button>
   </form>
</template>

<script setup lang="ts">
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "vue-sonner";

const props = defineProps<{
   category_data: any;
   id?: number;
}>();

const emit = defineEmits();
const name = ref("");
const email = ref("");
const password = ref("");
const confirm_password = ref("");
const category = ref<number | null>(null);
const client = useSanctumClient();

const submitForm = async () => {
   const formData = {
      id: props.id ? props.id.toString() : undefined,
      role_id: category.value,
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: confirm_password.value,
   };

   await client("user/add", {
      method: "POST",
      body: formData,
      onResponse({ response }) {
         if (response._data.message) {
            emit("refresh");
            toast({
               title: "Success",
               description: response._data.message,
            });
            useAdminStore().fetchUserData();
         }
      },
      onResponseError({ response }) {
         Object.keys(response._data.errors).forEach((key) => {
            response._data.errors[key].forEach(async (error: any) => {
               toast({
                  title: "Error",
                  description: error,
                  variant: "destructive",
               });
            });
         });
      },
   });
};

if (props.id) {
   client(`user/${props.id}`, {
      onResponse({ response }) {
         // Map Data
         const data = response._data.data;
         if (!data) {
            emit("refresh");
            toast({
               title: "Error",
               description: "Client not found",
               variant: "destructive",
            });
         }
         console.log("Data", data);

         // set form data
         name.value = data.name;
         email.value = data.email;
         category.value = data.role_id;
      },
   });
}
</script>
