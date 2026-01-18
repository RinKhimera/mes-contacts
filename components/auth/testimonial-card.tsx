"use client"

import { motion } from "framer-motion"
import { fadeUp, easeOutTransition } from "@/lib/animations"
import { Quote, Star } from "lucide-react"

interface TestimonialCardProps {
  quote: string
  author: string
  role: string
  rating?: number
  delay?: number
}

export function TestimonialCard({
  quote,
  author,
  role,
  rating = 5,
  delay = 0.4,
}: TestimonialCardProps) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      transition={{ ...easeOutTransition, delay }}
      className="glass relative overflow-hidden rounded-2xl border border-white/10 p-6 shadow-xl"
    >
      {/* Quote icon décoratif */}
      <div className="absolute -right-2 -top-2 text-primary/10">
        <Quote className="h-20 w-20" strokeWidth={1} />
      </div>

      {/* Rating étoiles */}
      {rating > 0 && (
        <div className="mb-3 flex gap-0.5">
          {Array.from({ length: rating }).map((_, i) => (
            <Star
              key={i}
              className="h-4 w-4 fill-primary text-primary"
              strokeWidth={0}
            />
          ))}
        </div>
      )}

      {/* Citation */}
      <blockquote className="relative z-10 mb-4">
        <p className="font-body text-sm leading-relaxed text-foreground/90 italic md:text-base">
          &ldquo;{quote}&rdquo;
        </p>
      </blockquote>

      {/* Auteur */}
      <footer className="relative z-10 flex items-center gap-3">
        {/* Avatar placeholder */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
          {author
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)}
        </div>
        <div>
          <p className="font-display text-sm font-semibold text-foreground">
            {author}
          </p>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
      </footer>
    </motion.div>
  )
}
