const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const matchRoutes = require("./routes/matches");
const ballRoutes = require("./routes/balls");
const app = express();
require("dotenv").config();

connectDB();
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.send(`API is running on PORT ${process.env.PORT || 4000}`);
})

app.use("/api/match", matchRoutes);
app.use('/api/ball', ballRoutes)


const server = app.listen(process.env.PORT || 4000, () =>
  console.log(`Server started on http://localhost:${process.env.PORT || 4000}`)
);
