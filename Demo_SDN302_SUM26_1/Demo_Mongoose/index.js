// Đây là nơi code tạo ra server.
const express = require("express");
const data = require("./data"); // Giả sử data.js export mảng students

// tạo server và trong đó sẽ chứa các API theo yêu cầu.
const server = express();
require("dotenv").config();
server.use(express.json());

// Khai Báo Đối Tượng Kết Nối DB

const mongoose = require("mongoose");
mongoose
  .connect(`${process.env.DBURL}${process.env.DBNAME}`)
  .then(() => console.log("Connected to mongodb"))
  .catch((error) => console.log("Error:" + error));

// Tạo Schema
const departmentSchema = new mongoose.Schema({
  depName: {
    type: String,
    required: true,
  },
  location: String,
});

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  salary: {
    type: Number,
    required: true,
    min: 0,
  },
  gender: Boolean,
  dob: {
    type: Date,
    required: true,
    default: Date.now,
  },
  depId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Department",
  },
});

const worksonSchema = new mongoose.Schema({
  empId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },

  proId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },

  workHours: {
    type: Number,
    required: true,
  },
});


//Tạo model

const Department = mongoose.model(
  "Department",
  departmentSchema,
  "departments",
);
const Employee = mongoose.model("Employee", employeeSchema, "employees");

const Workson = mongoose.model("Workson", worksonSchema, "worksons");

// Tạo các API
// 1. API: GET / - trả về message chào mừng
server.get("/", (req, res) => {
  res.status(200).end("Welcome to server using Express");
  // res.status(200).json({ message: "Welcome to server using Express" });    trả về dạng json
});

//-----------------------------------------------------------------------------------

//2. API: GET /departments - lấy danh sách departments
server.get("/departments", async (req, res) => {
  const data = await Department.find();
  res.status(200).json(data);
});

//3. API: GET /employees - lấy danh sách employees :
server.get("/employees", async (req, res) => {
  const data = await Employee.find();
  res.status(200).json(data);
});

//4. API: GET /employees - lấy danh sách employees : id, name, salary, dob, gender, depnName

server.get("/employees1", async (req, res) => {
  const data = await Employee.aggregate([
    {
      $lookup: {
        from: "departments",
        localField: "depId",
        foreignField: "_id",
        as: "depInfor",
      },
    },
    {
      $unwind: "$depInfor",
    },
    {
      $project: {
        _id: 1,
        name: 1,
        salary: 1,
        gender: 1,
        dob: 1,
        depName: "$depInfor.depName",
      },
    },
  ]);

  res.status(200).json(data);
});

// 5 API: GET /employees1/:min/:max
// Lấy danh sách nhân viên có salary nằm trong khoảng [min, max]
// Hiển thị: id, name, salary, dob, gender, depName

server.get("/employees1/:min/:max", async (req, res) => {
  const min = Number(req.params.min);
  const max = Number(req.params.max);

  const data = await Employee.aggregate([
    {
      $match: {
        salary: {
          $gte: min,
          $lte: max,
        },
      },
    },
    {
      $lookup: {
        from: "departments",
        localField: "depId",
        foreignField: "_id",
        as: "depInfor",
      },
    },
    {
      $unwind: "$depInfor",
    },
    {
      $project: {
        _id: 1,
        name: 1,
        salary: 1,
        gender: 1,
        dob: 1,
        depName: "$depInfor.depName",
      },
    },
  ]);

  res.status(200).json(data);
});




// 5.2 API: GET /employees1/:min/:max
// Lấy danh sách nhân viên có salary nằm trong khoảng [min, max]
// Hiển thị: id, name, salary, dob, gender, depName

server.get("/employees2/:min/:max", async (req, res) => {
  const min = Number(req.params.min);
  const max = Number(req.params.max);
 
  const data = await Employee.find({
    salary :{$gte: min, $lte: max}
  }). populate("depId", "depName");

  const data2 = data.map((item) => ({
    _id: item._id,
    name: item.name,
    salary: item.salary,
    gender: item.gender?"Male":"Female",
    dob: item.dob,
    depName: item.depId.depName,
  }));

  res.status(200).json(data2);
});

//-----------------------------------------------------------------------------------

//6. API: POST /department - thêm 1 department vào db
// tạo 1 middlaware check xem name đã tồn tại chưa
// nếu tồn tại thì báo lỗi k insert
// Ngược lại insert bth
const checkName = async (req, res, next) => {
  const name = req.body.depName;

 

  const data = await Department
    .find({
      depName: name,
    })
    

  if (data.length > 0) {
    return next("Name da ton tai !!");
  }

  next();
};
server.post("/departments", checkName, async (req, res) => {
  let dep = req.body;
  const department = new Department(dep);
  await department.save();
  res.status(201).json({ message: "Add successfully", DepInfor: dep });
});

