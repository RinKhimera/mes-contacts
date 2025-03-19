"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  Filter,
  MapPin,
  Phone,
  Star,
  ChevronDown,
  ListFilter,
  Map as MapIcon,
  LoaderCircle,
  X,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { getPosts, searchPostsCombined } from "@/server/actions/post"
import Image from "next/image"
import postImagePlaceholder from "@/public/images/post-image-placeholder.jpg"
import { categoriesServices } from "@/constants"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { Post } from "@prisma/client"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
} from "@tanstack/react-table"
import { DataTablePagination } from "@/components/dashboard/pagination"

const SearchPage = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 9,
  })

  const table = useReactTable({
    data: posts,
    pageCount: Math.ceil(posts.length / pagination.pageSize),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
    columns: [],
  })

  // Calculer les éléments à afficher pour la page actuelle
  const paginatedPosts = table.getRowModel().rows.map((row) => row.original)

  // Requête pour tous les posts (sans filtre)
  const { data: fetchedPosts, isLoading: isLoadingAllPosts } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getPosts(),
  })

  // Requête combinée pour recherche + catégories
  const {
    // data: combinedResults,
    isLoading: isLoadingCombined,
    refetch: refetchCombined,
  } = useQuery({
    queryKey: ["posts", "combined", searchTerm, selectedCategories],
    queryFn: () => searchPostsCombined(searchTerm, selectedCategories),
    enabled: false, // Active manuellement sur demande
  })

  // État de chargement combiné
  // const isLoading = isLoadingAllPosts || isLoadingFiltered || isLoadingSearch
  // État de chargement combiné
  const isLoading = isLoadingAllPosts || isLoadingCombined

  // Gestionnaire pour la soumission de la recherche
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsSearching(true)
    const results = await refetchCombined()

    if (results.data) {
      setPosts(results.data)
    }
    setIsSearching(false)
  }

  // Fonction pour réinitialiser la recherche
  const resetSearch = () => {
    setSearchTerm("")

    if (selectedCategories.length > 0) {
      // Garder les filtres de catégorie actifs
      refetchCombined()
    } else if (fetchedPosts) {
      // Si pas de catégories, revenir aux posts non filtrés
      setPosts(fetchedPosts)
    }
  }

  // Gestionnaire pour les changements de catégorie
  const handleCategoryChange = async (category: string, isChecked: boolean) => {
    const updatedCategories = isChecked
      ? [...selectedCategories, category]
      : selectedCategories.filter((c) => c !== category)

    setSelectedCategories(updatedCategories)

    // Déclencher une recherche combinée après mise à jour des catégories
    setIsSearching(true)

    // Petit délai pour s'assurer que le state est mis à jour
    setTimeout(async () => {
      const results = await refetchCombined()

      if (results.data) {
        setPosts(results.data)
      }
      setIsSearching(false)
    }, 10)
  }

  // Mettre à jour les posts quand les données initiales sont chargées
  useEffect(() => {
    if (
      !isSearching &&
      !searchTerm &&
      selectedCategories.length === 0 &&
      fetchedPosts
    ) {
      setPosts(fetchedPosts)
    }
  }, [fetchedPosts, isSearching, searchTerm, selectedCategories])

  return (
    <div className="p-4 pt-0">
      <h1 className="text-4xl font-bold">Recherche</h1>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative mt-4 mb-8 max-w-xl">
        <Input
          type="search"
          placeholder="Rechercher par nom ou ville..."
          className="h-12 w-full pr-12 pl-10 text-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform" />

        {searchTerm && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-12 h-8 w-8 -translate-y-1/2 transform"
            onClick={resetSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        <Button
          type="submit"
          className="absolute top-1/2 right-1 h-10 -translate-y-1/2 transform"
          size="icon"
          disabled={isLoading}
        >
          {isLoading ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </form>

      {/* Results Section */}
      <div className="@container">
        <div className="flex flex-col gap-4 @[900px]:flex-row">
          {/* Filters Sidebar */}
          <div className="w-full shrink-0 @[900px]:sticky @[900px]:top-4 @[900px]:w-64">
            <div className="bg-card rounded-lg border p-4 shadow-sm">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <h3 className="font-medium">Filtres</h3>
                    {(selectedCategories.length > 0 || searchTerm) && (
                      <Badge variant="secondary" className="ml-2">
                        {selectedCategories.length + (searchTerm ? 1 : 0)}
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs"
                  >
                    <Filter className="mr-2 h-3 w-3" /> Filtres avancés
                  </Button>
                </div>

                {/* Bouton de réinitialisation sous le titre */}
                {(selectedCategories.length > 0 || searchTerm) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground mt-2 h-8 w-full border border-dashed px-2 text-xs"
                    onClick={async () => {
                      setSelectedCategories([])
                      setSearchTerm("")
                      if (fetchedPosts) {
                        setPosts(fetchedPosts)
                      }
                    }}
                  >
                    Réinitialiser tous les filtres
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                {/* Category Filter */}
                <div>
                  <label className="text-sm font-medium">Catégorie</label>
                  <div className="mt-1 space-y-1">
                    {categoriesServices.map((category) => (
                      <div key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          id={category}
                          className="h-4 w-4 flex-shrink-0"
                          checked={selectedCategories.includes(category)}
                          onChange={(e) =>
                            handleCategoryChange(category, e.target.checked)
                          }
                        />
                        <label
                          htmlFor={category}
                          className="ml-2 truncate text-sm hover:text-clip"
                          title={category}
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Distance Filter */}
                <div>
                  <label className="text-sm font-medium">Distance</label>
                  <div className="mt-3 px-2">
                    <Slider defaultValue={[5]} max={20} step={1} />
                    <div className="mt-1 flex justify-between text-xs">
                      <span>0 km</span>
                      <span>20 km</span>
                    </div>
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="text-sm font-medium">Évaluation</label>
                  <div className="mt-1 space-y-1">
                    {[5, 4, 3, 2].map((rating) => (
                      <div key={rating} className="flex items-center">
                        <input
                          type="radio"
                          name="rating"
                          id={`rating-${rating}`}
                          className="h-4 w-4"
                        />
                        <label
                          htmlFor={`rating-${rating}`}
                          className="ml-2 flex items-center text-sm"
                        >
                          {Array(rating)
                            .fill(0)
                            .map((_, i) => (
                              <Star
                                key={i}
                                className="h-3 w-3 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                          <span className="ml-1">et plus</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Main Content */}
          <div className="flex h-[calc(100vh-220px)] flex-1 flex-col">
            {/* Results Controls */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div className="text-muted-foreground text-sm">
                <span className="text-foreground font-medium">
                  {isLoading ? "..." : posts.length}
                </span>{" "}
                résultats trouvés
              </div>

              <div className="flex items-center gap-2">
                <Tabs defaultValue="list" className="w-auto">
                  <TabsList className="h-8 w-auto">
                    <TabsTrigger value="list" className="h-8 px-2">
                      <ListFilter className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger value="map" className="h-8 px-2">
                      <MapIcon className="h-4 w-4" />
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <Button variant="outline" className="h-8 gap-1 text-xs">
                  Trier par <ChevronDown className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Results Grid */}
            <div className="flex min-h-0 flex-1 flex-col">
              <ScrollArea className="h-full" type="scroll">
                <div className="pb-4">
                  {isLoading ? (
                    <div className="flex h-[400px] items-center justify-center">
                      <LoaderCircle className="animate-spin" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 @[700px]:grid-cols-2 @[1500px]:grid-cols-3">
                      {paginatedPosts.map((post) => (
                        <Link
                          key={post.id}
                          href={`/dashboard/post-details/${post.id}`}
                        >
                          <Card className="hover:bg-muted/80 flex h-[140px] flex-row overflow-hidden transition">
                            <div className="bg-muted h-full w-[140px] shrink-0">
                              <Image
                                src={
                                  post.businessImageUrl || postImagePlaceholder
                                }
                                alt={post.businessName || "Entreprise"}
                                width={140}
                                height={140}
                                className="h-full w-full object-cover"
                              />
                            </div>

                            <CardContent className="flex-1 overflow-hidden p-4 pt-1">
                              <div className="flex h-full flex-col justify-between">
                                <div>
                                  <div className="mb-1 flex items-center justify-between">
                                    <h3 className="line-clamp-1 font-semibold">
                                      {post.businessName}
                                    </h3>

                                    <div className="flex items-center">
                                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                      <span className="ml-1 text-xs font-medium">
                                        5
                                      </span>
                                    </div>
                                  </div>

                                  <Badge className="mb-2 inline-flex w-fit max-w-[95%]">
                                    <span className="truncate">
                                      {post.category || "Non catégorisé"}
                                    </span>
                                  </Badge>

                                  {post.description ? (
                                    <p className="text-muted-foreground line-clamp-2 text-sm">
                                      {post.description}
                                    </p>
                                  ) : (
                                    <p className="text-muted-foreground line-clamp-2 text-sm italic">
                                      Aucune description
                                    </p>
                                  )}
                                </div>

                                <div className="text-muted-foreground mt-1 flex items-center justify-between text-xs">
                                  {(post.city || post.province) && (
                                    <div className="flex max-w-[60%] items-center gap-1">
                                      <MapPin className="h-3 w-3 flex-shrink-0" />
                                      <span className="truncate">
                                        {post.city}
                                        {post.city && post.province ? ", " : ""}
                                        {post.province}
                                      </span>
                                    </div>
                                  )}
                                  {post.phone && (
                                    <div className="ml-auto flex max-w-[40%] items-center gap-1">
                                      <Phone className="h-3 w-3 flex-shrink-0" />
                                      <span className="truncate">
                                        {post.phone}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Pagination */}
            <div className="mt-4 border-t py-3">
              {!isLoading && posts.length > 0 && (
                <DataTablePagination
                  table={table}
                  totalPages={Math.ceil(posts.length / pagination.pageSize)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchPage
