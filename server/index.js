const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const app = express();
const PORT = 4001;

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDb connected successfully"))
  .catch((err) => console.log(err.message));

app.post("/api/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(error);
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });
    if (!user) return res.status(400).json("User Not found");
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (isPasswordValid) {
      const token = jwt.sign(
        {
          email: user.email,
          name: user.name,
        },
        "secret123"
      );
      return res.status(200).json({ user, token });
    } else {
      return res.status(400).json("Inavlid Credentials");
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

app.post("/api/quote", async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, "secret123");
    const email = decoded.email;
    const user = await User.updateOne(
      { email: email },
      {
        $set: {
          quote: req.body.quote,
        },
      },
      { new: true }
    );

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

app.get("/api/quote", async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, "secret123");
    const email = decoded.email;

    const user = await User.findOne({ email: email });
    return res.status(200).json({ quote: user.quote });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
