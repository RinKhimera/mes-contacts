"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useQuery } from "convex/react"
import { ImagePlus, Loader2 } from "lucide-react"
import { AddressAutofill } from "@mapbox/search-js-react"

import { api } from "@/convex/_generated/api"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { LocationMap } from "@/components/shared/location-map"
import { ImageUpload } from "@/components/shared/image-upload"
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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { categoriesServices, provinces } from "@/constants"
import { MapboxResponse } from "@/types"

const postFormSchema = z.object({
  ownerType: z.enum(["user", "organization"]),
  userId: z.string().optional(),
  organizationId: z.string().optional(),
  businessName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  category: z.string().min(1, "Veuillez sélectionner une catégorie"),
  description: z.string().optional(),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
  email: z.string().email("Email invalide"),
  website: z.string().url("URL invalide").optional().or(z.literal("")),
  address: z.string().min(1, "Adresse requise"),
  city: z.string().min(1, "Ville requise"),
  province: z.string().min(1, "Province requise"),
  postalCode: z.string().min(1, "Code postal requis"),
  longitude: z.number().optional(),
  latitude: z.number().optional(),
}).refine((data) => {
  if (data.ownerType === "user") return !!data.userId
  if (data.ownerType === "organization") return !!data.organizationId
  return false
}, {
  message: "Veuillez sélectionner un propriétaire",
  path: ["userId"],
})

type PostFormValues = z.infer<typeof postFormSchema>

interface PostFormProps {
  post?: Doc<"posts">
  postId?: Id<"posts">
  onSubmit: (values: PostFormValues) => Promise<void>
  isSubmitting: boolean
}

export function PostForm({ post, postId, onSubmit, isSubmitting }: PostFormProps) {
  const users = useQuery(api.users.list)
  const organizations = useQuery(api.organizations.list)
  const existingMedia = useQuery(
    api.media.getByPost,
    postId ? { postId } : "skip"
  )

  // Transform media to ImageUpload format
  const existingImages = existingMedia?.map((m) => ({
    id: m._id,
    url: m.url,
    storagePath: m.storagePath,
    order: m.order,
  })) || []

  // Build form values from post if editing
  const postValues = post
    ? {
        ownerType: (post.organizationId ? "organization" : "user") as "user" | "organization",
        userId: post.userId || "",
        organizationId: post.organizationId || "",
        businessName: post.businessName,
        category: post.category,
        description: post.description || "",
        phone: post.phone,
        email: post.email,
        website: post.website || "",
        address: post.address,
        city: post.city,
        province: post.province,
        postalCode: post.postalCode,
        longitude: post.geo?.longitude,
        latitude: post.geo?.latitude,
      }
    : undefined

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      ownerType: "user",
      userId: "",
      organizationId: "",
      businessName: "",
      category: "",
      description: "",
      phone: "",
      email: "",
      website: "",
      address: "",
      city: "",
      province: "",
      postalCode: "",
      longitude: undefined,
      latitude: undefined,
    },
  })

  // Track if we've synced with post data (React pattern: sync during render)
  const [syncedPostId, setSyncedPostId] = useState<string | undefined>(undefined)
  if (post && post._id !== syncedPostId) {
    setSyncedPostId(post._id)
    form.reset(postValues)
  }

  // eslint-disable-next-line react-hooks/incompatible-library -- React Hook Form's watch() is designed this way
  const ownerType = form.watch("ownerType")

  const handleAddressSelect = (address: MapboxResponse) => {
    const features = address.features[0]
    form.setValue("address", features.properties.full_address)
    form.setValue("city", features.properties.address_level2)
    form.setValue("province", features.properties.region_code)
    form.setValue("postalCode", features.properties.postcode)
    form.setValue("longitude", features.geometry.coordinates[0])
    form.setValue("latitude", features.geometry.coordinates[1])
  }

  const handleSubmit = async (values: PostFormValues) => {
    await onSubmit(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {/* Owner Selection - only for new posts */}
        {!post && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Propriétaire de l&apos;annonce</h3>
            <FormField
              control={form.control}
              name="ownerType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de propriétaire</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="user" id="user" />
                        <Label htmlFor="user">Utilisateur</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="organization" id="organization" />
                        <Label htmlFor="organization">Organisation</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {ownerType === "user" && (
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Utilisateur propriétaire *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un utilisateur" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users?.map((user) => (
                          <SelectItem key={user._id} value={user._id}>
                            {user.name} ({user.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {ownerType === "organization" && (
              <FormField
                control={form.control}
                name="organizationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organisation propriétaire *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une organisation" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {organizations?.map((org) => (
                          <SelectItem key={org._id} value={org._id}>
                            {org.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        )}

        {/* Business Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Informations commerciales</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom commercial *</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Services Inc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catégorie *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoriesServices.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description du service..."
                    className="min-h-[120px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Contact</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone *</FormLabel>
                  <FormControl>
                    <Input placeholder="514-555-0123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="contact@acme.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Site web</FormLabel>
                <FormControl>
                  <Input placeholder="https://www.acme.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Address */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Adresse</h3>
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse *</FormLabel>
                <FormControl>
                  <AddressAutofill
                    accessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ""}
                    // @ts-expect-error - Mapbox types mismatch
                    onRetrieve={handleAddressSelect}
                    options={{ country: "ca" }}
                  >
                    <Input placeholder="123 Rue Principale" autoComplete="street-address" {...field} />
                  </AddressAutofill>
                </FormControl>
                <FormDescription>
                  Commencez à taper pour l&apos;autocomplétion
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ville *</FormLabel>
                  <FormControl>
                    <Input placeholder="Montréal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Province *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {provinces.map((prov) => (
                        <SelectItem key={prov.value} value={prov.value}>
                          {prov.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code postal *</FormLabel>
                  <FormControl>
                    <Input placeholder="H2X 1Y4" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Map Preview */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Apercu de la localisation</h3>
          <LocationMap
            longitude={form.watch("longitude")}
            latitude={form.watch("latitude")}
            businessName={form.watch("businessName")}
            variant="preview"
            showLabel={false}
          />
        </div>

        {/* Images Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Images</h3>
          {postId ? (
            <ImageUpload
              postId={postId}
              existingImages={existingImages}
              maxImages={5}
              disabled={isSubmitting}
            />
          ) : (
            <div className="flex flex-col items-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/25 p-6">
              <ImagePlus className="size-8 text-muted-foreground/50" />
              <p className="text-center text-sm text-muted-foreground">
                Enregistrez l&apos;annonce pour ajouter des images
              </p>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            {post ? "Enregistrer" : "Créer l'annonce"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
