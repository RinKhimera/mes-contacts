// import Image from "next/image"

import { SiteHeader } from "@/components/shared/site-header"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div>
      <SiteHeader />
      <Button>Click me</Button>
      <div>Hello Contacts</div>
    </div>
  )
}
