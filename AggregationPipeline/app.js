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

const sort = await Employee.aggregate([
  {
    $sort: {
      salary: 1, //1 -> asc, -1 -> desc
    },
  },
]);

// console.log(sort);

//limit

const limit = await Employee.aggregate([
  {
    $sort: {
      salary: -1,
    },
  },
  {
    $limit: 3,
  },
]);

// console.log(limit);

const count = await Employee.aggregate([
  {
    $match: {
      department: "IT",
    },
  },
  {
    $count: "totalITemployees",
  },
]);

//Q1 Return all employees whose department is "IT".

const findAllItEmp = await Employee.aggregate([
  {
    $match: {
      department: "IT",
    },
  },
]);

// Q2 Return employees whose city is "Mumbai".

const empWithCityMumbai = await Employee.aggregate([
  {
    $match: {
      city: "Mumbai",
    },
  },
  {
    $project: {
      empName: 1,
      _id: 0,
    },
  },
]);

// Q23 Return employee name and salary whose city is "Mumbai"
const empWithCityMumbai = await Employee.aggregate([
  {
    $match: {
      city: "Mumbai",
    },
  },
  {
    $project: {
      empName: 1,
       salary: 1,
      _id: 0,
    },
  },
]);

// Q3 Return only empName and salary.
const filterEmp = await Employee.aggregate([
  {
    $project:{
      empName:1,
      salary:1,
      _id:0
    }
  }
])

// Q4 renmae - Return:empName → name salary → income

const reName = await Employee.aggregate([
  {
    $project:{
      name:"$empName",
      income:"$salary",
      _id:0
    }
  }
])

// Q5 Return employees sorted by salary lowest to highest.

const sortSalaryAsc = await Employee.aggregate([
  {
    $project:{
      empName:1,
      _id:0,
      salary:1
    }
  },

 {
  $sort:{
    salary:1
  }
 }
])

// Q6 Return employees sorted by salary highest to lowest.
const sortSalaryDesc = await Employee.aggregate([
  {
    $project:{
      empName:1,
      salary:1,
      _id:0
    }
  },{
    $sort:{
      salary:-1
    }
  }
])
console.log(sortSalaryDesc);


// Q7Sort employees from youngest to oldest.

const sortByAge = await Employee.aggregate([
  {
    $project:{
      empName:1,
      age:1,
      _id:0
    }
  },
  {
    $sort:{
      age:1
    }
  }
])

// Q8 Skip first 2 employees
const skipEmployees = await Employee.aggregate([
  {
    $sort: {
      salary: -1,
    },
  },
  {
    $skip: 2,
  },
]);

console.log(skipEmployees);

// Q9 Department-wise salary statistics
const departmentStats = await Employee.aggregate([
  {
    $group: {
      _id: "$department",
      totalSalary: { $sum: "$salary" },
      averageSalary: { $avg: "$salary" },
      highestSalary: { $max: "$salary" },
      lowestSalary: { $min: "$salary" },
    },
  },
]);
console.log(departmentStats);

const employeeSkills = await Employee.aggregate([
  {
    $unwind: "$skills",
  },
  {
    $project: {
      empName: 1,
      skills: 1,
      _id: 0,
    },
  },
]);

console.log(employeeSkills);


const employeesByDepartment = await Employee.aggregate([
  {
    $group: {
      _id: "$department",
      totalEmployees: { $sum: 1 },
    },
  },
]);

console.log(employeesByDepartment);


const itSalaryStats = await Employee.aggregate([
  {
    $match: {
      department: "IT",
    },
  },
  {
    $group: {
      _id: "$department",
      averageSalary: { $avg: "$salary" },
      totalSalary: { $sum: "$salary" },
    },
  },
]);

console.log(itSalaryStats);

const employeeBonus = await Employee.aggregate([
  {
    $addFields: {
      bonus: {
        $multiply: ["$salary", 0.1],
      },
    },
  },
  {
    $project: {
      empName: 1,
      salary: 1,
      bonus: 1,
      _id: 0,
    },
  },
]);

console.log(employeeBonus);
const highSalaryEmployees = await Employee.aggregate([
  {
    $match: {
      salary: {
        $gt: 50000,
      },
    },
  },
  {
    $project: {
      empName: 1,
      salary: 1,
      department: 1,
      _id: 0,
    },
  },
]);

console.log(highSalaryEmployees);
const employees = await Employee.aggregate([
  {
    $match: {
      $or: [
        { department: "IT" },
        { salary: { $gt: 70000 } },
      ],
    },
  },
  {
    $project: {
      empName: 1,
      department: 1,
      salary: 1,
      _id: 0,
    },
  },
]);

console.log(employees);
const salaryCategory = await Employee.aggregate([
  {
    $project: {
      empName: 1,
      salary: 1,
      category: {
        $cond: {
          if: { $gte: ["$salary", 60000] },
          then: "High Salary",
          else: "Low Salary",
        },
      },
      _id: 0,
    },
  },
]);

console.log(salaryCategory);
app.listen(PORT, () => {
  console.log("server strated!");
});
