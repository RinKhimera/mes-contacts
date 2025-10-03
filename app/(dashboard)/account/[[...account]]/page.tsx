import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { UserProfile } from "@clerk/nextjs"
import { UserCircle } from "lucide-react"

const UserAccountPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">Mon compte</h1>
          <Badge
            variant="outline"
            className="flex h-10 w-10 items-center justify-center rounded-full border-primary/20 bg-primary/10 p-0"
          >
            <UserCircle className="h-5 w-5 text-primary" />
          </Badge>
        </div>
        <p className="mt-1 text-muted-foreground">
          Gérez vos informations personnelles et vos paramètres de sécurité
        </p>
      </div>

      <Separator className="mb-8" />

      {/* Clerk UserProfile Component */}
      <div className="flex justify-center">
        <UserProfile
          path="/account"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-none border-0",
            },
          }}
        />
      </div>
    </div>
  )
}

export default UserAccountPage
