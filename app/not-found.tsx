import { AvatarDropdown } from "@/components/shared/avatar-dropdown"
import { buttonVariants } from "@/components/ui/button"
import { auth, currentUser } from "@clerk/nextjs/server"
import { FileQuestion } from "lucide-react"
import Link from "next/link"

export default async function NotFound() {
  const { userId } = await auth()
  const user = await currentUser()

  return (
    <div className="mx-auto h-screen w-full max-w-6xl px-4 md:px-10 lg:px-20 xl:px-0">
      <div className="flex justify-between pt-4">
        <Link
          href="/"
          className="-mt-1 text-3xl font-bold text-accent-foreground"
        >
          mc.ca
        </Link>

        {userId && <AvatarDropdown user={user} />}
      </div>

      <div className="flex h-[calc(100vh-80px)] flex-col items-center justify-center p-8">
        <FileQuestion size={100} className="-mt-5 text-red-500" />
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="mt-5 text-4xl font-semibold md:text-6xl">
            <span className="text-red-500">404</span> - Page non trouvée
          </h1>
          <p className="max-w-md text-muted-foreground">
            La page a été supprimée… ou alors elle est juste bien cachée dans le{" "}
            <Link
              className="text-red-500 hover:underline"
              href="https://github.com/RinKhimera/mes-contacts"
            >
              code source ?
            </Link>
          </p>
          <Link className={buttonVariants({ variant: "secondary" })} href={"/"}>
            Retourner à la page d&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  )
}
