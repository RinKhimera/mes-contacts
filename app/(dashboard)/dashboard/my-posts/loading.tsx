import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const Loading = () => {
  return (
    <div className="p-4 pt-0">
      <Skeleton className="mb-4 h-10 w-48" />

      <div className="@container my-4">
        <Table className="table-fixed">
          <TableCaption>Chargement de vos annonces...</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden @md:table-cell @md:w-1/5 @lg:w-1/5">
                Catégorie
              </TableHead>
              <TableHead className="w-2/5 @md:w-1/4 @lg:w-1/4">
                Nom de l&apos;annonce
              </TableHead>
              <TableHead className="hidden w-1/6 @lg:table-cell">
                Date de création
              </TableHead>
              <TableHead className="w-2/5 whitespace-nowrap @md:w-1/6">
                Statut
              </TableHead>
              <TableHead className="w-1/5 @md:w-1/6 @xl:w-1/5">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="hidden font-medium @md:table-cell">
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                  <TableCell className="hidden @lg:table-cell">
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20" />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default Loading
