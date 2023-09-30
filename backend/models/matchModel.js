const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
  id: {
    type: Number,
    ref: "Matches",
    required: true,
  },
  season: {
    type: Number,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  team1: {
    type: String,
    required: true,
  },
  team2: {
    type: String,
    required: true,
  },
  toss_winner: {
    type: String,
    required: true,
  },
  toss_decision: {
    type: String,
    required: true,
  },
  result: {
    type: String,
    required: true,
  },
  dl_applied: {
    type: Number,
    required: true,
  },
  winner: {
    type: String,
    required: true,
  },
  win_by_runs: {
    type: Number,
    required: true,
  },
  win_by_wickets: {
    type: Number,
    required: true,
  },
  player_of_match: {
    type: String,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  umpire1: {
    type: String,
    required: true,
  },
  umpire2: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Matches", matchSchema);
