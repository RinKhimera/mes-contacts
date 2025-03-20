import { PostActions } from "@/components/dashboard/post-actions"
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
import { getUserPosts } from "@/server/actions/post"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import Link from "next/link"

const MyPosts = async () => {
  const userPosts = await getUserPosts()

  return (
    <div className="p-4 pt-0">
      <h1 className="text-4xl font-bold">Mes annonces</h1>

      <Table className="my-4">
        <TableCaption>Liste de vos annonces</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Catégorie</TableHead>
            <TableHead>Nom de l&apos;annonce</TableHead>
            <TableHead>Date de création</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Actions</TableHead>
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

                <TableCell className="min-w-[100px] whitespace-nowrap">
                  {post.status === "PUBLISHED" && (
                    <Badge variant={"published"} className="whitespace-nowrap">
                      En ligne
                    </Badge>
                  )}
                  {post.status === "DRAFT" && (
                    <Badge variant={"draft"} className="whitespace-nowrap">
                      En attente
                    </Badge>
                  )}
                  {post.status === "DISABLED" && (
                    <Badge variant={"disabled"} className="whitespace-nowrap">
                      Désactivé
                    </Badge>
                  )}
                </TableCell>

                <TableCell>
                  <PostActions postId={post.id} postStatus={post.status} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="space-y-5 text-center">
                <p className="text-muted-foreground italic">
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
