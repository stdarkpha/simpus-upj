<script lang="ts" setup>
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatDistanceToNow } from 'date-fns'

interface Mail {
  id: string
  name: string
  email: string
  subject?: string
  text: string
  read: boolean
  date: string,
  labels?: string[]
}

interface MailListProps {
  items: Mail[]
}

defineProps<MailListProps>()
const selectedMail = defineModel<number>('selectedMail', { required: false })
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";


const openMail = (id: number, status: boolean) => {
  selectedMail.value = id

  if (!status) {
    // Mark mail as read
    useSanctumFetch(`contact/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      method: "POST",
      onResponse({ response }) {
        if (response.status === 200) {
          toast("Reading Email", {
            type: "success",
            theme: "dark",
            autoClose: 500,
            transition: "slide",
            hideProgressBar: true,
          });

          useAdminStore().data_contact.map((item: any) => {
            if (item.id === id) {
              item.status = "read"
            }
          })
        }
      },
    })
  }
}
</script>

<template>
  <ScrollArea class="flex">
    <div class="flex-1 flex flex-col gap-2 p-4 pt-0">
      <TransitionGroup name="list" appear>
        <button v-for="item of items" :key="item.id" :class="cn(
          'flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent',
          selectedMail === Number(item.id) && 'bg-muted',
        )" @click="openMail(Number(item.id), item.read)">
          <div class="flex w-full flex-col gap-1">
            <div class="flex items-center">
              <div class="flex items-center gap-2">
                <div class="font-semibold">
                  {{ item.name }}
                </div>
                <span v-if="!item.read" class="flex h-2 w-2 rounded-full bg-blue-600" />
              </div>
              <div :class="cn(
                'ml-auto text-xs',
                selectedMail == Number(item.id)
                  ? 'text-foreground'
                  : 'text-muted-foreground',
              )">
                {{ formatDistanceToNow(new Date(item.date), { addSuffix: true }) }}
              </div>
            </div>

            <div class="text-xs font-medium">
              {{ item.email }}
            </div>
          </div>
          <div class="line-clamp-2 text-xs text-muted-foreground">
            {{ item.text.substring(0, 300) }}
          </div>
          <div class="flex items-center gap-2">
            <template v-for="label of item.labels">
              <Badge v-if="label">
                {{ label }}
              </Badge>
            </template>
          </div>
        </button>
      </TransitionGroup>
    </div>
  </ScrollArea>
</template>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(15px);
}

.list-leave-active {
  position: absolute;
}
</style>
