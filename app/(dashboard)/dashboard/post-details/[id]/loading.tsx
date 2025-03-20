import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Contact as ContactIcon,
  FileText as FileTextIcon,
  Map,
  MapPin as MapPinIcon,
  Tag as TagIcon,
} from "lucide-react"

const Loading = () => {
  return (
    <div className="p-4 pt-0">
      <h1 className="text-4xl font-bold">Infos sur le post</h1>

      <div className="my-4 max-w-5xl">
        <div className="w-full max-w-2xl cursor-default border-l-8">
          <Card className="flex border-none p-0 shadow-none transition-colors max-sm:flex-col sm:items-end">
            <div className="flex w-[180px] items-center justify-center pl-4 max-sm:pt-4">
              <AspectRatio ratio={1} className="bg-muted">
                <Skeleton className="h-full w-full" />
              </AspectRatio>
            </div>

            <div className="flex-1 pl-4">
              <div className="flex flex-col space-y-2 pt-4 tracking-tight">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full mb-2" />
                <div className="flex flex-col space-y-2 pt-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                  <Skeleton className="h-10 w-full sm:w-32" />
                  <Skeleton className="h-10 w-full sm:w-32" />
                  <Skeleton className="h-10 w-full sm:w-32" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-10 grid max-w-4xl grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <TagIcon className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold tracking-tight">
                Catégorie
              </h3>
            </div>
            <Skeleton className="h-5 w-1/2" />
          </Card>

          <Card className="p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <FileTextIcon className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold tracking-tight">
                Détails et description
              </h3>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-2/3" />
            </div>
          </Card>

          <Card className="p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <MapPinIcon className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold tracking-tight">
                Localisation
              </h3>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
            </div>
          </Card>

          <Card className="p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <ContactIcon className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold tracking-tight">Contacts</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-5 w-1/2" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-5 w-2/3" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-5 w-1/2" />
              </div>
            </div>
          </Card>

          {/* Section de la carte qui occupe toute la largeur */}
          <Card className="col-span-1 lg:col-span-2 p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <Map className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold tracking-tight">Carte</h3>
            </div>
            <Skeleton className="h-[400px] w-full" />
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Loading
