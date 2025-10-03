"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { categoriesServices, provinces } from "@/constants"
import { Filter, Search, X } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"

export function SearchFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "")
  const [category, setCategory] = useState(
    searchParams.get("category") || "all",
  )
  const [province, setProvince] = useState(
    searchParams.get("province") || "all",
  )
  const [city, setCity] = useState(searchParams.get("city") || "")

  const createQueryString = useCallback(
    (params: Record<string, string>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString())

      Object.entries(params).forEach(([key, value]) => {
        if (value && value !== "all" && value.trim() !== "") {
          newSearchParams.set(key, value)
        } else {
          newSearchParams.delete(key)
        }
      })

      return newSearchParams.toString()
    },
    [searchParams],
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const queryString = createQueryString({
      q: searchTerm,
      category,
      province,
      city,
    })

    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`)
  }

  const handleReset = () => {
    setSearchTerm("")
    setCategory("all")
    setProvince("all")
    setCity("")
    router.push(pathname)
  }

  const hasActiveFilters =
    searchTerm !== "" || category !== "all" || province !== "all" || city !== ""

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Filtres de recherche</h2>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Réinitialiser
          </Button>
        )}
      </div>

      <form onSubmit={handleSearch} className="space-y-4">
        {/* Recherche textuelle */}
        <div className="space-y-2">
          <Label htmlFor="search">Rechercher</Label>
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search"
              type="text"
              placeholder="Nom d'entreprise, service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Catégorie */}
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categoriesServices.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Province */}
          <div className="space-y-2">
            <Label htmlFor="province">Province</Label>
            <Select value={province} onValueChange={setProvince}>
              <SelectTrigger id="province">
                <SelectValue placeholder="Toutes les provinces" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les provinces</SelectItem>
                {provinces.map((prov) => (
                  <SelectItem key={prov.value} value={prov.value}>
                    {prov.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ville */}
          <div className="space-y-2">
            <Label htmlFor="city">Ville</Label>
            <Input
              id="city"
              type="text"
              placeholder="Ex: Montréal, Québec..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
        </div>

        {/* Bouton de recherche */}
        <Button type="submit" className="w-full gap-2">
          <Search className="h-4 w-4" />
          Rechercher
        </Button>
      </form>
    </div>
  )
}
