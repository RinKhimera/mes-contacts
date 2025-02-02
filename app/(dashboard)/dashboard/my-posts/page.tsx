// import UserPostCard from "@/components/dashboard/user-post-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getPostsByUserId } from "@/server/actions/post"
import { auth } from "@clerk/nextjs/server"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Eye, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"

const MyPosts = async () => {
  const { userId } = await auth()

  const userPosts = await getPostsByUserId(userId!)

  return (
    <div className="p-4 pt-0">
      <h1 className="text-4xl font-bold">Mes annonces</h1>

      <Table className="my-4">
        <TableCaption>Liste de vos annonces</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Catégorie</TableHead>
            <TableHead>Nom de l&apos;annonce</TableHead>
            <TableHead>Date de création</TableHead>
            <TableHead className="text-center">Statut</TableHead>
            <TableHead className="w-[200px] text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userPosts.length !== 0 ? (
            userPosts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">{post.category}</TableCell>
                <TableCell>{post.businessName}</TableCell>
                <TableCell>
                  {format(post.createdAt, "P", { locale: fr })}
                </TableCell>
                <TableCell>
                  {post.status === "PUBLISHED" && (
                    <div className="flex items-end justify-center">
                      <Badge variant={"published"}>En ligne</Badge>
                    </div>
                  )}
                  {post.status === "DRAFT" && (
                    <div className="flex items-end justify-center">
                      <Badge variant={"draft"}>En attente</Badge>
                    </div>
                  )}
                  {post.status === "DISABLED" && (
                    <div className="flex items-end justify-center">
                      <Badge variant={"disabled"}>Désactivé</Badge>
                    </div>
                  )}
                </TableCell>
                <TableCell className="">
                  <div className="flex justify-center gap-2">
                    <Button size={"icon"} variant={"outline"} asChild>
                      <Link href={`/dashboard/post-details/${post.id}`}>
                        <Eye size={20} />
                      </Link>
                    </Button>
                    <Button size={"icon"} variant={"outline"}>
                      <Link href={`/dashboard/edit-post/${post.id}`}>
                        <Pencil size={20} />
                      </Link>
                    </Button>
                    <Button size={"icon"} variant={"outline"}>
                      <Trash2 size={20} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="space-y-5 text-center">
                <p className="italic text-muted-foreground">
                  Vous n&apos;avez pas encore publié d&apos;annonce !
                </p>
                <Button variant={"secondary"} asChild>
                  <Link href="/dashboard/new-post">Créer une annonce</Link>
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default MyPosts
