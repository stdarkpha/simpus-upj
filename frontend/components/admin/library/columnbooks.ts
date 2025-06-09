import type { ColumnDef } from '@tanstack/vue-table'
//@ts-ignore
import Dropdown from '../base/dropdown.vue'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@iconify/vue'

export interface Data {
    id: number;
    img: string;
    title: string;
    author: string;
    stock: number;
    category: {
        name: string;
    };
    release_date: string;
    status: string;
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
        id: 'image',
        header: 'Image',
        cell: ({ row }) => h('img', { src: row.original.img ?? 'https://placehold.co/240x140', class: 'shrink-0 w-56 rounded h-auto' })
    },
    {
        id: 'title',
        accessorFn: row => row.title,
        header: ({ column }) => h(Button, {
            variant: 'ghost',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => ['Title', h(Icon, { icon: 'lucide:arrow-down-up', class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => h('div', { class: 'px-4' }, row.original.title),
        sortingFn: (rowA, rowB, columnId) => {
            const a = (rowA.getValue(columnId) as string)?.toLowerCase() || '';
            const b = (rowB.getValue(columnId) as string)?.toLowerCase() || '';
            return a.localeCompare(b);
        },
    },
    {
        id: 'author',
        accessorFn: row => row.author,
        header: ({ column }) => h(Button, {
            variant: 'ghost',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => ['Author', h(Icon, { icon: 'lucide:arrow-down-up', class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => h('div', { class: 'px-4' }, row.original.author),
        sortingFn: (rowA, rowB, columnId) => {
            const a = (rowA.getValue(columnId) as string)?.toLowerCase() || '';
            const b = (rowB.getValue(columnId) as string)?.toLowerCase() || '';
            return a.localeCompare(b);
        },
    },
    {
        id: 'category',
        accessorFn: row => row.category.name,
        header: ({ column }) => h(Button, {
            variant: 'ghost',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => ['Category', h(Icon, { icon: 'lucide:arrow-down-up', class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => h(Badge, { variant: 'secondary' }, () => row.original.category.name),
        sortingFn: (rowA, rowB, columnId) => {
            const a = (rowA.getValue(columnId) as string)?.toLowerCase() || '';
            const b = (rowB.getValue(columnId) as string)?.toLowerCase() || '';
            return a.localeCompare(b);
        },
    },

    {
        id: 'Date',
        accessorFn: row => row.release_date,
        sortingFn: (rowA, rowB, columnId) => {
            const a = (rowA.getValue(columnId) as string)?.toLowerCase() || '';
            const b = (rowB.getValue(columnId) as string)?.toLowerCase() || '';
            return a.localeCompare(b);
        },
        header: ({ column }) => h(Button, {
            variant: 'ghost',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => ['Release Date', h(Icon, { icon: 'lucide:arrow-down-up', class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => {
            const date = new Date(row.original.release_date);
            return h('div', { class: 'px-4' }, date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            }));
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => h(Dropdown, {
            edit: '/admin/library/book/' + row.original.id,
            delete: endpoint + 'books/' + row.original.id,
            fetch: async () => {
                await useAdminStore().fetchBooks(20)
            }
        }),
    },
]
