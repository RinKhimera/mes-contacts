import { HomePosts } from "@/components/home/home-posts"
import UploadInput from "@/components/shared/upload-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 md:px-10 lg:px-20 xl:px-0">
      <div className="mx-auto mt-10 max-w-xl text-center text-2xl font-bold lg:text-3xl">
        Trouvez des services et des entreprises au Québec et le reste du Canada
      </div>

      <UploadInput />

      <form className="mx-auto my-8 flex w-full max-w-xl flex-col gap-0 max-sm:gap-2 sm:flex-row">
        <div className="flex flex-grow flex-col gap-2 sm:flex-row">
          <Input
            type="text"
            placeholder="Plombier"
            className="h-11 flex-grow rounded-none"
          />
          <Input
            type="text"
            placeholder="Ville | Code postal"
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
