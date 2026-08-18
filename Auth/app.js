import express from "express";
const app = express();
const PORT = 8080;
import User from "../model/userModel";
import bcrypt from "bcrypt";

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
   if (!email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User does not exist!" });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "User logged in successfully!", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`server listening to port ${PORT}`);
});
