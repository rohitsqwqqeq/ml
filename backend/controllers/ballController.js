const Ball = require("../models/ballModel");
const Match = require("../models/matchModel");

// Task 3
const findExtraRunsPerYear = async (req, res) => {
  try {
    const { year } = req.query;
    // console.log(year, req.query);

    // Find matches for the specified year
    const matches = await Match.find({ season: year });

    // Extract match IDs for the specified year
    const matchIds = matches.map((match) => match.id);

    // Calculate extra runs per team for the specified match IDs
    const extraRunsPerTeam = await Ball.aggregate([
      {
        $match: { match_id: { $in: matchIds } },
      },
      {
        $group: {
          _id: "$batting_team",
          total_extra_runs: { $sum: "$extra_runs" },
        },
      },
    ]);
    const extraRuns = extraRunsPerTeam.map((extra)=>extra.total_extra_runs);
    const teams = extraRunsPerTeam.map((extra)=>extra._id);
    // console.log(extraRuns);
    // console.log(teams);
    return res.json({teams, extraRuns});
  } catch (error) {
    console.error("Error finding extra runs for the year:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const calculateEconomyRate = (runsConceded, overs) => {
  if (overs === 0) return 0;
  return (runsConceded / overs).toFixed(2);
};
// Taks 4
const getEconomyRateForYear = async (req, res) => {
  try {
    const { year } = req.query;
    // console.log(year, req.query);

    // Find matches for the specified year
    const matches = await Match.find({ season: year });

    // Initialize a map to store runs conceded and overs bowled for each bowler
    const bowlerData = new Map();

    // Process each match to calculate runs conceded and overs bowled for each bowler
    for (const match of matches) {
      const matchId = match.id;

      // Find balls for the match and execute the query to get an array
      const balls = await Ball.find({ match_id: matchId }).exec();

      for (const ball of balls) {
        const bowler = ball.bowler;
        const runsConceded = ball.total_runs - ball.bye_runs - ball.legbye_runs;
        const isWideOrNoBall = ball.wide_runs > 0 || ball.noball_runs > 0;

        if (bowlerData.has(bowler)) {
          const data = bowlerData.get(bowler);
          data.runsConceded += isWideOrNoBall ? 0 : runsConceded;
          data.oversBowled += isWideOrNoBall ? 0 : 1;
        } else {
          bowlerData.set(bowler, {
            runsConceded: isWideOrNoBall ? 0 : runsConceded,
            oversBowled: isWideOrNoBall ? 0 : 1,
          });
        }
      }
    }

    // Calculate economy rate for each bowler
    const economyRateData = [];
    bowlerData.forEach((value, key) => {
      const { runsConceded, oversBowled } = value;
      const economyRate = calculateEconomyRate(runsConceded, oversBowled);
      economyRateData.push({ bowler: key, economyRate });
    });

    // Sort the array by economy rate in ascending order
    economyRateData.sort((a, b) => a.economyRate - b.economyRate);

    // Get the top 10 economical bowlers
    const top10EconomicalBowlers = economyRateData.slice(0, 10);

    // console.log(top10EconomicalBowlers);
    const bowlers = top10EconomicalBowlers.map((bowler)=>bowler.bowler);
    const economyRate = top10EconomicalBowlers.map((bowler)=>bowler.economyRate)

    return res.json({bowlers, economyRate});
  } catch (error) {
    console.error("Error calculating economy rate:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};



// // Remove this function, it is for only verification
// const findExtraRunsPerMatchForYear = async (req, res) => {
//   try {
//     const { year } = req.body;

//     // Find matches for the specified year
//     const matches = await Match.find({ season: year });

//     // Extract match IDs for the specified year
//     const matchIds = matches.map((match) => match.id);

//     // Calculate extra runs per match for the specified match IDs and sort by match_id
//     const extraRunsPerMatch = await Ball.aggregate([
//       {
//         $match: { match_id: { $in: matchIds } },
//       },
//       {
//         $group: {
//           _id: { match_id: "$match_id", batting_team: "$batting_team" },
//           total_extra_runs: { $sum: "$extra_runs" },
//         },
//       },
//       {
//         $sort: { "_id.match_id": 1 }  // Sort by match_id in ascending order
//       }
//     ]);

//     return res.json(extraRunsPerMatch);
//   } catch (error) {
//     console.error("Error finding extra runs per match for the year:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };

module.exports = {findExtraRunsPerYear, getEconomyRateForYear};
