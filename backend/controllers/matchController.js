const Match = require("../models/matchModel");

// Task 1 
const matchesPerYear = async (req, res) => {
  try {
    const matchCounts = await Match.aggregate([
      {
        $group: {
          _id: '$season',
          count: { $sum: 1 }
        }
      }
    ]);

    // Sort matchCounts based on the year (_id)
    matchCounts.sort((a, b) => a._id - b._id);

    const years = matchCounts.map(matchCount => matchCount._id);
    const numMatches = matchCounts.map(matchCount => matchCount.count);

    return res.json({ years, numMatches });
  } catch (error) {
    console.error('Error counting matches per year:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


// Task 2 
const countWonMatches = async (req, res) => {
  try {
    const winnerCounts = await Match.aggregate([
      {
        $match: {
          winner: { $ne: null }  // This is for filtering the null values
        }
      },
      {
        $group: {
          _id: '$winner',
          count: { $sum: 1 }
        }
      }
    ]);

    // winnerCounts.forEach(winnerCount => {
    //   console.log(`${winnerCount._id}: ${winnerCount.count} times`);
    // });

    const teams = winnerCounts.map(winnerCount => winnerCount._id);
    const matchesWon = winnerCounts.map(winnerCount => winnerCount.count);

    return res.json({teams, matchesWon}); 
  } catch (error) {
    console.error('Error counting winner occurrences:', error);
    throw error; 
  }
}

// Task 22
// const getMatchesWonPerYear = async (req, res) => {
//   try {
//     const matchesWonPerYear = await Match.aggregate([
//       {
//         $group: {
//           _id: { year: '$season', team: '$winner' },
//           count: { $sum: 1 }
//         }
//       },
//       {
//         $sort: { '_id.year': 1, count: -1 }
//       },
//       {
//         $group: {
//           _id: '$_id.year',
//           matches: {
//             $push: {
//               team: '$_id.team',
//               count: '$count'
//             }
//           }
//         }
//       },
//       {
//         $project: {
//           _id: 0,
//           year: '$_id',
//           matches: 1
//         }
//       }
//     ]);

//     return res.json(matchesWonPerYear);
//   } catch (error) {
//     throw new Error('Error getting matches won per year: ' + error);
//   }
// };

// In ascending order of year and Team names
// const getMatchesWonPerYear = async (req, res) => {
  //   try {
    //     const matchesWonPerYear = await Match.aggregate([
      //       {
        //         $group: {
          //           _id: { year: '$season', team: '$winner' },
          //           count: { $sum: 1 }
          //         }
//       },
//       {
//         $sort: { '_id.year': 1, '_id.team': 1 }
//       },
//       {
  //         $group: {
    //           _id: { year: '$_id.year' },
    //           matches: {
      //             $push: {
        //               team: '$_id.team',
        //               count: '$count'
        //             }
        //           }
        //         }
        //       },
        //       {
          //         $project: {
            //           _id: 0,
            //           year: '$_id.year',
            //           matches: 1
            //         }
            //       },
            //       {
              //         $sort: { year: 1 }
//       }
//     ]);

//     return res.json(matchesWonPerYear);
//   } catch (error) {
//     throw new Error('Error getting matches won per year: ' + error);
//   }
// };

// ====================================================================================================================
// Task 22
const getMatchesWonPerYear = async (req, res) => {
  try {
    // Get the list of all unique team names
    const allTeams = await Match.distinct('winner');

    // Create an aggregation pipeline to calculate matches won for each team in each year
    const matchesWonPerYear = await Match.aggregate([
      {
        $group: {
          _id: { year: '$season', team: '$winner' },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: { team: '$_id.team', year: '$_id.year' },
          count: { $sum: '$count' }
        }
      },
      {
        $group: {
          _id: '$_id.year',
          matches: {
            $push: {
              team: '$_id.team',
              count: '$count'
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          year: '$_id',
          matches: 1
        }
      },
      {
        $sort: { year: 1 }
      }
    ]);

    // console.log(matchesWonPerYear);

    // Add zero count for teams that didn't win any matches in a year
    const matchesWonPerYearWithZeroCount = matchesWonPerYear.map((entry) => ({
      year: entry.year,
      matches: allTeams.map((team) => ({
        team,
        count: (entry.matches.find((match) => match.team === team) || { count: 0 }).count
      }))
    }));
    const years = []
    const matchesWon = []

    matchesWonPerYearWithZeroCount.map((matches)=>{
      years.push(matches.year);
      const matchWon = []
      matches.matches.map((c)=>{
        matchWon.push(c.count);
      })
      matchesWon.push(matchWon);
    })

    // console.log(allTeams);
    // console.log(years);
    // console.log(matchesWon);

    return res.json({allTeams, years, matchesWon});
  } catch (error) {
    throw new Error('Error getting matches won per year: ' + error);
  }
};

// ====================================================================================================================





// Task 5
const getMatchesPlayedVsWon = async (req, res) => {
  try {
    const { year } = req.query;

    // Fetch matches for the specified year
    const matches = await Match.find({ season: year });

    // Initialize arrays to store team names, played matches, and won matches
    const teams = [];
    const playedMatches = [];
    const wonMatches = [];

    // Process each match to count matches played and matches won for each team
    matches.forEach((match) => {
      // Team 1
      if (!teams.includes(match.team1)) {
        teams.push(match.team1);
        playedMatches.push(1);
        wonMatches.push(match.winner === match.team1 ? 1 : 0);
      } else {
        const index = teams.indexOf(match.team1);
        playedMatches[index]++;
        if (match.winner === match.team1) {
          wonMatches[index]++;
        }
      }

      // Team 2
      if (!teams.includes(match.team2)) {
        teams.push(match.team2);
        playedMatches.push(1);
        wonMatches.push(match.winner === match.team2 ? 1 : 0);
      } else {
        const index = teams.indexOf(match.team2);
        playedMatches[index]++;
        if (match.winner === match.team2) {
          wonMatches[index]++;
        }
      }
    });

    const result = {
      teams,
      playedMatches,
      wonMatches,
    };
    // console.log(result);
    return res.json(result);
  } catch (error) {
    console.error("Error finding matches played vs won:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUniqueYears = async (req, res) => {
  try {
    const uniqueYears = await Match.distinct('season');
    return res.json({uniqueYears});
  } catch (error) {
    console.error('Error fetching unique years:', error);
    throw new Error('Error fetching unique years');
  }
};


const func = async (req, res) => {
  try {
    return res.json({ data : "This is func" });
  } catch (ex) {
    next(ex);
  }
};

module.exports = { matchesPerYear, countWonMatches, getMatchesPlayedVsWon, getMatchesWonPerYear, getUniqueYears};