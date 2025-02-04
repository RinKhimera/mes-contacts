"use client"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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
import { citiesByProvinces } from "@/hooks"
import { cn } from "@/lib/utils"
import postImagePlaceholder from "@/public/images/post-image-placeholder.jpg"
import { postSchema } from "@/schemas/post"
import { createPost, updatePost } from "@/server/actions/post"
import { useUploadThing } from "@/utils/uploadthing"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Post } from "@prisma/client"
import { Check, ChevronsUpDown, LoaderCircle } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { AspectRatio } from "../ui/aspect-ratio"

export const PostForm = ({ post }: { post: Post | undefined }) => {
  const router = useRouter()

  const [isPending, startTransition] = useTransition()

  // const [businessNameStatus, setBusinessNameStatus] = useState<
  //   string | undefined
  // >("Non")

  const [businessImageStatus, setbusinessImageStatus] = useState<
    string | undefined
  >("Non")

  const [files, setFiles] = useState<File[]>([])

  // const handleBusinessNameChange = (value: string) => {
  //   setBusinessNameStatus(value)
  //   // Reset form fields when radio selection changes
  //   form.setValue("businessName", undefined)
  // }

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
          await updatePost({ postId: post.id, data })
          router.push("/dashboard/my-posts")
          toast.success("La publication a été mise à jour avec succès")
        } else {
          await createPost(data)
          router.push("/dashboard/my-posts")
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

  const provinceValue = useWatch({
    control: form.control,
    name: "province",
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mb-4 grid grid-cols-1 gap-4"
      >
        <h2 className="text-xl">Informations sur l&apos;annonce</h2>

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catégorie</FormLabel>
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
                La catégorie à laquelle votre entreprise ou activité appartient.
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
              Voulez-vous une photo ou un logo associé à votre nom commercial ?
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
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="picture">Image associée</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    required
                    id="picture"
                    type="file"
                    onChange={handleFileChange}
                  />
                </FormControl>
                <FormDescription>
                  Votre photo ou votre logo associé à votre nom commercial.
                </FormDescription>
                <FormMessage />
                {/* <button
                  onClick={() => startUpload(files)}
                  disabled={files.length === 0}
                >
                  Upload
                </button> */}
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
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
          name="province"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Province</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value) // Met à jour la valeur de la province
                  form.setValue("city", "") // Réinitialise la ville
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre province" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {provinces.map((province) => (
                    <SelectItem key={province.value} value={province.value}>
                      {province.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Popover>
                <PopoverTrigger asChild disabled={!provinceValue}>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between pl-3 pr-2 font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value
                        ? citiesByProvinces(provinceValue).find(
                            (city) => city.name === field.value,
                          )?.name
                        : "Sélectionnez votre ville"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[672px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Rechercher une ville..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>Aucune entrée trouvée !</CommandEmpty>
                      <CommandGroup>
                        {citiesByProvinces(provinceValue).map((city, i) => (
                          <CommandItem
                            value={city.name}
                            key={i}
                            onSelect={() => {
                              form.setValue("city", city.name)
                            }}
                          >
                            {city.name}
                            <Check
                              className={cn(
                                "ml-auto",
                                city.name === field.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>Votre ville publique.</FormDescription>
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
                <Input placeholder="1234 rue Example" {...field} />
              </FormControl>
              <FormDescription>Votre adresse publique.</FormDescription>
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
  )
}
