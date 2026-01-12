"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/convex/_generated/api"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useQuery } from "convex/react"
import {
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  Plus,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const { currentUser, isLoading: isUserLoading } = useCurrentUser()
  const posts = useQuery(
    api.posts.getCurrentUserPosts,
    currentUser ? {} : "skip",
  )

  // Calculer les statistiques
  const publishedPosts = posts?.filter((p) => p.status === "PUBLISHED") || []
  const draftPosts = posts?.filter((p) => p.status === "DRAFT") || []
  const totalPosts = posts?.length || 0

  // Loading state
  if (isUserLoading || posts === undefined) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête de bienvenue */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">
          Bienvenue, {currentUser?.name?.split(" ")[0] || "Utilisateur"}! 👋
        </h1>
        <p className="text-muted-foreground">
          Gérez vos annonces et suivez vos statistiques depuis votre tableau de
          bord.
        </p>
      </div>

      {/* Statistiques */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total d&apos;annonces
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPosts}</div>
            <p className="text-xs text-muted-foreground">Toutes vos annonces</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publiées</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedPosts.length}</div>
            <p className="text-xs text-muted-foreground">
              Visibles publiquement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Brouillons</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftPosts.length}</div>
            <p className="text-xs text-muted-foreground">
              En attente de publication
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visibilité</CardTitle>
            <Eye className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {publishedPosts.length > 0 ? "Active" : "Inactive"}
            </div>
            <p className="text-xs text-muted-foreground">
              {publishedPosts.length > 0
                ? "Vos annonces sont visibles"
                : "Aucune annonce publiée"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Créer une annonce */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Créer une nouvelle annonce
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Publiez une nouvelle annonce pour votre entreprise et augmentez
              votre visibilité auprès des clients potentiels.
            </p>
            <Button asChild size="lg" className="w-full">
              <Link href="/dashboard/new-post">
                <Plus className="mr-2 h-4 w-4" />
                Créer une annonce
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Mes annonces */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Gérer mes annonces
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Consultez, modifiez ou supprimez vos annonces existantes.
              Mettez-les à jour pour garder vos informations actuelles.
            </p>
            <Button asChild variant="outline" size="lg" className="w-full">
              <Link href="/dashboard/my-posts">
                <TrendingUp className="mr-2 h-4 w-4" />
                Voir mes annonces ({totalPosts})
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Message si aucune annonce */}
      {totalPosts === 0 && (
        <Card className="mt-6 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">
              Aucune annonce pour le moment
            </h3>
            <p className="mb-6 text-center text-sm text-muted-foreground">
              Commencez dès maintenant en créant votre première annonce
              d&apos;entreprise.
            </p>
            <Button asChild size="lg">
              <Link href="/dashboard/new-post">
                <Plus className="mr-2 h-4 w-4" />
                Créer ma première annonce
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Conseils */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>💡 Conseils pour optimiser vos annonces</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span>
                Utilisez une photo professionnelle de haute qualité pour attirer
                l&apos;attention
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span>
                Rédigez une description claire et détaillée de vos services
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span>
                Vérifiez régulièrement que vos informations de contact sont à
                jour
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span>
                Choisissez la catégorie la plus pertinente pour être facilement
                trouvé
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
