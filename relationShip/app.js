import User from "../model/userModel.js";
import connectDB from "../config/db.js";
import express from "express";
import Order from "../model/ordersModel.js";
const app = express();
app.use(express.json());
app.post("/users", async (req, res) => {
  try {
    const { name, email, password, address } = req.body;
    const user = await User.create({
      name,
      email,
      password,
      address,
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/users/:userId/address/:addressId", async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const { pincode, city, state } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      {
        _id: userId,
        "address._id": addressId,
      },
      {
        $set: {
          "address.$.city": city,
          "address.$.pincode": pincode,
          "address.$.state": state,
        },
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function createOrder() {
  await Order.create({
    productName: "Samosa",
    price: 20,
    quantity: 2,
    user: "6a67467274ef1c29b80e0be2",
  });

  await Order.create({
    productName: "Chips",
    price: 10,
    quantity: 1,
    user: "6a67450d0732db95ef243c65",
  });
}

// createOrder();

async function fetchOrder() {
  const orders = await Order.find();
  console.log(orders);
}
// fetchOrder();

app.listen(8080, () => {
  console.log("listening to port 8080");
});

connectDB();
