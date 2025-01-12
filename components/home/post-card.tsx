"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { PostCardProps } from "@/types"
import { Globe, Mail, Phone } from "lucide-react"
import Link from "next/link"

export const PostCard = ({
  id,
  name,
  address,
  city,
  province,
  postalCode,
  description,
  services,
  phone,
  email,
  // website,
}: PostCardProps) => {
  return (
    <div className="w-full max-w-2xl cursor-default md:ml-5">
      <Card className="bg-muted p-0 transition-colors hover:bg-muted/50">
        <Link href={`/post-details/${id}`}>
          <CardContent className="flex flex-col space-y-0 pt-4 tracking-tight">
            <h1 className="text-2xl font-bold transition hover:underline">
              {name}
            </h1>
            <p className="pb-2 text-muted-foreground">
              {`${address}, ${city} ${province} ${postalCode}`}
            </p>
            <p>{description}</p>
            <p className="text-sm text-muted-foreground">{services}</p>
          </CardContent>
        </Link>
        <CardFooter className="flex flex-col space-y-2 pt-0 sm:flex-row sm:space-x-2 sm:space-y-0">
          <Button className="w-full sm:w-auto" asChild>
            <Link href={`tel:${phone}`} target="_blank">
              <Phone className="mr-2 h-4 w-4" />
              Téléphone
            </Link>
          </Button>
          <Button className="w-full sm:w-auto" asChild>
            <Link href={`mailto:${email}`} target="_blank">
              <Mail className="mr-2 h-4 w-4" />
              Courriel
            </Link>
          </Button>
          <Button className="w-full sm:w-auto" disabled={true} asChild>
            <Link href={""}>
              <Globe className="mr-2 h-4 w-4" />
              Itinéraire
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
