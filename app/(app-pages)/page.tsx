import { HomePosts } from "@/components/home/home-posts"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LoaderCircle, Search } from "lucide-react"
import { Suspense } from "react"

export default async function Home() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 md:px-10 lg:px-20 xl:px-0">
      <h1 className="mx-auto mt-10 max-w-xl text-center text-2xl font-bold lg:text-3xl">
        Trouvez des services et des entreprises au Québec et le reste du Canada
      </h1>

      <form className="mx-auto my-8 flex w-full max-w-xl flex-col gap-0 max-sm:gap-2 sm:flex-row">
        <div className="flex grow flex-col gap-2 sm:flex-row">
          <Input
            type="text"
            placeholder="Plombier"
            className="h-11 grow rounded-none"
          />
          <Input
            type="text"
            placeholder="Ville | Code postal"
            className="h-11 grow rounded-none"
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

      <Suspense fallback={<FallbackLoader />}>
        <HomePosts />
      </Suspense>
    </div>
  )
}

const FallbackLoader = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold lg:text-3xl">Annonces récentes</h1>
      <Card className="my-4">
        <CardContent className="py-4">
          <div className="flex h-[50vh] items-center justify-center">
            <LoaderCircle className="animate-spin" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
