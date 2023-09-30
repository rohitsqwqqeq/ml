const {
  matchesPerYear,
  countWonMatches,
  getMatchesWonPerYear,
  getMatchesPlayedVsWon,
  getUniqueYears,
} = require("../controllers/matchController");

const router = require("express").Router();

router.get("/route1", matchesPerYear);
router.get("/route2", countWonMatches);
router.get("/route22", getMatchesWonPerYear);
router.get("/route5", getMatchesPlayedVsWon);
router.get("/getyears", getUniqueYears);

module.exports = router;
