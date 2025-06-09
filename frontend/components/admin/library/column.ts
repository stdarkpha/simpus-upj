import type { ColumnDef } from '@tanstack/vue-table'
//@ts-ignore
import Dropdown from '../base/dropdown.vue'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@iconify/vue'

export interface Data {
    id: number;
    name: string;
    slug: string;
    created_at: string;
    updated_at: string;
}

const endpoint = useRuntimeConfig().public.API_URL

export const columns: ColumnDef<Data>[] = [
    {
        id: 'select',
        header: ({ table }) => h(Checkbox, {
            'modelValue': table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate'),
            'onUpdate:modelValue': (value: any) => table.toggleAllPageRowsSelected(!!value),
            'ariaLabel': 'Select all',
        }),
        cell: ({ row }) => h(Checkbox, {
            'modelValue': row.getIsSelected(),
            'onUpdate:modelValue': (value: any) => row.toggleSelected(!!value),
            'ariaLabel': 'Select row',
        }),
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: 'name',
        accessorFn: row => row.name,
        header: ({ column }) => h(Button, {
            variant: 'ghost',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => ['Name', h(Icon, { icon: 'lucide:arrow-down-up', class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => h('div', { class: 'px-4' }, row.original.name),
        sortingFn: (rowA, rowB, columnId) => {
            const a = (rowA.getValue(columnId) as string)?.toLowerCase() || '';
            const b = (rowB.getValue(columnId) as string)?.toLowerCase() || '';
            return a.localeCompare(b);
        },
    },
    {
        id: 'slug',
        accessorFn: row => row.slug,
        header: ({ column }) => h(Button, {
            variant: 'ghost',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => ['Slug', h(Icon, { icon: 'lucide:arrow-down-up', class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => h('div', { class: 'px-4' }, row.original.slug),
        sortingFn: (rowA, rowB, columnId) => {
            const a = (rowA.getValue(columnId) as string)?.toLowerCase() || '';
            const b = (rowB.getValue(columnId) as string)?.toLowerCase() || '';
            return a.localeCompare(b);
        },
    },
    {
        id: 'created_at',
        accessorFn: row => row.created_at,
        header: ({ column }) => h(Button, {
            variant: 'ghost',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => ['Created At', h(Icon, { icon: 'lucide:arrow-down-up', class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => {
            const date = new Date(row.original.created_at);
            return h('div', { class: 'px-4' }, date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            }));
        },
        sortingFn: (rowA, rowB, columnId) => {
            const a = new Date(rowA.getValue(columnId) as string).getTime();
            const b = new Date(rowB.getValue(columnId) as string).getTime();
            return a - b;
        },
    },
    {
        id: 'updated_at',
        accessorFn: row => row.updated_at,
        header: ({ column }) => h(Button, {
            variant: 'ghost',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => ['Updated At', h(Icon, { icon: 'lucide:arrow-down-up', class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => {
            const date = new Date(row.original.updated_at);
            return h('div', { class: 'px-4' }, date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            }));
        },
        sortingFn: (rowA, rowB, columnId) => {
            const a = new Date(rowA.getValue(columnId) as string).getTime();
            const b = new Date(rowB.getValue(columnId) as string).getTime();
            return a - b;
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => h(Dropdown, {
            edit: '?id=' + row.original.id,
            delete: endpoint + 'categories/' + row.original.id,
            fetch: async () => {
                await useAdminStore().fetchBooksCategory()
            }
        }),
    },
]
