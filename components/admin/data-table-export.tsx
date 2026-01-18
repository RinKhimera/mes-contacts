"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DataTableExportProps<TData> {
  data: TData[]
  filename: string
}

export function DataTableExport<TData>({
  data,
  filename,
}: DataTableExportProps<TData>) {
  const exportToCSV = () => {
    if (data.length === 0) return

    // Get headers from first item
    const headers = Object.keys(data[0] as object)

    // Build CSV content
    const csvContent = [
      // Header row
      headers.join(","),
      // Data rows
      ...data.map((item) =>
        headers
          .map((header) => {
            const value = (item as Record<string, unknown>)[header]
            // Handle different value types
            if (value === null || value === undefined) return ""
            if (typeof value === "string") {
              // Escape quotes and wrap in quotes if contains comma or newline
              const escaped = value.replace(/"/g, '""')
              return /[,\n"]/.test(value) ? `"${escaped}"` : escaped
            }
            if (typeof value === "object") {
              return `"${JSON.stringify(value).replace(/"/g, '""')}"`
            }
            return String(value)
          })
          .join(",")
      ),
    ].join("\n")

    // Create blob and download
    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;",
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute(
      "download",
      `${filename}-${new Date().toISOString().split("T")[0]}.csv`
    )
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="h-9 gap-2"
      onClick={exportToCSV}
      disabled={data.length === 0}
    >
      <Download className="size-4" />
      Exporter CSV
    </Button>
  )
}
