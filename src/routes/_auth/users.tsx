import { format } from 'date-fns'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { getUsers } from '@/server/user'
import { createFileRoute } from '@tanstack/react-router'

const RouteComponent = () => {
  const data = Route.useLoaderData()

  return (
    <div className="w-full">
      <Table>
        <TableCaption>Liste des utilisateurs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">#</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Favoris</TableHead>
            <TableHead className="text-right">Date d&apos;ajout</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.users.map((user) => {
            return (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.bookmarks.length}</TableCell>
                <TableCell className="text-right">
                  {format(user.createdAt, 'dd/MM/yyyy')}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export const Route = createFileRoute('/_auth/users')({
  component: RouteComponent,
  loader: async () => {
    const users = await getUsers()

    return {
      crumb: 'Utilisateurs',
      users
    }
  }
})
