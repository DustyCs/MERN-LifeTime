const connect = require('./connect');
const express = require('express');
const cors = require('cors');

require('dotenv').config();
const mongoose = require('mongoose');

const app = express();
const PORT = 5000;


app.use(express.json());

// Import Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));