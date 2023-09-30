const mongoose = require("mongoose");

const ballModel = new mongoose.Schema({
  match_id: {
    type: Number,
    required: true,
  },
  inning: {
    type: Number,
    required: true,
  },
  batting_team: {
    type: String,
    required: true,
  },
  bowling_team: {
    type: String,
    required: true,
  },
  over: {
    type: Number,
    required: true,
  },
  ball: {
    type: Number,
    required: true,
  },
  batsman: {
    type: String,
    required: true,
  },
  non_striker: {
    type: String,
    required: true,
  },
  bowler: {
    type: String,
    required: true,
  },
  is_super_over: {
    type: Number,
    required: true,
  },
  wide_runs: {
    type: Number,
    required: true,
  },
  bye_runs: {
    type: Number,
    required: true,
  },
  legbye_runs: {
    type: Number,
    required: true,
  },
  noball_runs: {
    type: Number,
    required: true,
  },
  penalty_runs: {
    type: Number,
    required: true,
  },
  batsman_runs: {
    type: Number,
    required: true,
  },
  extra_runs: {
    type: Number,
    required: true,
  },
  total_runs: {
    type: Number,
    required: true,
  },
  player_dismissed: {
    type: String,
    required: false,
  },
  dismissal_kind: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Balls", ballModel);
