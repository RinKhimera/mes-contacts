import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import postImagePlaceholder from "@/public/images/post-image-placeholder.jpg"
import { PostProps } from "@/types"
import { auth } from "@clerk/nextjs/server"
import { Globe, Mail, Phone } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export const PostCard = async ({
  id,
  businessName,
  businessImageUrl,
  description,
  services,
  phone,
  email,
  website,
  address,
  province,
  city,
  postalCode,
}: PostProps) => {
  const { userId } = await auth()

  return (
    <div className="w-full max-w-2xl cursor-default md:ml-5">
      <Card className="flex bg-muted p-0 transition-colors hover:bg-muted/50 max-sm:flex-col">
        <div className="flex w-[180px] items-center justify-center pl-6 max-sm:pt-4 sm:pl-4">
          <AspectRatio ratio={1} className="bg-muted">
            <Image
              src={businessImageUrl || postImagePlaceholder}
              alt="Business image"
              className="rounded-md object-cover"
              fill
            />
          </AspectRatio>
        </div>
        <div className="flex-1">
          <Link
            href={
              userId ? `/dashboard/post-details/${id}` : `/post-details/${id}`
            }
          >
            <CardContent className="flex flex-col space-y-0 pt-4 tracking-tight">
              <h1 className="text-2xl font-bold transition hover:underline">
                {businessName}
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
            {website && (
              <Button className="w-full sm:w-auto" asChild>
                <Link href={website} target="_blank">
                  <Globe className="mr-2 h-4 w-4" />
                  Site web
                </Link>
              </Button>
            )}
          </CardFooter>
        </div>
      </Card>
    </div>
  )
}
