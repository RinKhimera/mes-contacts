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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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
import { useAuth } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown, LoaderCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

export const PostForm = () => {
  const { userId } = useAuth()

  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      // website: "",
      description: undefined,
      address: "",
      // province: "",
      city: "",
      postalCode: "",
      category: "",
      services: undefined,
    },
  })

  const onSubmit = async (data: z.infer<typeof postSchema>) => {
    startTransition(async () => {
      try {
        console.log(data, userId)
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
        className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de l&apos;entreprise</FormLabel>
              <FormControl>
                <Input
                  placeholder="Clinique | Restaurant | Garage John Doe"
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

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description de votre entreprise"
                  className="min-h-[100px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Une description de votre entreprise.
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
                    <SelectValue placeholder="Sélectionnez la catégorie de votre entreprise" />
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
                La catégorie de votre entreprise.
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
                Les services offerts par votre entreprise.
              </FormDescription>
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
