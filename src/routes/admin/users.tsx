import type { User } from 'better-auth'
import { formatDate } from 'date-fns'
import { EllipsisVertical } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { authClient } from '@/lib/auth-client'
import { getListUsers } from '@/server/admin'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table'

type UserWithRole = User & {
  role?: string
  banned?: boolean | null
  banReason?: string | null
  banExpires?: Date | null
}

const DropdownMenuUser = ({ user }: { user: UserWithRole }) => {
  const router = useRouter()

  const banUserMutation = useMutation({
    mutationFn: async () => {
      await authClient.admin.banUser({
        userId: user.id,
        banReason: 'Spamming',
        banExpiresIn: 60 * 60 * 24 * 7
      })
    },
    onSuccess: () => {
      router.invalidate()
    }
  })

  const unbanUserMutation = useMutation({
    mutationFn: async () => {
      await authClient.admin.unbanUser({
        userId: user.id
      })
    },
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      router.invalidate()
    }
  })

  const deleteUserMutation = useMutation({
    mutationFn: async () => {
      await authClient.admin.removeUser({
        userId: user.id
      })
    },
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      router.invalidate()
    }
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted text-muted-foreground flex size-8 float-right"
          size="icon"
        >
          <EllipsisVertical />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        {user.role !== 'admin' ? (
          <>
            {user.banned ? (
              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  unbanUserMutation.mutate()
                }}
              >
                Débannir
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  banUserMutation.mutate()
                }}
              >
                Bannir
              </DropdownMenuItem>
            )}
          </>
        ) : null}
        <DropdownMenuItem
          variant="destructive"
          onClick={() => {
            deleteUserMutation.mutate()
          }}
        >
          Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const columnHelper = createColumnHelper<UserWithRole>()

const columns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (info) => {
      return info.getValue()
    }
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => {
      return info.getValue()
    }
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    cell: (info) => {
      return info.getValue()
    }
  }),
  columnHelper.accessor('role', {
    header: 'Role',
    cell: (info) => {
      return info.getValue()
    }
  }),
  columnHelper.accessor('createdAt', {
    header: `Date de création`,
    cell: (info) => {
      return formatDate(info.getValue(), 'dd/MM/yyyy')
    }
  }),
  columnHelper.display({
    id: 'Actions',
    cell: (cell) => {
      const user = cell.row.original

      return <DropdownMenuUser user={user} />
    }
  })
]

const RouteComponent = () => {
  const data = Route.useLoaderData()

  const table = useReactTable({
    data: data.listUsers.users,
    columns,
    getRowId: (row) => {
      return row.id.toString()
    },
    getCoreRowModel: getCoreRowModel()
  })

  return (
    <div className="w-full overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => {
            return (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            )
          })}
        </TableHeader>
        <TableBody className="**:data-[slot=table-cell]:first:w-8">
          {table.getRowModel().rows?.length ? (
            <>
              {table.getRowModel().rows.map((row) => {
                return (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })}
            </>
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export const Route = createFileRoute('/admin/users')({
  component: RouteComponent,
  loader: async () => {
    const listUsers = await getListUsers()

    return {
      crumb: 'Utilisateurs',
      listUsers
    }
  }
})
