import { HomePosts } from "@/components/home/home-posts"
import { SiteHeader } from "@/components/shared/site-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { auth, currentUser } from "@clerk/nextjs/server"
import { Search } from "lucide-react"

export default async function Home() {
  const { userId } = await auth()
  const user = await currentUser()

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-10 lg:px-20 xl:px-0">
      <SiteHeader user={user} userId={userId} />

      <div className="mx-auto mt-20 max-w-xl text-center text-2xl font-bold lg:text-3xl">
        Trouvez des services et des entreprises au Québec et le reste du Canada
      </div>

      <form className="mx-auto my-8 flex w-full max-w-xl flex-col gap-0 max-sm:gap-2 sm:flex-row">
        <div className="flex flex-grow flex-col gap-2 sm:flex-row">
          <Input
            type="text"
            placeholder="Plombier"
            className="h-11 flex-grow rounded-none"
          />
          <Input
            type="text"
            placeholder="Sherbrooke"
            className="h-11 flex-grow rounded-none"
          />
        </div>
        <Button
          type="submit"
          size={"icon"}
          className="h-11 rounded-none max-sm:w-full"
        >
          <Search size={28} strokeWidth={4} />
        </Button>
      </form>

      <HomePosts />
    </div>
  )
}
