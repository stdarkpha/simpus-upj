<script lang="ts" setup>
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Separator } from '@/components/ui/separator'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { TooltipProvider } from '@/components/ui/tooltip'
import { refDebounced } from '@vueuse/core'
import {
  Search,
} from 'lucide-vue-next'
import { computed, ref } from 'vue'

interface Mail {
  id: string
  name: string
  email: string
  subject?: string
  text: string
  read: boolean,
  date: string,
}
import MailDisplay from './MailDisplay.vue'
import MailList from './MailList.vue'
import Nav, { type LinkProp } from './Nav.vue'

interface MailProps {
  mails: Mail[]
  defaultLayout?: number[]
  defaultCollapsed?: boolean
  navCollapsedSize: number
}

const props = withDefaults(defineProps<MailProps>(), {
  defaultCollapsed: false,
  defaultLayout: () => [265, 440, 655],
})

const isCollapsed = ref(props.defaultCollapsed)
const selectedMail = ref<number | undefined>(undefined)
const searchValue = ref('')
const debouncedSearch = refDebounced(searchValue, 250)

const filteredMailList = computed(() => {
  let output: Mail[] = []
  const searchValue = debouncedSearch.value?.trim()
  if (!searchValue) {
    output = props.mails
  }

  else {
    output = props.mails.filter((item) => {
      return item.name.includes(debouncedSearch.value)
        || item.email.includes(debouncedSearch.value)
        || item.name.includes(debouncedSearch.value)
        || item.subject?.includes(debouncedSearch.value)
        || item.text.includes(debouncedSearch.value)
    })
  }

  return output
})

const unreadMailList = computed(() => filteredMailList.value.filter(item => !item.read))

const selectedMailData = computed(() => props.mails.find(item => Number(item.id) == selectedMail.value))

const links: LinkProp[] = [
  {
    title: 'Inbox',
    label: props.mails.length.toString(),
    icon: 'lucide:inbox',
    variant: 'default',
  },
]

function onCollapse() {
  isCollapsed.value = true
}

function onExpand() {
  isCollapsed.value = false
}

import { Icon } from '@iconify/vue'
</script>

<template>
  <TooltipProvider :delay-duration="0">
    <ResizablePanelGroup id="resize-panel-group-1" direction="horizontal" class="h-full relative items-stretch">
      <ResizablePanel id="resize-panel-1" :default-size="defaultLayout[0]" :collapsed-size="navCollapsedSize"
        collapsible :min-size="15" :max-size="20" class="max-lg:hidden"
        :class="cn(isCollapsed && 'min-w-[50px] transition-all duration-300 ease-in-out')" @expand="onExpand"
        @collapse="onCollapse">
        <div class="px-4 py-3 flex items-center" :class="cn(isCollapsed && 'justify-center')">
          <!-- <AccountSwitcher :is-collapsed="isCollapsed" :accounts="accounts" /> -->
          <h1 v-if="!isCollapsed" class="text-lg font-bold">
            Contact Us Mail
          </h1>
          <Icon class="text-2xl text-blue-300" v-else icon="lucide:contact" />
        </div>
        <Separator />
        <Nav :is-collapsed="isCollapsed" :links="links" />
        <Separator />
      </ResizablePanel>
      <ResizableHandle class="max-lg:hidden" id="resize-handle-1" with-handle />
      <ResizablePanel id="resize-panel-2" :default-size="defaultLayout[1]" :min-size="30">
        <Tabs class="h-full flex flex-col overflow-auto scrollbar-thin" default-value="all">
          <div class="sticky top-0 z-10 bg-background">
            <div class="flex items-center px-4 py-2">
              <h1 class="text-xl font-bold">
                Inbox
              </h1>
              <TabsList class="ml-auto">
                <TabsTrigger value="all" class="text-zinc-600 dark:text-zinc-200">
                  All Inbox
                </TabsTrigger>
                <TabsTrigger value="unread" class="text-zinc-600 dark:text-zinc-200">
                  Unread
                </TabsTrigger>
              </TabsList>
            </div>
            <Separator />
            <div class="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form>
                <div class="relative">
                  <Search class="absolute left-2 top-2.5 size-4 text-muted-foreground" />
                  <Input v-model="searchValue" placeholder="Search" class="pl-8" />
                </div>
              </form>
            </div>
          </div>
          <TabsContent value="all" class="m-0 h-full">
            <MailList v-model:selected-mail="selectedMail" :items="filteredMailList" />
          </TabsContent>
          <TabsContent value="unread" class="m-0 h-full">
            <MailList v-model:selected-mail="selectedMail" :items="unreadMailList" />
          </TabsContent>
        </Tabs>
      </ResizablePanel>
      <ResizableHandle class="max-md:hidden" id="resiz-handle-2" with-handle />
      <ResizablePanel class="max-md:absolute z-50 top-0 left-0 w-full h-full bg-background"
        :class="selectedMailData ? 'block' : 'max-md:hidden'" id="resize-panel-3" :default-size="defaultLayout[2]">
        <MailDisplay @refresh="() => selectedMail = undefined" :mail="selectedMailData" />
      </ResizablePanel>
    </ResizablePanelGroup>
  </TooltipProvider>
</template>
