import { DynamicBreadcrumb } from "@/components/shared/dynamic-breadcrumb"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function InfoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <DynamicBreadcrumb />
      </nav>

      {/* Content */}
      <div className="mx-auto max-w-4xl space-y-8">
        {children}
      </div>

      {/* Back to home button */}
      <div className="mx-auto mt-12 max-w-4xl">
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l&apos;accueil
          </Link>
        </Button>
      </div>
    </div>
  )
}
