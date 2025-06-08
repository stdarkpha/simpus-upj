import type { ColumnDef } from '@tanstack/vue-table'
//@ts-ignore
import Dropdown from '../base/dropdown.vue'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'

export interface Data {
    id: number;
    image: string;
    created_at: string;
    translations: {
        locale: string;
        title: string;
    }[];
}

export const columns = (locale: string): ColumnDef<Data>[] => [
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
        accessorFn: row => row.image,
        header: 'Thumbnail',
        cell: ({ row }) => h('img', { src: row.original.image ?? 'https://placehold.co/240x140', alt: 'Product Image', class: 'class="shrink-0 w-56 h-auto"' })
    },
    {
        id: 'title',
        accessorFn: row => row.translations.find(t => t.locale === 'en')?.title || '',
        header: ({ column }) => h(Button, {
            variant: 'ghost',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => ['Title', h(Icon, { icon: 'lucide:arrow-down-up', class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => row.original.translations.find(t => t.locale === 'en')?.title || '',
        sortingFn: (rowA, rowB, columnId) => {
            const a = (rowA.getValue(columnId) as string)?.toLowerCase() || '';
            const b = (rowB.getValue(columnId) as string)?.toLowerCase() || '';
            return a.localeCompare(b);
        },
    },
    {
        id: 'desc',
        header: 'Description',
        cell: () => h('div', { class: 'text-muted-foreground' }, 'Edit to see description'),
    },
    {
        id: 'created_at',
        accessorFn: row => row.created_at,
        sortingFn: (rowA, rowB, columnId) => {
            const a = (rowA.getValue(columnId) as string)?.toLowerCase() || '';
            const b = (rowB.getValue(columnId) as string)?.toLowerCase() || '';
            return a.localeCompare(b);
        },
        header: ({ column }) => h(Button, {
            variant: 'ghost',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => ['Date', h(Icon, { icon: 'lucide:arrow-down-up', class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => {
            const date = new Date(row.original.created_at);
            return date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            });
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => h(Dropdown, {
            edit: '?id=' + row.original.id,
            delete: '/product/' + row.original.id,
            fetch: async () => {
                await useAdminStore().fetchProductData()
            }
        }),
    },
]
