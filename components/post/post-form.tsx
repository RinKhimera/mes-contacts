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
import { useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"

export const PostForm = () => {
  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      name: "",
      phone: "",
      // email: "",
      // website: "",
      description: "",
      address: "",
      // city: "",
      // province: "",
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

  useEffect(() => {
    // Deselect the city value when the province changes
    if (form.getValues("city")) {
      form.setValue("city", "") // Clear the city selection
    }
  }, [provinceValue, form])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <Input
                  placeholder="Description de votre entreprise"
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <Select
                onValueChange={field.onChange}
                value={field.value || undefined} // Ensure the field value is reset
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
              </Select>
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
