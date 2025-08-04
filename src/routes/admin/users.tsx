import type { User } from 'better-auth'
import { formatDate } from 'date-fns'
import { EllipsisVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { getListUsers } from '@/server/admin'
import { createFileRoute } from '@tanstack/react-router'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table'

type UserWithRole = User & { role?: string | undefined }

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
    cell: () => {
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
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Make a copy</DropdownMenuItem>
            <DropdownMenuItem>Favorite</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
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
