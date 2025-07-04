import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-vue-next'

export interface LendingHistory {
    id: number
    transaction_id: string
    status: string
    lend_date: string
    return_date: string
    user: {
        id: number
        name: string
        email: string
        uid: string
        role: string
    }
    items: Array<{
        book: {
            id: number
            title: string
            author: string
            img: string
        }
    }>
    created_at: string
}

const getStatusVariant = (status: string) => {
    switch (status) {
        case 'pending':
            return 'secondary'
        case 'claim':
            return 'default'
        case 'returned':
            return 'outline'
        case 'returned_late':
            return 'destructive'
        case 'overdue':
            return 'destructive'
        case 'reject':
            return 'destructive'
        default:
            return 'secondary'
    }
}

const getStatusText = (status: string) => {
    switch (status) {
        case 'pending':
            return 'Menunggu'
        case 'claim':
            return 'Dipinjam'
        case 'returned':
            return 'Dikembalikan'
        case 'returned_late':
            return 'Terlambat'
        case 'overdue':
            return 'Jatuh Tempo'
        case 'reject':
            return 'Ditolak'
        default:
            return status
    }
}

export const columns: ColumnDef<LendingHistory>[] = [
    {
        accessorKey: 'transaction_id',
        header: 'Transaction ID',
        cell: ({ row }) => {
            return h('div', { class: 'font-medium' }, row.getValue('transaction_id'))
        },
    },
    {
        accessorKey: 'user',
        header: 'Peminjam',
        cell: ({ row }) => {
            const user = row.getValue('user') as LendingHistory['user']
            return h('div', [
                h('div', { class: 'font-medium' }, user.name),
            ])
        },
    },
    {
        accessorKey: 'items',
        header: 'Total Buku',
        cell: ({ row }) => {
            const items = row.getValue('items') as LendingHistory['items']
            return h('div', [
                h('div', { class: 'font-medium' }, `${items.length} buku`),
            ])
        },
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status') as string
            return h(Badge, {
                variant: getStatusVariant(status),
                class: 'capitalize'
            }, () => getStatusText(status))
        },
    },
    {
        accessorKey: 'lend_date',
        header: 'Tanggal Pinjam',
        cell: ({ row }) => {
            const date = new Date(row.getValue('lend_date'))
            return h('div', { class: 'text-sm' },
                date.toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                })
            )
        },
    },
    {
        accessorKey: 'return_date',
        header: 'Tanggal Kembali',
        cell: ({ row }) => {
            const date = new Date(row.getValue('return_date'))
            return h('div', { class: 'text-sm' },
                date.toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                })
            )
        },
    },
    {
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => {
            const lending = row.original
            return h('div', { class: 'flex items-center gap-2' }, [
                h(Button, {
                    variant: 'outline',
                    size: 'sm',
                    onClick: () => {
                        navigateTo(`/admin/library/lending?id=${lending.id}`)
                    }
                }, () => [
                    h(Eye, { class: 'w-4 h-4 mr-2' }),
                    'Detail'
                ])
            ])
        },
    },
]
