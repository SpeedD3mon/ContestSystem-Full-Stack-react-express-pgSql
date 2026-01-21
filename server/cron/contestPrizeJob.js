import cron from "node-cron";
import * as contestModel from "../models/contestModel.js";
import * as leaderboardModel from "../models/leaderboardModel.js";
import * as prizeModel from "../models/prizeModel.js";

export const startContestPrizeCron = () => {
  // Runs every minute
  cron.schedule("* * * * *", async () => {
    console.log("⏰ Checking ended contests...");

    try {
      const endedContests = await contestModel.getEndedUnprocessedContests();

      for (const contest of endedContests) {
        console.log(`🏁 Processing contest: ${contest.name}`);

        // 1. Get leaderboard for this contest
        const winners = await leaderboardModel.getLeaderboardByContest(contest.contest_id);

        if (!winners.length) {
          console.log("⚠️ No attempts for contest:", contest.name);
          await contestModel.markContestProcessed(contest.contest_id);
          continue;
        }

        // 2. Assign prizes
        if (winners[0]) await prizeModel.assignPrize(winners[0].user_id, contest.contest_id, "🥇 Gold");
        if (winners[1]) await prizeModel.assignPrize(winners[1].user_id, contest.contest_id, "🥈 Silver");
        if (winners[2]) await prizeModel.assignPrize(winners[2].user_id, contest.contest_id, "🥉 Bronze");

        // 3. Mark contest as processed
        await contestModel.markContestProcessed(contest.contest_id);
      }
    } catch (err) {
      console.error("❌ Cron error:", err.message);
    }
  });
};
