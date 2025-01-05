import { SiteHeader } from "@/components/shared/site-header"
import { UserProfile } from "@clerk/nextjs"

const UserProfilePage = () => {
  return (
    <div>
      <SiteHeader />

      <div className="my-4 flex items-center justify-center">
        <UserProfile path="/my-profile" />
      </div>
    </div>
  )
}

export default UserProfilePage