server.use((err, req, res, next) => {
  res.status(400).json({ error: err });
});



//-----------------------------------------------------------------------------------
//Practice:
//1. Tạo API GET: /worksons/:hour -- > Tìm kiem danh sach worksons voi workhour>=hour,
// hien thị: id, empid, empname, proid, proname, workhour
//2. Tạo API POST:/employees -- > Insert employee vàodb,
// có middleware check input kieu số cho salary, kieu date cho dob
//3. Tạo API DELETE:/employees/:id -- >Delete employees theo id, có middleware check id ton tại
//4. Tạo API PUT:/employees/:id -- >Update employees theo id, có middleware check id ton tại
//5. Tạo API GET: /employees/: keyword -- > Search employee theo name dua vao keyword




// GET /worksons/:hour
// Tìm worksons có workHours >= hour
// Hiển thị: id, empId, empName, proId, proName, workHours

server.get("/worksons/:hour", async (req, res) => {
  const hour = Number(req.params.hour);
  const data = await Workson
    .aggregate([
      {
        $match: {
          workHours: {
            $gte: hour,
          },
        },
      },
      {
        $lookup: {
          from: "employees",
          localField: "empId",
          foreignField: "_id",
          as: "empInfor",
        },
      },
      {
        $unwind: "$empInfor",
      },
      {
        $lookup: {
          from: "projects",
          localField: "proId",
          foreignField: "_id",
          as: "proInfor",
        },
      },
      {
        $unwind: "$proInfor",
      },
      {
        $project: {
          _id: 1,
          empId: 1,
          empName: "$empInfor.name",
          proId: 1,
          proName: "$proInfor.proName",
          workHours: 1,
        },
      },
    ])
    

  res.status(200).json(data);
});

//2. Tạo API POST:/employees -- > Insert employee vàodb,
// có middleware check input kieu số cho salary, kieu date cho dob

const checkEmployeeInput = (req, res, next) => {
  const { salary, dob } = req.body;

  if (isNaN(Number(salary))) {
    return next("Salary phai la kieu so!");
  }

  if (isNaN(Date.parse(dob))) {
    return next("Dob phai la kieu date!");
  }

  next();
};

server.post("/employees", checkEmployeeInput, async (req, res) => {
  let emp = req.body;

  emp.salary = Number(emp.salary);
  emp.dob = new Date(emp.dob);

  const employee = new Employee(emp);
  await employee.save();

  res.status(201).json({
    message: "Add employee successfully",
    EmpInfor: emp,
  });
});

server.use((err, req, res, next) => {
  res.status(400).json({
    error: err,
  });
});

//3. Tạo API DELETE:/employees/:id -- >Delete employees theo id, có middleware check id ton tại

// Bạn nhớ import ObjectId từ thư viện mongodb ở đầu file nhé

const checkEmployeeId = async (req, res, next) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next("ID khong hop le!");
  }

  const employee = await Employee.findById(id);

  if (!employee) {
    return next("Employee khong ton tai!");
  }

  req.employee = employee;
  next();
};

server.delete("/employees/:id", checkEmployeeId, async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);

  res.status(200).json({
    message: "Delete employee successfully",
    deletedEmployee: req.employee,
  });
});



// Middleware check id ton tai
// Middleware check id ton tai
const checkEmployeeIdU = async (req, res, next) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next("ID khong hop le!");
  }

  const employee = await Employee.findById(id);

  if (!employee) {
    return next("Employee khong ton tai!");
  }

  req.employee = employee;
  next();
};

server.put("/employees/:id", checkEmployeeIdU, async (req, res) => {
  const { name, salary, gender, dob, depId } = req.body;

  const employee = await Employee.findByIdAndUpdate(
    req.params.id,
    {
      name,
      salary: Number(salary),
      gender,
      dob: new Date(dob),
      depId,
    },
    {
      new: true, // trả về document sau khi update
    }
  );

  res.status(200).json({
    message: "Update employee successfully",
    employee,
  });
});

server.use((err, req, res, next) => {
  res.status(400).json({
    error: err,
  });
});

//5. Tạo API GET: /employees/: keyword -- > Search employee theo name dua vao keyword

server.get("/employees/:keyword", async (req, res, next) => {
  try {
    const keyword = req.params.keyword;

    const employees = await Employee.find({
      name: {
        $regex: keyword,
        $options: "i",
      },
    });

    res.status(200).json({
      message: "Tim kiem thanh cong!",
      total: employees.length,
      data: employees,
    });
  } catch (error) {
    next(error);
  }
});

// // run server đã tạo ở bên trên để clien nào đó có thể call API.
const PORT = process.env.PORT || 8888;
const HOST = process.env.HOST || "localhost";
server.listen(PORT, HOST, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});
