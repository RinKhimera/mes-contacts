import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table } from "@tanstack/react-table"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  totalPages: number
}

export function DataTablePagination<TData>({
  table,
  totalPages,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="text-muted-foreground text-sm">
        Page {table.getState().pagination.pageIndex + 1} sur {totalPages || 1}
      </div>
      <div className="flex items-center space-x-1">
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Première page</span>
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Page précédente</span>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            // Calculer les pages à afficher (max 5)
            const pageIndex = table.getState().pagination.pageIndex
            let pageNumber = i

            // Ajuster les numéros de page quand on est vers la fin
            if (totalPages > 5) {
              if (pageIndex > totalPages - 4) {
                // Proche de la fin, montrer les 5 dernières pages
                pageNumber = totalPages - 5 + i
              } else if (pageIndex > 1) {
                // Milieu, montrer pageIndex-1, pageIndex, pageIndex+1, etc.
                pageNumber = Math.max(0, pageIndex - 2) + i
              }
            }

            return (
              <Button
                key={pageNumber}
                variant={pageIndex === pageNumber ? "default" : "outline"}
                size="sm"
                className="h-8 w-8"
                onClick={() => table.setPageIndex(pageNumber)}
              >
                {pageNumber + 1}
              </Button>
            )
          })}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Page suivante</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => table.setPageIndex(totalPages - 1)}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Dernière page</span>
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
