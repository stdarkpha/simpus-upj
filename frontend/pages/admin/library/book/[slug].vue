<template>
  <form class="" @submit.prevent="submitForm" enctype="multipart/form-data">
    <div>
      <h3 class="text-lg font-medium">
        Form Book
      </h3>
      <p class="text-sm text-muted-foreground">
        {{ slug != 'add' ? 'Edit' : 'Add New' }} Book
      </p>
    </div>
    <Separator class="my-6" />
    <div class="grid grid-cols-6 gap-8">
      <div class="space-y-6 col-span-1">
        <div class="grid w-full items-center gap-3.5">
          <Label for="picture">Cover</Label>
          <Input id="picture" @change="handleFile" type="file" />

          <img v-if="picture || img" :src="pictureUrl ? pictureUrl : img" class="w-full h-auto rounded-md object-cover"
            alt="Preview Image" />
          <!-- placeholder -->
          <img v-else src="https://placehold.co/100x140?text=Insert+Image+Here"
            class="w-full h-auto rounded-md object-cover" alt="Placeholder Image" />
        </div>
      </div>

      <div class="space-y-6 col-span-4 max-md:order-2">
        <div class="grid w-full items-center gap-3.5">
          <Label for="title">Title</Label>
          <Input id="title" v-model="title" type="text" placeholder="Title En" />
        </div>
        <div class="grid w-full items-center gap-3.5">
          <Label for="description">Book Description</Label>
          <div class="dark:invert dark:brightness-[.95]">
            <Editor class="" api-key="fey8wj8gkyvmqosk9z11eji4hyyx2bvyrm0mtgkh79wc0zgw" :init="editorInit"
              v-model="description" />
          </div>
        </div>

        <div class="flex gap-4 w-full items-center justify-center">
          <Button type="submit">
            Submit Data
          </Button>
          <NuxtLink to="/admin/library/book">
            <Button variant="destructive" type="button">
              Cancel
            </Button>
          </NuxtLink>
        </div>
      </div>

      <div class="space-y-6 col-span-1">


        <div class="w-full items-center gap-3.5">
          <Label for="category" class="mb-4">Category</Label>
          <Select id="category" v-model="category_id">
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="item in adminStore.data_books_category" :key="item.id" :value="item.id">
                <span class="capitalize">{{ item.name }}</span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="grid w-full items-center gap-3.5">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger as-child>
              <div>
                <Button type="button" variant="outline"
                  class="text-muted-foreground w-full ps-3 text-start font-normal">
                  <span>{{ release_date ? release_date : "Pick a date" }}</span>
                  <!-- <Icon  class="ms-auto h-4 w-4 opacity-50" /> -->
                  <Icon icon="ep:calendar" class="opacity-50 ms-auto h-4 w-4" />
                </Button>
                <input hidden>
              </div>
            </PopoverTrigger>
            <PopoverContent class="w-auto p-0">
              <AdminBaseDatePicker v-model="release_date" initial-focus />
              <!-- <Calendar v-model:placeholder="placeholder" v-model="date" calendar-label="Date" initial-focus /> -->
            </PopoverContent>
          </Popover>
        </div>
        <div class="grid w-full items-center gap-3.5">
          <Label for="author">Author</Label>
          <Input id="author" v-model="author" type="text" placeholder="author" />
        </div>
        <div class="grid w-full items-center gap-3.5">
          <Label for="stock">Stock</Label>
          <Input id="stock" v-model="stock" type="text" placeholder="stock" />
        </div>
        <div class="grid w-full items-center gap-3.5">
          <Label for="total_page">Total Page</Label>
          <Input id="total_page" v-model="total_page" type="text" placeholder="ex: 100" />
        </div>

        <div class="grid w-full items-center gap-3.5">
          <Label for="status">Status</Label>
          <Select class="w-full" id="status" v-model="status">
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ["admin"],
})

import { Icon } from "@iconify/vue";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { toast } from 'vue-sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import Editor from '@tinymce/tinymce-vue'
const editorInit = computed(() => ({
  toolbar_mode: 'sliding',
  plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
  toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
}))

const picture = ref<File | null>(null)
const img = ref<string | null>(null)

const pictureUrl = computed(() => {
  if (picture.value) {
    return URL.createObjectURL(picture.value)
  }
});

const handleFile = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    picture.value = file
  }
}

const id = ref(null)
const title = ref('')
const description = ref('')
const category_id = ref(null)
const status = ref('active')
const release_date = ref<any>(undefined)
const author = ref('')
const stock = ref('')
const total_page = ref('')
const config = useRuntimeConfig()
const emit = defineEmits()
const { token } = useAuth()

const submitForm = async () => {
  const formData = new FormData()
  if (!category_id.value) {
    toast.error('Please select a category')
    return;
  }
  if (id.value) {
    formData.append('id', id.value)
  }
  formData.append('title', title.value)
  formData.append('description', description.value)
  formData.append('category_id', category_id.value || '')
  if (picture.value) {
    formData.append('img', picture.value)
  }
  formData.append('release_date', release_date.value.toString())
  formData.append('author', author.value)
  formData.append('stock', stock.value)
  formData.append('total_page', total_page.value)
  formData.append('status', status.value)

  await $fetch(`${config.public.API_URL}books`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.value}`,
      "Accept": "application/json",
    },
    body: formData,
    onResponse({ response }) {
      if (response._data.success) {
        toast.success('Book saved successfully')
        useRouter().push('/admin/library/book')
      } else {
        toast.error(response._data.message || 'Failed to save book')
      }
    },
  })

}

const slug = useRoute().params.slug
// const client = useSanctumClient();
import { parseDate } from '@internationalized/date'
onMounted(async () => {
  if (slug && !isNaN(Number(slug))) {
    const data: any = await adminStore.fetchBookDetails(Number(slug))

    if (data.success) {
      id.value = data.data.id
      title.value = data.data.title
      description.value = data.data.description
      category_id.value = data.data.category_id
      status.value = data.data.status
      release_date.value = data.data.release_date ? parseDate(data.data.release_date) : undefined
      author.value = data.data.author
      stock.value = data.data.stock
      total_page.value = data.data.total_page

      if (data.data.img) {
        img.value = data.data.img
      }
    } else {
      useRouter().push('/admin/library/book')
      toast.error('Book not found')
    }
  }
})

// onMounted(async () => {
//   if (slug && !isNaN(Number(slug))) {
//     client(`project/id/${slug}`, {
//       onResponse({ response }) {
//         // Map Data
//         const data = response._data.data
//         if (!data) {
//           useRouter().push('/admin/project')
//           toast({
//             title: 'Error',
//             description: 'Project not found',
//             variant: 'destructive'
//           })
//         }
//         id.value = data.id
//         location.value = data.location
//         owner.value = data.owner
//         layer.value = data.layer
//         status.value = data.status
//         date.value = data.date
//         category_id.value = data.project_category_id
//         const translations = data.translations;
//         const enTranslation = translations.find((t: any) => t.locale === 'en');
//         const idTranslation = translations.find((t: any) => t.locale === 'id');

//         if (enTranslation) {
//           title.value = enTranslation.title;
//           description.value = enTranslation.description;
//         }

//         if (idTranslation) {
//           titleId.value = idTranslation.title;
//           contentId.value = idTranslation.description;
//         }

//       },
//     })
//   }
// })

const adminStore = useAdminStore()
await adminStore.fetchBooksCategory()
// await adminStore.fetchGroupProjectData()
</script>
