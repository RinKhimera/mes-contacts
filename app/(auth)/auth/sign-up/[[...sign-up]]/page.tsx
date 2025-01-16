import backgroundSignup from "@/public/images/background-signup.jpg"
import { SignUp } from "@clerk/nextjs"
import { Loader } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function SignUpPage() {
  return (
    <>
      <div className="container relative grid h-screen p-5 lg:max-w-none lg:grid-cols-2">
        {/* Côté gauche desktop */}
        <div className="relative hidden h-full flex-col p-10 text-white lg:flex">
          {/* <div className="absolute inset-0 bg-zinc-900" /> */}
          <Image
            src={backgroundSignup}
            alt="backgroundSignup image"
            placeholder="blur"
            style={{ objectFit: "cover" }}
            quality={100}
            className="absolute inset-0 rounded-xl bg-zinc-900"
            priority
            fill
          />

          <Link
            className="relative z-20 flex items-center text-3xl font-semibold"
            href="/"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 mt-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            mc.ca
          </Link>

          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &rdquo;Je ne m&apos;attendais pas à une telle efficacité. En
                quelques minutes, j’ai pu trouver un professionnel qui a réglé
                mon problème rapidement.&rdquo;
              </p>
              <footer className="text-sm">Léandra Njoya</footer>
            </blockquote>
          </div>
        </div>

        {/* Côté droit desktop ou version mobile */}
        <div className="lg:p-0">
          <div className="flex h-full w-full flex-col items-center justify-center pb-4">
            <div className="relative z-20 flex items-center text-3xl font-semibold lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 mt-2 h-6 w-6"
              >
                <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
              </svg>
              mc.ca
            </div>

            <h1 className="mb-5 max-w-lg text-center text-3xl font-medium tracking-tight max-lg:mt-4 lg:text-4xl">
              <span className="text-primary">Nouvel utilisateur ?</span>{" "}
              Rejoignez notre communauté et trouvez tout ce dont vous avez
              besoin.
            </h1>

            {/* Spinner en dessous du formulaire de Clerk car ce dernier prend du temps à charger */}
            <div className="relative flex min-h-[535px] w-11/12 justify-center">
              <div className="absolute inset-0 flex items-center justify-center text-primary">
                <Loader size={52} className="animate-spin" />
              </div>
              <SignUp path="/auth/sign-up" forceRedirectUrl={"/dashboard"} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
