"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { categoriesServices, provinces } from "@/constants"
import { api } from "@/convex/_generated/api"
import { Doc, Id } from "@/convex/_generated/dataModel"
import postImagePlaceholder from "@/public/images/post-image-placeholder.jpg"
import { postSchema } from "@/schemas/post"
import { checkoutHandler } from "@/server/actions/checkout"
import { MapboxResponse } from "@/types"
import { useUploadThing } from "@/utils/uploadthing"
import { zodResolver } from "@hookform/resolvers/zod"
import { AddressAutofill } from "@mapbox/search-js-react"
import { useMutation } from "convex/react"
import { LoaderCircle } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { AspectRatio } from "../ui/aspect-ratio"

const PostForm = ({ post }: { post?: Doc<"posts"> }) => {
  const router = useRouter()

  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const [postId, setPostId] = useState<Id<"posts">>()

  // Convex mutations
  const createPost = useMutation(api.posts.createPost)
  const updatePost = useMutation(api.posts.updatePost)

  const handleAddressSelect = (address: MapboxResponse) => {
    const features = address.features[0]
    console.log(features)

    form.setValue("address", features.properties.full_address)
    form.setValue("city", features.properties.address_level2)
    form.setValue("province", features.properties.region_code)
    form.setValue("postalCode", features.properties.postcode)
    form.setValue("longitude", features.geometry.coordinates[0])
    form.setValue("latitude", features.geometry.coordinates[1])
  }

  const [businessImageStatus, setbusinessImageStatus] = useState<
    string | undefined
  >("Non")

  const [files, setFiles] = useState<File[]>([])

  const handleBusinessImageChange = (value: string) => {
    setbusinessImageStatus(value)
    // Reset form fields and files when radio selection changes
    form.setValue("businessImageUrl", undefined)
    setFiles([])
  }

  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: (response) => {
      console.log(response)
      setFiles([]) // Reset files after upload
    },
    onUploadError: (error) => {
      console.log(error)
      // alert("error occurred while uploading")
    },
    onUploadBegin: (file) => {
      console.log("upload has begun for", file)
    },
    onUploadProgress: (progress) => {
      console.log(progress)
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files
    if (fileList) {
      setFiles(Array.from(fileList))
    }
  }

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      businessName: post?.businessName || "",
      businessImageUrl: post?.businessImageUrl || undefined,
      category: post?.category || "",
      description: post?.description || undefined,
      phone: post?.phone || "",
      email: post?.email || "",
      website: post?.website || undefined,
      address: post?.address || "",
      province: post?.province || "",
      city: post?.city || "",
      postalCode: post?.postalCode || "",
      latitude: post?.geo?.latitude || undefined,
      longitude: post?.geo?.longitude || undefined,
    },
  })

  const onSubmit = async (data: z.infer<typeof postSchema>) => {
    startTransition(async () => {
      try {
        // Handle file upload first
        if (files.length > 0) {
          const res = await startUpload(files)
          if (res && res[0]) {
            // Update the form data with the uploaded file URL
            data.businessImageUrl = res[0].url
          }
        }

        if (post) {
          await updatePost({
            postId: post._id,
            businessName: data.businessName,
            businessImageUrl: data.businessImageUrl,
            category: data.category,
            description: data.description,
            phone: data.phone,
            email: data.email,
            website: data.website,
            address: data.address,
            city: data.city,
            province: data.province,
            postalCode: data.postalCode,
            longitude: data.longitude,
            latitude: data.latitude,
          })
          if (post.status === "DRAFT") {
            setOpen(true)
            setPostId(post._id)
          } else router.push("/dashboard/my-posts")

          toast.success("La publication a été mise à jour avec succès")
        } else {
          const newPostId = await createPost({
            businessName: data.businessName,
            businessImageUrl: data.businessImageUrl,
            category: data.category,
            description: data.description,
            phone: data.phone,
            email: data.email,
            website: data.website,
            address: data.address,
            city: data.city,
            province: data.province,
            postalCode: data.postalCode,
            longitude: data.longitude,
            latitude: data.latitude,
          })

          if (newPostId) {
            setPostId(newPostId)
            setOpen(true)
          }

          // router.push("/dashboard/my-posts")
          toast.success("La publication a été créée avec succès")
        }
      } catch (error) {
        console.error(error)
        toast.error("Une erreur s'est produite !", {
          description:
            "Veuillez vérifier votre connexion internet et réessayer. Si le problème persiste, veuillez contacter le support.",
        })
      }
    })
  }

  const onCheckout = async () => {
    startTransition(async () => {
      try {
        await checkoutHandler(postId!)
      } catch (error) {
        console.error(error)
        toast.error("Une erreur s'est produite !", {
          description:
            "Veuillez vérifier votre connexion internet et réessayer. Si le problème persiste, veuillez contacter le support.",
        })
      }
    })
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mb-4 grid grid-cols-1 gap-4"
        >
          <h2 className="text-xl">Informations de votre annonce</h2>

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Catégorie de votre service</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez la catégorie" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categoriesServices.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  La catégorie à laquelle votre entreprise ou activité
                  appartient.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="businessName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom commercial</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Clinique | Restaurant | Garage John Doe"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Ce nom sera affiché publiquement.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {!post ? (
            <>
              <Label>
                Avez-vous une photo ou un logo associé à votre nom commercial ?
              </Label>
              <RadioGroup
                defaultValue={businessImageStatus}
                onValueChange={handleBusinessImageChange}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Oui" id="yesLogo" />
                  <Label htmlFor="yesLogo">Oui</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Non" id="noLogo" />
                  <Label htmlFor="noLogo">Non</Label>
                </div>
              </RadioGroup>
            </>
          ) : (
            <>
              <div>
                <FormLabel>
                  Votre photo ou votre logo associé à votre nom commercial
                </FormLabel>
                <div className="flex w-[100px] items-center justify-center pt-2">
                  <AspectRatio ratio={1} className="bg-muted">
                    <Image
                      src={post.businessImageUrl || postImagePlaceholder}
                      alt="Business image"
                      className="rounded-md object-cover"
                      fill
                    />
                  </AspectRatio>
                </div>
              </div>

              <Label>Modifier votre image actuelle ?</Label>
              <RadioGroup
                defaultValue={businessImageStatus}
                onValueChange={handleBusinessImageChange}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Oui" id="yesLogo" />
                  <Label htmlFor="yesLogo">Oui</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Non" id="noLogo" />
                  <Label htmlFor="noLogo">Non</Label>
                </div>
              </RadioGroup>
            </>
          )}

          {businessImageStatus === "Oui" && (
            <FormField
              control={form.control}
              name="businessImageUrl"
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel htmlFor="picture">
                    Chargez le logo ou l&apos;image associée
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="picture"
                      type="file"
                      onChange={handleFileChange}
                      value={undefined}
                    />
                  </FormControl>
                  <FormDescription>
                    Votre photo ou votre logo associé à votre nom commercial.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description du service</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description de votre entreprise ou activité"
                    className="min-h-[100px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Une description de votre entreprise ou activité.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Téléphone</FormLabel>
                <FormControl>
                  <Input placeholder="(555) 555-5555" {...field} />
                </FormControl>
                <FormDescription>
                  Votre numéro de téléphone public.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Courriel</FormLabel>
                <FormControl>
                  <Input placeholder="example@xyz.com" {...field} />
                </FormControl>
                <FormDescription>Votre courriel public.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Site web</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
                </FormControl>
                <FormDescription>Votre site web public.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse</FormLabel>
                <FormControl>
                  {/* @ts-expect-error - AddressAutofill component type issues */}
                  <AddressAutofill
                    accessToken={
                      process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ""
                    }
                    // @ts-expect-error - Mapbox types mismatch
                    onRetrieve={handleAddressSelect}
                    options={{
                      country: "ca",
                    }}
                    theme={{
                      variables: {
                        fontFamily: "inherit",
                        fontWeight: "400",
                        colorBackground: "rgb(24, 32, 48)", // dark blue
                        colorBackgroundHover: "rgb(17, 24, 39)", // dark gray on hover
                        colorBackgroundActive: "rgb(31, 41, 55)", // darker gray when active
                        colorText: "white",
                      },
                    }}
                  >
                    <Input
                      placeholder="1234 rue Example"
                      autoComplete="street-address"
                      {...field}
                    />
                  </AddressAutofill>
                </FormControl>
                <FormDescription>Votre adresse publique.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="province"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Province</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre province" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map((province, i) => (
                        <SelectItem key={i} value={province.value}>
                          {province.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>Votre province publique.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ville</FormLabel>
                <FormControl>
                  <Input placeholder="Sherbrooke" {...field} />
                </FormControl>
                <FormDescription>Votre ville publique.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code postal</FormLabel>
                <FormControl>
                  <Input placeholder="H0H 0H0" {...field} />
                </FormControl>
                <FormDescription>Votre code postal publique.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              "Enregistrer"
            )}
          </Button>
        </form>
      </Form>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finalisez la mise en avant de votre post</DialogTitle>
            <DialogDescription>
              Votre post a été {post ? "mis à jour" : "crée"} avec succès. Vous
              avez la possibilité de le promouvoir immédiatement en procédant au
              paiement dès maintenant ou de le régler ultérieurement.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant={"outline"}
              onClick={(e) => {
                e.preventDefault()
                router.push("/dashboard/my-posts")
              }}
              disabled={isPending}
            >
              Plus tard
            </Button>
            <Button onClick={onCheckout} disabled={isPending}>
              {isPending ? (
                <div className="flex items-center">
                  <LoaderCircle className="mr-1 animate-spin" /> Redirection...
                </div>
              ) : (
                "Payer maintenant"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PostForm
