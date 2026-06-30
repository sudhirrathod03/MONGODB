import express from "express";
import connectDB from "../config/db.js";
import User from "../model/userModel.js";
const app = express();
app.use(express.json());

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/users", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await new User({
      name: name,
      email: email,
      password: password,
    });

    await user.save();
    res.status(200).json({ message: "user created successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const deleteUser = await User.findByIdAndDelete(req.params.id);
    if (!deleteUser) {
      return res.status(404).json({ message: "user not found" });
    }

    res.status(200).json({ message: "user deleted!", deleteUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(8080, () => {
  console.log("server listening to server 8080");
});

app.get("/pegination", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    
    const limit = Number(req.query.limit) || 5;

    const skip = (page - 1) * limit;

    const users = await User.find().skip(skip).limit(limit);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//get user by email

app.get("/users/email", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = await User.find({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/sort", async (req, res) => {
  try {
    const users = await User.find().sort({ name: 1 });
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


connectDB();
