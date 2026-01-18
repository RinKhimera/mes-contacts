"use client"

import { Table } from "@tanstack/react-table"
import { Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DataTableExport } from "./data-table-export"

export interface FilterOption {
  columnId: string
  title: string
  options: {
    label: string
    value: string
  }[]
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchKey?: string
  searchPlaceholder?: string
  filters?: FilterOption[]
  exportFilename?: string
  data?: TData[]
}

export function DataTableToolbar<TData>({
  table,
  searchKey,
  searchPlaceholder = "Rechercher...",
  filters,
  exportFilename,
  data,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {/* Search Input */}
        {searchKey && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={
                (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn(searchKey)?.setFilterValue(event.target.value)
              }
              className="h-9 w-full pl-9 sm:w-64 lg:w-80"
            />
          </div>
        )}

        {/* Filter Selects */}
        {filters?.map((filter) => {
          const column = table.getColumn(filter.columnId)
          if (!column) return null

          return (
            <Select
              key={filter.columnId}
              value={(column.getFilterValue() as string) ?? "all"}
              onValueChange={(value) =>
                column.setFilterValue(value === "all" ? undefined : value)
              }
            >
              <SelectTrigger className="h-9 w-[130px]">
                <SelectValue placeholder={filter.title} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        })}

        {/* Reset Filters */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-9 px-3"
          >
            Réinitialiser
            <X className="ml-2 size-4" />
          </Button>
        )}
      </div>

      {/* Export Button */}
      {exportFilename && data && (
        <DataTableExport data={data} filename={exportFilename} />
      )}
    </div>
  )
}
