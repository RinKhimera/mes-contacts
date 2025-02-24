import { CheckoutButton } from "@/components/dashboard/checkout-button"
import { DeletePostButton } from "@/components/dashboard/delete-post-button"
import { SwitchStatusButton } from "@/components/dashboard/switch-status-button"
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
import { Eye, Pencil } from "lucide-react"
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
            <TableHead className="">Catégorie</TableHead>
            <TableHead className="">Nom de l&apos;annonce</TableHead>
            <TableHead className="">Date de création</TableHead>
            <TableHead className="">Statut</TableHead>
            <TableHead className="">Actions</TableHead>
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
                    <div className="">
                      <Badge variant={"published"}>En ligne</Badge>
                    </div>
                  )}
                  {post.status === "DRAFT" && (
                    <div className="">
                      <Badge variant={"draft"}>En attente</Badge>
                    </div>
                  )}
                  {post.status === "DISABLED" && (
                    <div className="">
                      <Badge variant={"disabled"}>Désactivé</Badge>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="space-x-2">
                    <Button size={"icon"} variant={"outline"} asChild>
                      <Link href={`/dashboard/post-details/${post.id}`}>
                        <Eye size={20} />
                      </Link>
                    </Button>

                    <Button
                      size={"icon"}
                      variant={"outline"}
                      className="hover:bg-blue-600"
                    >
                      <Link href={`/dashboard/edit-post/${post.id}`}>
                        <Pencil size={20} />
                      </Link>
                    </Button>

                    {post.status === "DRAFT" ? (
                      <CheckoutButton postId={post.id} />
                    ) : (
                      <SwitchStatusButton
                        postId={post.id}
                        postStatus={post.status}
                      />
                    )}

                    <DeletePostButton postId={post.id} />
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
