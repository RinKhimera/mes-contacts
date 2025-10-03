"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { FileEdit, Info } from "lucide-react"
import dynamic from "next/dynamic"

const PostFormWithNoSSR = dynamic(() => import("@/components/post/post-form"), {
  ssr: false,
})

const NewPost = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <FileEdit className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Nouvelle annonce
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Partagez votre activité, vos services ou vos offres spéciales avec
          notre communauté.
        </p>
      </div>

      <Separator className="mb-8" />

      {/* Info card */}
      <Card className="mb-8 border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/20">
        <CardContent className="flex gap-3 pt-6">
          <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
          <div className="space-y-1 text-sm">
            <p className="font-medium text-blue-900 dark:text-blue-100">
              Conseils pour une annonce réussie
            </p>
            <ul className="list-inside list-disc space-y-1 text-blue-800 dark:text-blue-200">
              <li>Utilisez un titre clair et descriptif</li>
              <li>Ajoutez une image attrayante de qualité</li>
              <li>Décrivez vos services de manière détaillée</li>
              <li>Vérifiez vos coordonnées avant de publier</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Formulaire */}
      <PostFormWithNoSSR />
    </div>
  )
}

export default NewPost
