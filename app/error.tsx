"use client"

import { SiteHeader } from "@/components/shared/site-header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertCircle,
  Bug,
  Home,
  RefreshCw,
  Search,
  Terminal,
} from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"

const Error = ({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) => {
  const isDev = process.env.NODE_ENV === "development"

  useEffect(() => {
    // Log l'erreur dans un service de reporting
    console.error("🔴 Erreur capturée:", error)
  }, [error])

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl">
          {/* Icône et titre */}
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-destructive/10 p-6">
                <AlertCircle className="h-16 w-16 text-destructive" />
              </div>
            </div>
            <h1 className="mb-2 text-4xl font-bold">Une erreur est survenue</h1>
            <p className="text-xl text-muted-foreground">
              Quelque chose s&apos;est mal passé
            </p>
          </div>

          {/* Message d'erreur principal */}
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur détectée</AlertTitle>
            <AlertDescription>
              Une erreur inattendue s&apos;est produite lors du chargement de
              cette page. Nos équipes ont été notifiées et travaillent à
              résoudre le problème.
            </AlertDescription>
            {error.digest && (
              <p className="mt-2 text-xs text-muted-foreground">
                Code d&apos;erreur :{" "}
                <code className="font-mono">{error.digest}</code>
              </p>
            )}
          </Alert>

          {/* Détails techniques (DEV uniquement) */}
          {isDev && (
            <Card className="mb-6 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-500">
                  <Bug className="h-5 w-5" />
                  Détails de l&apos;erreur (Mode Développement)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Message d'erreur */}
                <div>
                  <h3 className="mb-1 flex items-center gap-2 text-sm font-semibold text-yellow-700 dark:text-yellow-500">
                    <Terminal className="h-4 w-4" />
                    Message
                  </h3>
                  <pre className="overflow-x-auto rounded-md bg-yellow-100 p-3 text-xs dark:bg-yellow-950/40">
                    <code className="text-yellow-900 dark:text-yellow-300">
                      {error.message}
                    </code>
                  </pre>
                </div>

                {/* Stack trace */}
                {error.stack && (
                  <div>
                    <h3 className="mb-1 flex items-center gap-2 text-sm font-semibold text-yellow-700 dark:text-yellow-500">
                      <Terminal className="h-4 w-4" />
                      Stack Trace
                    </h3>
                    <pre className="max-h-64 overflow-auto rounded-md bg-yellow-100 p-3 text-xs dark:bg-yellow-950/40">
                      <code className="text-yellow-900 dark:text-yellow-300">
                        {error.stack}
                      </code>
                    </pre>
                  </div>
                )}

                {/* Digest */}
                {error.digest && (
                  <div>
                    <h3 className="mb-1 text-sm font-semibold text-yellow-700 dark:text-yellow-500">
                      Digest
                    </h3>
                    <code className="block rounded-md bg-yellow-100 p-3 text-xs text-yellow-900 dark:bg-yellow-950/40 dark:text-yellow-300">
                      {error.digest}
                    </code>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Suggestions */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h3 className="mb-4 font-semibold">Que pouvez-vous faire ?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>Réessayer en cliquant sur le bouton ci-dessous</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>Rafraîchir la page (F5 ou Ctrl+R)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>
                    Retourner à la page d&apos;accueil et réessayer depuis là
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>
                    Si le problème persiste, contactez notre équipe de support
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              onClick={reset}
              size="lg"
              className="flex-1 sm:flex-initial"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Réessayer
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="flex-1 sm:flex-initial"
            >
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Page d&apos;accueil
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="flex-1 sm:flex-initial"
            >
              <Link href="/recherche">
                <Search className="mr-2 h-4 w-4" />
                Rechercher
              </Link>
            </Button>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Une erreur ? Un bug ?{" "}
            <Link
              className="text-primary hover:underline"
              href="https://github.com/RinKhimera/mes-contacts/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              Signalez-le sur GitHub
            </Link>{" "}
            🐛
          </p>
        </div>
      </div>
    </div>
  )
}

export default Error
