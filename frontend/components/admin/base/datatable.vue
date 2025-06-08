<script setup lang="ts">
import { ref } from 'vue';
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table'
import { useVueTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/vue-table';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FlexRender } from '@tanstack/vue-table';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const props = defineProps<{
  data: any[],
  columns: ColumnDef<any>[]
}>();
const data = ref(props.data);
const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})

import { valueUpdater } from '~/lib/utils'

const table = useVueTable({
  data,
  columns: props.columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),
  onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
  state: {
    get sorting() { return sorting.value },
    get columnVisibility() { return columnVisibility.value; },
    get columnFilters() { return columnFilters.value; },
  }
});

watch(() => props.data, (newData) => {
  data.value = newData;
}, { deep: true });

import { Icon } from "@iconify/vue";
</script>

<template>
  <div v-if="data.length > 0" class="w-full animate__animated animate__fadeIn">
    <div class="flex gap-2 items-center py-4">
      <Input class="max-w-52" placeholder="Search..." :model-value="table.getState().globalFilter"
        @update:model-value="(value) => table.setGlobalFilter(value)" />

      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="outline" class="ml-auto">
            Columns
            <Icon icon="lucide:chevron-down" class="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuCheckboxItem v-for="column in table.getAllColumns().filter(c => c.getCanHide())" :key="column.id"
            class="capitalize" :model-value="column.getIsVisible()"
            @update:model-value="(value) => column.toggleVisibility(!!value)">
            {{ column.id }}
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <div class="rounded-md border animate__animated animate__fadeIn">
      <Table>
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="row in table.getRowModel().rows" :key="row.id">
            <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
              <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <div class="flex items-center justify-end space-x-2 py-4">
      <Button variant="outline" size="sm" :disabled="!table.getCanPreviousPage()"
        @click="table.previousPage()">Previous</Button>
      <Button variant="outline" size="sm" :disabled="!table.getCanNextPage()" @click="table.nextPage()">Next</Button>
    </div>
  </div>
  <div
    class="flex gap-2 flex-col items-center justify-center py-16 p-8 border rounded-md animate__animated animate__fadeIn"
    v-else>
    <Icon class="text-7xl animate__animated animate__headShake" icon="ph:empty-bold" />
    <h2 class="text-xl font-semibold">No Items</h2>
    <p class="text-muted-foreground">
      There are no items to display
    </p>
  </div>
</template>