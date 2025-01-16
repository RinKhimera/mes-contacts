import { UserProfile } from "@clerk/nextjs"

const UserAccountPage = () => {
  return (
    <div className="p-4 pt-0">
      <UserProfile path="/account" />
    </div>
  )
}

export default UserAccountPage
