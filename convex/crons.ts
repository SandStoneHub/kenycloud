import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "delete any old files from trash",
  { minutes: 10080 },
  internal.files.deleteAllFiles,
);

export default crons;