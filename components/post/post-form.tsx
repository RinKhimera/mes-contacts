"use client"

import { Button } from "@/components/ui/button"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { provinces } from "@/constants"
import { citiesByProvinces } from "@/hooks"
import { postSchema } from "@/schemas/post"
import { zodResolver } from "@hookform/resolvers/zod"
// import { useEffect } from "react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"
import { Textarea } from "../ui/textarea"

export const PostForm = () => {
  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      website: "",
      description: "",
      address: "",
      city: "",
      province: "",
      postalCode: "",
      category: "",
      services: [],
    },
  })

  const onSubmit = (data: z.infer<typeof postSchema>) => {
    console.log(data)
  }

  const provinceValue = useWatch({
    control: form.control,
    name: "province",
  })

  const cityValue = useWatch({
    control: form.control,
    name: "city",
  })

  console.log("City value:", cityValue)

  // useEffect(() => {
  //   // Reset the city value when the province changes
  //   form.setValue("city", "")
  // }, [provinceValue, form])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mb-4 max-w-2xl space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
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
                <Input placeholder="https://www.example.com" {...field} />
              </FormControl>
              <FormDescription>Votre site web public.</FormDescription>
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
            <FormItem className="flex w-full flex-col">
              <FormLabel>Ville</FormLabel>
              {/* <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={!provinceValue}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre ville" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {citiesByProvinces(provinceValue).map((city, index) => (
                    <SelectItem key={index} value={city.name}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select> */}
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
                      <CommandEmpty>Aucune entrée trouvée.</CommandEmpty>
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
              <FormControl>
                <Input placeholder="Restaurant" {...field} />
              </FormControl>
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

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
