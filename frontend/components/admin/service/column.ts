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
    translations: {
        locale: string;
        title: string;
        sub: string;
    }[];
    group: { name_en: string };
}


// ✅ Wrap columns inside a function to accept `locale`
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
        cell: ({ row }) => h('img', { src: row.original.image ?? 'https://placehold.co/240x140', class: 'shrink-0 w-56 rounded h-auto' })
    },
    {
        id: 'title',
        accessorFn: row => {
            const translation = row.translations.find(lang => lang.locale === locale);
            return translation ? (translation.title ? translation.title : translation.sub) : '';
        },
        sortingFn: (rowA, rowB, columnId) => {
            const a = (rowA.getValue(columnId) as string)?.toLowerCase() || '';
            const b = (rowB.getValue(columnId) as string)?.toLowerCase() || '';
            return a.localeCompare(b);
        },
        header: ({ column }) => h(Button, {
            variant: 'ghost',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => ['Title / Subtitle', h(Icon, { icon: 'lucide:arrow-down-up', class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => h('div', { class: 'max-w-md' },
            row.original.translations
                .filter(lang => lang.locale === locale)
                .map(lang => (lang.title ? lang.title : lang.sub))
        ),
    },
    {
        id: 'group',
        accessorFn: row => row.group.name_en,
        sortingFn: (rowA, rowB, columnId) => {
            const a = String(rowA.getValue(columnId) || '').toLowerCase();
            const b = String(rowB.getValue(columnId) || '').toLowerCase();
            return a.localeCompare(b);
        },
        header: ({ column }) => h(Button, {
            variant: 'ghost',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => ['Group', h(Icon, { icon: 'lucide:arrow-down-up', class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => h(Badge, { variant: 'secondary', class: 'uppercase' }, () => row.original.group.name_en),
    },
    {
        id: 'desc',
        header: 'Desc',
        cell: () => h('div', { class: 'text-muted-foreground' }, 'Edit to see description'),
    },
    {
        id: 'action',
        header: 'Action',
        cell: ({ row }) => h(Dropdown, {
            edit: useRoute().fullPath + '/' + row.original.id,
            delete: '/service/' + row.original.id,
            fetch: async () => {
                useAdminStore().fetchServiceData()
            }
        }),
    }
];
