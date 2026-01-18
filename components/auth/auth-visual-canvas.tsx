"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Building2 } from "lucide-react"
import {
  fadeUp,
  scaleIn,
  float,
  floatDelayed,
  scatteredDots,
  staggerContainerFast,
  easeOutTransition,
} from "@/lib/animations"
import { TestimonialCard } from "./testimonial-card"

interface AuthVisualCanvasProps {
  variant: "signin" | "signup"
}

// Données des témoignages
const testimonials = {
  signin: {
    quote:
      "Des informations toujours claires, des contacts fiables et une interface agréable. C'est une ressource indispensable pour moi.",
    author: "Vanessa Elonguele",
    role: "Entrepreneure",
  },
  signup: {
    quote:
      "En quelques minutes, j'ai pu trouver un professionnel qui a réglé mon problème rapidement. Efficacité remarquable !",
    author: "Léandra Njoya",
    role: "Designer",
  },
}

// Positions des dots de connexion
const dots = [
  { x: "15%", y: "20%", size: 6 },
  { x: "75%", y: "15%", size: 4 },
  { x: "85%", y: "35%", size: 8 },
  { x: "25%", y: "45%", size: 5 },
  { x: "60%", y: "50%", size: 6 },
  { x: "10%", y: "65%", size: 4 },
  { x: "45%", y: "70%", size: 7 },
  { x: "80%", y: "60%", size: 5 },
  { x: "35%", y: "25%", size: 4 },
  { x: "70%", y: "75%", size: 6 },
  { x: "20%", y: "80%", size: 5 },
  { x: "55%", y: "30%", size: 4 },
]

// Lignes de connexion entre dots
const connectionLines = [
  { x1: "15%", y1: "20%", x2: "35%", y2: "25%" },
  { x1: "35%", y1: "25%", x2: "60%", y2: "50%" },
  { x1: "75%", y1: "15%", x2: "85%", y2: "35%" },
  { x1: "85%", y1: "35%", x2: "80%", y2: "60%" },
  { x1: "25%", y1: "45%", x2: "45%", y2: "70%" },
  { x1: "60%", y1: "50%", x2: "70%", y2: "75%" },
]

export function AuthVisualCanvas({ variant }: AuthVisualCanvasProps) {
  const testimonial = testimonials[variant]

  return (
    <div className="relative hidden h-full flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/20 to-accent/10 p-8 lg:flex">
      {/* Pattern topographique */}
      <div className="topo-pattern absolute inset-0 opacity-60" />

      {/* Noise overlay */}
      <div className="noise-overlay absolute inset-0" />

      {/* Gradient orbes décoratifs */}
      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate="visible"
        transition={{ ...easeOutTransition, delay: 0.2 }}
        className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/20 blur-3xl"
      />
      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate="visible"
        transition={{ ...easeOutTransition, delay: 0.3 }}
        className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-accent/15 blur-3xl"
      />

      {/* Forme organique 1 - inspiration érable abstraite */}
      <motion.svg
        variants={scaleIn}
        initial="hidden"
        animate="visible"
        transition={{ ...easeOutTransition, delay: 0.1 }}
        className="absolute right-8 top-24 h-48 w-48 text-primary/15"
        viewBox="0 0 200 200"
        fill="currentColor"
      >
        <motion.path
          variants={float}
          initial="initial"
          animate="animate"
          d="M100 10 C120 30, 150 40, 170 70 C180 90, 175 120, 160 140 C145 160, 120 175, 100 180 C80 175, 55 160, 40 140 C25 120, 20 90, 30 70 C50 40, 80 30, 100 10 Z"
        />
      </motion.svg>

      {/* Forme organique 2 */}
      <motion.svg
        variants={scaleIn}
        initial="hidden"
        animate="visible"
        transition={{ ...easeOutTransition, delay: 0.2 }}
        className="absolute bottom-40 left-4 h-32 w-32 text-accent/20"
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        <motion.ellipse
          variants={floatDelayed}
          initial="initial"
          animate="animate"
          cx="50"
          cy="50"
          rx="45"
          ry="35"
          transform="rotate(-15 50 50)"
        />
      </motion.svg>

      {/* Lignes de connexion SVG */}
      <svg className="absolute inset-0 h-full w-full">
        {connectionLines.map((line, i) => (
          <motion.line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="currentColor"
            strokeWidth="1"
            className="text-primary/10"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: { delay: 0.5 + i * 0.1, duration: 0.8 },
              opacity: { delay: 0.5 + i * 0.1, duration: 0.3 },
            }}
          />
        ))}
      </svg>

      {/* Dots de connexion */}
      <motion.div
        variants={staggerContainerFast}
        initial="hidden"
        animate="visible"
        className="absolute inset-0"
      >
        {dots.map((dot, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={scatteredDots}
            className="absolute rounded-full bg-primary"
            style={{
              left: dot.x,
              top: dot.y,
              width: dot.size,
              height: dot.size,
            }}
          />
        ))}
      </motion.div>

      {/* Logo */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="relative z-20"
      >
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-semibold text-foreground">
            Mescontacts.ca
          </span>
        </Link>
      </motion.div>

      {/* Espace flexible */}
      <div className="flex-1" />

      {/* Card témoignage */}
      <div className="relative z-20 max-w-sm">
        <TestimonialCard
          quote={testimonial.quote}
          author={testimonial.author}
          role={testimonial.role}
          delay={0.5}
        />
      </div>
    </div>
  )
}
