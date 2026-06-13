import express from "express";
import connectDB from "../config/db.js";
import Employee from "../model/employeeModel.js";
import employees from "../config/data.js";
const app = express();

const PORT = 8080;

const match = await Employee.aggregate([
  {
    $match: {
      department: "IT",
    },
  },
]);

//select field
const select = await Employee.aggregate([
  {
    $project: {
      empName: 1,
      salary: 1,
      department: 1,
      _id: 0,
    },
  },
]);

//rename
const rename = await Employee.aggregate([
  {
    $project: {
      name: "$empName",
      income: "$salary",
      _id: 0,
    },
  },
]);

//create field
const createField = await Employee.aggregate([
  {
    $project: {
      empName: 1,
      salary: 1,
      yearlySalary: {
        $multiply: ["$salary", 12],
      },
    },
  },
]);

//group

const groupDepartment = await Employee.aggregate([
  {
    $group: {
      _id: "$department",
      maxSalary: { $max: "$salary" },
    },
  },
]);

console.log(groupDepartment);

app.listen(PORT, () => {
  console.log("server strated!");
});
