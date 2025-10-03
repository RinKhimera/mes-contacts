import { SiteHeader } from "@/components/shared/site-header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Home, Search } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl">
          {/* Icône et titre */}
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-primary/10 p-4">
                <AlertCircle className="h-16 w-16 text-primary" />
              </div>
            </div>
            <h1 className="mb-2 text-4xl font-bold md:text-6xl">404</h1>
            <h2 className="text-xl font-semibold text-muted-foreground md:text-2xl">
              Page non trouvée
            </h2>
          </div>

          {/* Message d'erreur */}
          <Alert className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Oups ! Cette page n&apos;existe pas</AlertTitle>
            <AlertDescription>
              La page que vous recherchez a peut-être été déplacée, supprimée ou
              n&apos;a jamais existé.
            </AlertDescription>
          </Alert>

          {/* Suggestions */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h3 className="mb-4 font-semibold">
                Que pouvez-vous faire maintenant ?
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>
                    Vérifiez l&apos;URL pour vous assurer qu&apos;elle est
                    correcte
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>
                    Retournez à la page d&apos;accueil et naviguez à partir de
                    là
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>
                    Utilisez la recherche pour trouver ce que vous cherchez
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="w-full sm:w-auto sm:min-w-40">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Page d&apos;accueil
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto sm:min-w-40"
            >
              <Link href="/recherche">
                <Search className="mr-2 h-4 w-4" />
                Rechercher
              </Link>
            </Button>
          </div>

          {/* Footer humoristique */}
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Ou peut-être que cette page est{" "}
            <Link
              className="text-primary hover:underline"
              href="https://github.com/RinKhimera/mes-contacts"
              target="_blank"
              rel="noopener noreferrer"
            >
              bien cachée dans le code source
            </Link>{" "}
            ?
          </p>
        </div>
      </div>
    </div>
  )
}
