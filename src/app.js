const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

const doctorRoutes = require("./routes/doctor.routes");
app.use("/doctors", doctorRoutes);

const tokenRoutes = require("./routes/token.routes");
app.use("/tokens", tokenRoutes);

const simulationRoutes = require("./routes/simulation.routes");
app.use("/simulate", simulationRoutes);


app.get("/", (req, res) => {
  res.send("OPD Token Allocation Engine Running");
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error(err));
