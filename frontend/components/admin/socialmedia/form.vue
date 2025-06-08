<template>
   <form class="space-y-6 max-w-2xl" @submit.prevent="submitData">
      <Separator class="my-6" />
      <div class="grid w-full items-center gap-3.5">
         <Label for="category">Icon</Label>
         <Select id="category" v-model="select_icon">
            <SelectTrigger>
               <SelectValue placeholder="Select a Icon" />
            </SelectTrigger>
            <SelectContent>
               <SelectItem v-for="item in icon" :key="item" :value="item">
                  <div class="flex items-center gap-2">
                     <Icon :icon="item" class="text-2xl" />
                     {{ item }}
                  </div>
               </SelectItem>
            </SelectContent>
         </Select>
      </div>
      <div class="grid w-full items-center gap-3.5">
         <Label for="title-en">Url</Label>
         <Input id="title-en" v-model="url" />
      </div>
      <div class="grid w-full items-center gap-3.5">
         <Label for="order">Order</Label>
         <Select id="order" v-model="order">
            <SelectTrigger>
               <SelectValue placeholder="Choose order" />
            </SelectTrigger>
            <SelectContent>
               <SelectItem v-for="(item, index) in total" :key="index" :value="item">
                  {{ item }}
               </SelectItem>
            </SelectContent>
         </Select>
      </div>
      <div class="grid w-full items-center gap-3.5">
         <Label for="status">Status</Label>
         <Select id="status" v-model="status">
            <SelectTrigger>
               <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
               <SelectItem value="active">Active</SelectItem>
               <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
         </Select>
      </div>
      <Button type="submit"> Submit </Button>
   </form>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { Input } from "@/components/ui/input";
import { toast } from "vue-sonner";
import { Label } from "@/components/ui/label";

const total = computed(() => {
   if (props.length) {
      return props.length + 1;
   }
   return 1;
});

const props = defineProps<{
   id?: number;
   length: number;
}>();

const icon = ref(["uiw:facebook", "streamline:instagram-solid", "akar-icons:twitter-fill", "prime:twitter", "mdi:linkedin", "mingcute:youtube-fill"]);

// ref
const select_icon = ref("");
const order = ref(total.value);
const url = ref("");
const status = ref("active");
const emit = defineEmits();
const client = useSanctumClient();

// map if props.data is not empty
if (props.id) {
   client(`social/${props.id}`, {
      onResponse({ response }) {
         // Map Data
         const data = response._data.data;
         if (!data) {
            emit("refresh");
            toast({
               title: "Error",
               description: "Group not found",
               variant: "destructive",
            });
         }
         select_icon.value = data.icon;
         url.value = data.url;
         order.value = data.order;
         status.value = data.status;
      },
   });
}

const submitData = async () => {
   const data = {
      id: props.id ?? null,
      icon: select_icon.value,
      url: url.value,
      order: order.value,
      status: status.value,
   };
   client("social", {
      method: "POST",
      body: JSON.stringify(data),
      onResponse({ response }) {
         if (response._data.message) {
            emit("refresh");
            toast({
               title: "Success",
               description: response._data.message,
            });
            useAdminStore().fetchSocialData();
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
</script>
