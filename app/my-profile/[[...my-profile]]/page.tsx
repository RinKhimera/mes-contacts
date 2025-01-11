import { SiteHeader } from "@/components/shared/site-header"
import { UserProfile } from "@clerk/nextjs"
import { auth, currentUser } from "@clerk/nextjs/server"

const UserProfilePage = async () => {
  const { userId } = await auth()
  const user = await currentUser()

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-10 lg:px-20 xl:px-0">
      <SiteHeader user={user} userId={userId} />

      <div className="my-4 flex items-center justify-center">
        <UserProfile path="/my-profile" />
      </div>
    </div>
  )
}

export default UserProfilePage
