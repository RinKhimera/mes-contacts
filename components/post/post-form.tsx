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
import { postSchema } from "@/schemas/post"
import { createPost } from "@/server/actions/post"
import { useUploadThing } from "@/utils/uploadthing"
import { useAuth } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown, LoaderCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

export const PostForm = () => {
  const { userId } = useAuth()

  const router = useRouter()

  const [isPending, startTransition] = useTransition()

  const [businessNameStatus, setBusinessNameStatus] = useState<
    string | undefined
  >("Non")

  const [businessImageStatus, setbusinessImageStatus] = useState<
    string | undefined
  >("Non")

  const [files, setFiles] = useState<File[]>([])

  const handleBusinessNameChange = (value: string) => {
    setBusinessNameStatus(value)
    // Reset form fields when radio selection changes
    form.setValue("businessName", undefined)
  }

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
      alert("error occurred while uploading")
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
      businessName: undefined,
      businessImageUrl: undefined,
      category: "",
      description: undefined,
      services: undefined,
      phone: "",
      email: "",
      website: undefined,
      address: "",
      province: "",
      city: "",
      postalCode: "",
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

        console.log("Form data with uploaded file:", data, userId)
        if (!userId) throw new Error("You must be logged in to create a post")

        await createPost({ data, userId })
        router.push("/")
        // toast.success("La publication a été ajoutée à vos collections")
      } catch (error) {
        console.error(error)
        toast.error("Une erreur s'est produite !", {
          description:
            "Veuillez vérifier votre connexion internet et réessayer",
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
        <h2 className="text-xl">Informations sur l&apos;entreprise</h2>

        <Label>Avez-vous un nom d&apos;entreprise ?</Label>
        <RadioGroup
          defaultValue={businessNameStatus}
          onValueChange={handleBusinessNameChange}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Oui" id="yesName" />
            <Label htmlFor="yesName">Oui</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Non" id="noName" />
            <Label htmlFor="noName">Non</Label>
          </div>
        </RadioGroup>

        {businessNameStatus === "Oui" && (
          <FormField
            control={form.control}
            name="businessName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom de l&apos;entreprise</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Clinique | Restaurant | Garage John Doe"
                    required
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Il s&apos;agit de votre nom d&apos;affichage public.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Label>Avez-vous un logo ?</Label>
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

        {businessImageStatus === "Oui" && (
          <FormField
            control={form.control}
            name="businessImageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="picture">Logo d&apos;entreprise</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    required
                    id="picture"
                    type="file"
                    onChange={handleFileChange}
                  />
                </FormControl>
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
                    <SelectValue placeholder="Sélectionnez la catégorie de votre entreprise ou activité" />
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
                La catégorie de votre entreprise ou activité.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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
          name="services"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Services</FormLabel>
              <FormControl>
                <Input
                  placeholder="Service 1, Service 2, Service 3"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Les services que vous ou votre entreprise offrez.
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
          {isPending ? <LoaderCircle className="animate-spin" /> : "Soumettre"}
        </Button>
      </form>
    </Form>
  )
}
