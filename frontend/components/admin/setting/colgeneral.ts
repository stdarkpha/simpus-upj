import type { ColumnDef } from '@tanstack/vue-table'
//@ts-ignore
import Dropdown from '../base/dropdown.vue'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@iconify/vue'
import { toast } from '~/components/ui/toast/use-toast'

export interface Data {
    id: number;
    name: string;
    value: string;
    file?: string | null;
    created_at: string;
}

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
        }, () => ['Key / Name', h(Icon, { icon: 'lucide:arrow-down-up', class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => row.original.name,
        sortingFn: (rowA, rowB, columnId) => {
            const a = (rowA.getValue(columnId) as string)?.toLowerCase() || '';
            const b = (rowB.getValue(columnId) as string)?.toLowerCase() || '';
            return a.localeCompare(b);
        },
    },
    {
        id: 'type',
        accessorFn: row => row.file ? 'file' : 'text',
        header: 'Type',
        cell: ({ row }) => h(Badge, { variant: row.original.file ? 'default' : 'secondary' }, () => row.original.file ? 'File' : 'Text'),
    },
    {
        id: 'desc',
        accessorFn: row => row.value,
        header: 'Detail / File Url',
        cell: ({ row }) => h('div', {
            class:
                `text-muted-foreground max-w-sm relative ${row.original.file ?
                    'cursor-pointer flex items-center hover:text-primary before:content-["Copy?"] before:bg-secondary before:text-white before:mr-2 before:px-2 before:py-1 before:rounded-md before:text-xs before:hidden hover:before:flex before:animate__animated hover:before:animate__fadeIn'
                    : ''}`,
        },
            row.original.file ?
                h('p', {
                    class: 'truncate',
                    onClick: () => {
                        navigator.clipboard.writeText(row.original.file ?? '')
                        toast({
                            title: 'Url Copied',
                            description: row.original.file ?? '',
                        })

                    }
                }, row.original.file) :
                h('p', { class: 'truncate' }, row.original.value)
        ),
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
            delete: '/setting/' + row.original.id,
            fetch: async () => {
                await useAdminStore().fetchSettingData()
            }
        }),
    },
]