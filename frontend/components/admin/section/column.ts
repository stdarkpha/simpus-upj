import type { ColumnDef } from '@tanstack/vue-table'
//@ts-ignore
import Dropdown from '../base/dropdown.vue'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'
import { Badge } from '@/components/ui/badge'

export interface Project {
    id: number;
    image: string;
    slug: string;
    page: string;
    translations: { locale: string; title: string }[];
}

import { toast } from '~/components/ui/toast/use-toast'

export const useColumns = (locale: string): ColumnDef<Project>[] => [
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
        cell: ({ row }) => h('img', { src: row.original.image ?? 'https://placehold.co/240x140?text=No+Image', class: 'shrink-0 w-56 rounded h-auto' })
    },
    {
        id: 'title',
        accessorFn: row => {
            const translation = row.translations.find(lang => lang.locale === locale);
            return translation ? translation.title : '';
        },
        sortingFn: (rowA, rowB, columnId) => {
            const a = (rowA.getValue(columnId) as string)?.toLowerCase() || '';
            const b = (rowB.getValue(columnId) as string)?.toLowerCase() || '';
            return a.localeCompare(b);
        },
        header: ({ column }) => h(Button, {
            variant: 'ghost',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => ['Title', h(Icon, { icon: 'lucide:arrow-down-up', class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => h('div', { class: 'max-w-md line-clamp-1' },
            row.original.translations
                .filter(lang => lang.locale === locale)
                .map(lang => lang.title)
        ),
    },
    {
        id: 'page',
        accessorFn: row => row.page,
        sortingFn: (rowA, rowB, columnId) => {
            const a = String(rowA.getValue(columnId) || '').toLowerCase();
            const b = String(rowB.getValue(columnId) || '').toLowerCase();
            return a.localeCompare(b);
        },
        header: ({ column }) => h(Button, {
            variant: 'ghost',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => ['Group', h(Icon, { icon: 'lucide:arrow-down-up', class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => h(Badge, { variant: 'secondary', class: 'uppercase' }, () => row.original.page),
    },
    {
        id: 'url',
        accessorFn: row => row.slug,
        header: 'Url',
        cell: ({ row }) => h('div', {
            class:
                `text-muted-foreground max-w-sm relative cursor-pointer flex items-center hover:text-primary after:content-["Copy?"] after:bg-primary dark:after:bg-secondary after:text-white after:mr-2 after:px-2 after:py-1 after:mx-2 after:rounded-md after:text-xs after:opacity-0 hover:after:opacity-100 after:transition-all`,
            onClick: () => {
                navigator.clipboard.writeText(row.original.slug ?? '')
                toast({
                    title: 'Url Copied',
                    description: row.original.slug ?? '',
                })
            }
        },
            row.original.slug ?
                h('p', {
                    class: 'truncate',

                }, row.original.slug) :
                h('p', { class: 'truncate' }, row.original.slug)
        ),
    },
];
