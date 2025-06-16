import type { ColumnDef } from '@tanstack/vue-table'
//@ts-ignore
import Dropdown from '../base/action.vue'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@iconify/vue'

export interface Data {
    id_lending: number;
    id_request: string;
    transaction_id: string;
    user_details: {
        name: string;
        email: string;
        uid: string;
        role: string;
    };
    lend_date: string;
    return_date: string;
    time: string;
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
        id: 'ref',
        accessorFn: row => row.transaction_id,
        header: ({ column }) => h(Button, {
            variant: 'ghost',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => [
            'Reference ID',
            h(Icon, { icon: 'lucide:arrow-down-up', class: 'ml-2 h-4 w-4' })
        ]),
        cell: ({ row }) => h('div', { class: 'px-4 capitalize' }, row.original.transaction_id),
        sortingFn: (rowA, rowB, columnId) => {
            const a = (rowA.getValue(columnId) as string)?.toLowerCase() || '';
            const b = (rowB.getValue(columnId) as string)?.toLowerCase() || '';
            return a.localeCompare(b);
        },
    },
    {
        id: 'name',
        accessorFn: row => row.user_details.name,
        header: ({ column }) => h(Button, {
            variant: 'ghost',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => ['Name', h(Icon, { icon: 'lucide:arrow-down-up', class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => h('div', { class: 'px-4' }, row.original.user_details.name),
        sortingFn: (rowA, rowB, columnId) => {
            const a = (rowA.getValue(columnId) as string)?.toLowerCase() || '';
            const b = (rowB.getValue(columnId) as string)?.toLowerCase() || '';
            return a.localeCompare(b);
        },
    },
    {
        id: 'time',
        accessorFn: row => row.time,
        header: ({ column }) => h(Button, {
            variant: 'ghost',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => ['Request Time', h(Icon, { icon: 'lucide:arrow-down-up', class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => {
            const date = row.original.time;
            return h('div', { class: 'px-4' }, date)
        },
        sortingFn: (rowA, rowB, columnId) => {
            const a = new Date(rowA.getValue(columnId) as string).getTime();
            const b = new Date(rowB.getValue(columnId) as string).getTime();
            return a - b;
        },
    },
    {
        id: 'lend_date',
        accessorFn: row => row.lend_date,
        header: ({ column }) => h(Button, {
            variant: 'ghost',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => ['Peminjaman', h(Icon, { icon: 'lucide:arrow-down-up', class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => {
            const date = new Date(row.original.lend_date);
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
        id: 'return_date',
        accessorFn: row => row.return_date,
        header: ({ column }) => h(Button, {
            variant: 'ghost',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => ['Pengembalian', h(Icon, { icon: 'lucide:arrow-down-up', class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => {
            const date = new Date(row.original.return_date);
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
            id: row.original.id_lending,
            id_request: row.original.id_request,
            detail: '?id=' + row.original.id_lending + '&request=' + row.original.id_request,
            fetch: async () => {
                await useAdminStore().fetchBooksCategory()
            }
        }),
    },
]
