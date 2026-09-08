import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  empName: String,
  age: Number,
  salary: Number,
  department: String,
  city:String
});

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;