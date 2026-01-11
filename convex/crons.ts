import { cronJobs } from "convex/server"
import { internal } from "./_generated/api"

const crons = cronJobs()

/**
 * Job quotidien pour expirer les posts dont la période de publication est terminée
 * S'exécute à 5h UTC (00h EST / 01h EDT)
 */
crons.daily(
  "expire-posts",
  { hourUTC: 5, minuteUTC: 0 },
  internal.posts.expireOldPosts
)

export default crons
