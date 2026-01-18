"use client"

import { SignUp } from "@clerk/nextjs"
import { motion } from "framer-motion"
import { Building2, Loader, UserPlus } from "lucide-react"
import Link from "next/link"
import { AuthVisualCanvas } from "@/components/auth/auth-visual-canvas"
import {
  fadeUp,
  scaleIn,
  staggerContainer,
  easeOutTransition,
  float,
  floatDelayed,
} from "@/lib/animations"

export default function SignUpPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Background decorations */}
      <div className="topo-pattern fixed inset-0 opacity-40" />
      <div className="noise-overlay fixed inset-0" />

      {/* Gradient orbes décoratifs pour le côté droit */}
      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate="visible"
        transition={{ ...easeOutTransition, delay: 0.3 }}
        className="fixed -right-32 top-1/4 h-96 w-96 rounded-full bg-accent/10 blur-3xl"
      />
      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate="visible"
        transition={{ ...easeOutTransition, delay: 0.4 }}
        className="fixed -right-20 bottom-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="container relative grid min-h-screen gap-0 p-4 lg:max-w-none lg:grid-cols-2 lg:p-6">
        {/* Canvas visuel - Desktop uniquement */}
        <AuthVisualCanvas variant="signup" />

        {/* Formulaire */}
        <div className="relative flex flex-col items-center justify-center px-4 py-8 lg:px-8">
          {/* Dots décoratifs flottants */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            className="absolute left-12 top-24 hidden lg:block"
          >
            <motion.div
              variants={float}
              initial="initial"
              animate="animate"
              className="h-3 w-3 rounded-full bg-accent/40"
            />
          </motion.div>
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="absolute right-20 top-36 hidden lg:block"
          >
            <motion.div
              variants={floatDelayed}
              initial="initial"
              animate="animate"
              className="h-2 w-2 rounded-full bg-primary/50"
            />
          </motion.div>
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="absolute bottom-28 left-16 hidden lg:block"
          >
            <motion.div
              variants={float}
              initial="initial"
              animate="animate"
              className="h-4 w-4 rounded-full bg-accent/30"
            />
          </motion.div>

          {/* Forme décorative abstraite */}
          <motion.svg
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
            className="absolute -left-4 bottom-1/3 hidden h-24 w-24 text-accent/5 lg:block"
            viewBox="0 0 100 100"
            fill="currentColor"
          >
            <motion.path
              variants={floatDelayed}
              initial="initial"
              animate="animate"
              d="M50 10 L90 90 L10 90 Z"
            />
          </motion.svg>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="relative z-10 w-full max-w-md"
          >
            {/* Logo mobile */}
            <motion.div
              variants={fadeUp}
              className="mb-8 flex justify-center lg:hidden"
            >
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/25">
                  <Building2 className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-display text-xl font-semibold text-foreground">
                  Mescontacts.ca
                </span>
              </Link>
            </motion.div>

            {/* Card conteneur avec glass effect */}
            <motion.div
              variants={fadeUp}
              transition={{ ...easeOutTransition, delay: 0.1 }}
              className="glass rounded-3xl border border-border/50 p-8 shadow-2xl shadow-accent/5"
            >
              {/* Badge décoratif */}
              <motion.div
                variants={scaleIn}
                className="mb-6 flex justify-center"
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-sm text-accent">
                  <UserPlus className="h-4 w-4" />
                  <span>Nouveau membre</span>
                </div>
              </motion.div>

              {/* Heading */}
              <div className="mb-6 text-center">
                <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
                  <span className="text-gradient">Créez votre compte</span>
                </h1>
                <p className="mt-3 text-sm text-muted-foreground">
                  Rejoignez notre communauté et trouvez les meilleurs
                  professionnels près de chez vous.
                </p>
              </div>

              {/* Clerk SignUp Form */}
              <div className="relative flex w-full justify-center">
                {/* Loading spinner overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader className="h-8 w-8 animate-spin text-primary/40" />
                </div>

                {/* Clerk component */}
                <SignUp path="/auth/sign-up" forceRedirectUrl="/admin" />
              </div>
            </motion.div>

            {/* Lien vers connexion */}
            <motion.p
              variants={fadeUp}
              transition={{ ...easeOutTransition, delay: 0.3 }}
              className="mt-6 text-center text-sm text-muted-foreground"
            >
              Déjà un compte ?{" "}
              <Link
                href="/auth/sign-in"
                className="font-medium text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
              >
                Se connecter
              </Link>
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
