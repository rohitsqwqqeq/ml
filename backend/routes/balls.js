const {
  findExtraRunsPerYear,
  getEconomyRateForYear,
  } = require("../controllers/ballController");
  
  const router = require("express").Router();
  
  router.get("/route3", findExtraRunsPerYear);
  router.get("/route4", getEconomyRateForYear);
  
  module.exports = router;
