import type { ColumnDef } from '@tanstack/vue-table'
//@ts-ignore
import Dropdown from '../base/dropdown.vue'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'

export interface Group {
    id: number;
    name_en: string;
    name_id: string;
    image: string | null;
    created_at: string;
}

export const columns: ColumnDef<Group>[] = [
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
        cell: ({ row }) => h('img', { src: row.original.image ?? 'https://placehold.co/240x140', class: 'shrink-0 w-56 rounded h-auto' })
    },
    {
        id: 'name_en',
        accessorKey: 'name_en',
        sortingFn: (rowA, rowB, columnId) => {
            const a = (rowA.getValue(columnId) as string)?.toLowerCase() || '';
            const b = (rowB.getValue(columnId) as string)?.toLowerCase() || '';
            return a.localeCompare(b);
        },
        header: ({ column }) => h(Button, {
            variant: 'ghost',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => ['Name EN', h(Icon, { icon: 'lucide:arrow-down-up', class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => row.original.name_en,
    },
    {
        id: 'name_id',
        accessorFn: row => row.name_id,
        sortingFn: (rowA, rowB, columnId) => {
            const a = (rowA.getValue(columnId) as string)?.toLowerCase() || '';
            const b = (rowB.getValue(columnId) as string)?.toLowerCase() || '';
            return a.localeCompare(b);
        },
        header: ({ column }) => h(Button, {
            variant: 'ghost',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => ['Name ID', h(Icon, { icon: 'lucide:arrow-down-up', class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => row.original.name_id
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
            edit: useRoute().path + '/group/' + row.original.id,
            delete: '/project/group/' + row.original.id,
            fetch: async () => {
                useAdminStore().fetchGroupProjectData()
            }
        }),
    },
]