"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { PostCardProps } from "@/types"
import { Globe, Mail, Phone } from "lucide-react"
import Link from "next/link"

export const PostCard = ({
  name,
  address,
  city,
  province,
  postalCode,
  description,
  services,
  phone,
  email,
  website,
}: PostCardProps) => {
  return (
    <Link href={"/"} className="w-full max-w-2xl cursor-default md:ml-5">
      <Card className="bg-muted p-0 transition-colors hover:bg-muted/50">
        <CardContent className="flex flex-col space-y-0 pt-4">
          <h2 className="cursor-pointer text-2xl font-bold hover:underline">
            {name}
          </h2>
          <p className="pb-2 text-sm text-muted-foreground">
            {`${address}, ${city} ${province} ${postalCode}`}
          </p>
          <p>{description}</p>
          <p className="text-sm text-muted-foreground">{services}</p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 pt-0 sm:flex-row sm:space-x-2 sm:space-y-0">
          <Button
            className="w-full sm:w-auto"
            onClick={() => (window.location.href = `tel:${phone}`)}
          >
            <Phone className="mr-2 h-4 w-4" />
            Call
          </Button>
          <Button
            className="w-full sm:w-auto"
            onClick={() => (window.location.href = `mailto:${email}`)}
          >
            <Mail className="mr-2 h-4 w-4" />
            Email
          </Button>
          <Button
            className="w-full sm:w-auto"
            onClick={() => window.open(website, "_blank")}
          >
            <Globe className="mr-2 h-4 w-4" />
            Website
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
