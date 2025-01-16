// import { getPosts } from "@/server/actions/post"
// import { auth, currentUser } from "@clerk/nextjs/server"
import { DashboardSidebar } from "./dashboard-sidebar"

export const DashboardSidebarWrapper = async () => {
  // const { userId } = await auth()
  // const user = await currentUser()
  // const posts = await getPosts()

  return (
    <DashboardSidebar
    //  userId={userId} posts={posts}
    />
  )
}
