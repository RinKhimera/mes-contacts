import { UserProfile } from "@clerk/nextjs"

const UserProfilePage = () => {
  return (
    <div className="my-5 ml-10">
      <UserProfile path="/my-profile" />
    </div>
  )
}

export default UserProfilePage
