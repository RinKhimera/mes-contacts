import { UserProfile } from "@clerk/nextjs"

const UserProfilePage = () => {
  return (
    <div className="mx-auto max-w-6xl px-4 md:px-10 lg:px-20 xl:px-0">
      <div className="my-4 flex items-center justify-center">
        <UserProfile path="/my-profile" />
      </div>
    </div>
  )
}

export default UserProfilePage
