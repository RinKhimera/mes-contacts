"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useQuery } from "convex/react"
import { Loader2 } from "lucide-react"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
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
import { Switch } from "@/components/ui/switch"

const paymentFormSchema = z.object({
  postId: z.string().min(1, "Veuillez sélectionner une annonce"),
  amount: z.coerce.number().min(1, "Le montant doit être supérieur à 0"),
  method: z.enum(["CASH", "E_TRANSFER", "VIREMENT", "CARD", "OTHER"]),
  durationDays: z.coerce.number().min(1, "La durée doit être supérieure à 0"),
  notes: z.string().optional(),
  externalReference: z.string().optional(),
  autoPublish: z.boolean().default(true),
})

type PaymentFormValues = z.infer<typeof paymentFormSchema>

interface PaymentFormProps {
  defaultPostId?: Id<"posts">
  onSubmit: (values: PaymentFormValues) => Promise<void>
  isSubmitting: boolean
}

const paymentMethods = [
  { label: "Virement Interac", value: "E_TRANSFER" },
  { label: "Comptant", value: "CASH" },
  { label: "Virement bancaire", value: "VIREMENT" },
  { label: "Carte", value: "CARD" },
  { label: "Autre", value: "OTHER" },
]

const durationOptions = [
  { label: "30 jours", value: 30 },
  { label: "60 jours", value: 60 },
  { label: "90 jours", value: 90 },
  { label: "180 jours", value: 180 },
  { label: "365 jours", value: 365 },
]

export function PaymentForm({
  defaultPostId,
  onSubmit,
  isSubmitting,
}: PaymentFormProps) {
  const posts = useQuery(api.posts.list, { limit: 1000 })

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      postId: defaultPostId || "",
      amount: 50,
      method: "E_TRANSFER",
      durationDays: 30,
      notes: "",
      externalReference: "",
      autoPublish: true,
    },
  })

  const handleSubmit = async (values: PaymentFormValues) => {
    await onSubmit(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Post Selection */}
        <FormField
          control={form.control}
          name="postId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Annonce *</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!!defaultPostId}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une annonce" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {posts?.map((post) => (
                    <SelectItem key={post._id} value={post._id}>
                      {post.businessName} ({post.category})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Amount */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Montant (CAD) *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      className="pl-7"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Payment Method */}
          <FormField
            control={form.control}
            name="method"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Méthode de paiement *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Duration */}
          <FormField
            control={form.control}
            name="durationDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Durée de publication *</FormLabel>
                <Select
                  onValueChange={(v) => field.onChange(Number(v))}
                  value={String(field.value)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {durationOptions.map((option) => (
                      <SelectItem key={option.value} value={String(option.value)}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* External Reference */}
          <FormField
            control={form.control}
            name="externalReference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Référence externe</FormLabel>
                <FormControl>
                  <Input placeholder="Numéro de transaction..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Notes internes..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Auto Publish */}
        <FormField
          control={form.control}
          name="autoPublish"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Publication automatique
                </FormLabel>
                <FormDescription>
                  Publier automatiquement l&apos;annonce après l&apos;enregistrement du
                  paiement
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            Enregistrer le paiement
          </Button>
        </div>
      </form>
    </Form>
  )
}
