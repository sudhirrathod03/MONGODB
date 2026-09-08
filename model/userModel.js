import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    requred: true,
  },
  email: {
    type: String,
    requred: true,
  },
  password: {
    type: String,
    requred: true,
  },
  address: [
    {
      pincode: Number,
      state: String,
      city: String,
    },
  ],

});

const User = new mongoose.model("User", userSchema);
export default User;
