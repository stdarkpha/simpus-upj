<template>
   <form class="space-y-6 px-4 pb-8 scrollbar-thin max-w-2xl overflow-auto" @submit.prevent="submitForm">

      <div class="grid w-full items-center gap-3.5">
         <Label for="name">Name</Label>
         <Input id="name" v-model="name" type="text" placeholder="name" />
      </div>
      <Button type="submit" class="flex items-center gap-2 w-full">
         <Icon icon="mdi:loading" class="animate-spin" v-if="loading" />
         {{ loading ? "Loading..." : props.id ? "Update" : "Add" }} Category
      </Button>
   </form>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "vue-sonner";

const props = defineProps<{
   // category_data: any;
   id?: number;
}>();

const loading = ref(false);
const emit = defineEmits();
const name = ref("");

const { token } = useAuth()
const config = useRuntimeConfig();

const submitForm = async () => {
   loading.value = true;
   const formData = {
      id: props.id ? props.id : null,
      name: name.value,
   };

   await $fetch(`${config.public.API_URL}categories`, {
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
            useAdminStore().fetchBooksCategory();
         } else {
            loading.value = false;
            const errors = response._data.errors;
            toast.error(errors);
         }
      },
   })

};

if (props.id) {
   const data: any = await useAdminStore().fetchBooksCategoryDetails(props.id);

   if (data.success) {
      name.value = data.data.name;
   } else {
      emit("refresh");
      toast.error(data.message);
   }
}
</script>
