

// Đây là nơi code tạo ra server.
const express = require("express");
const data = require("./data"); // Giả sử data.js export mảng students

// tạo server và trong đó sẽ chứa các API theo yêu cầu.
const server = express();
require("dotenv").config();
server.use(express.json());

// Khai Báo Đối Tượng Kết Nối DB

const { MongoClient, ObjectId  } = require("mongodb");
const dbClient = new MongoClient(process.env.DBURL);
const connectDB = async () => {
  await dbClient.connect();
  console.log("Connected to MongoDB");
  const dbName = await dbClient.db(process.env.DBNAME);
  return dbName;
};

// Tạo các API
// 1. API: GET / - trả về message chào mừng
server.get("/", (req, res) => {
  res.status(200).end("Welcome to server using Express");
  // res.status(200).json({ message: "Welcome to server using Express" });    trả về dạng json
});

//-----------------------------------------------------------------------------------

//2. API: GET /departments - lấy danh sách departments
server.get("/departments", async (req, res) => {
  const db = await connectDB();
  const collection = await db.collection("departments");
  const data = await collection.find().toArray();
  res.status(200).json(data);
});

//3. API: GET /employees - lấy danh sách employees :
server.get("/employees", async (req, res) => {
  const db = await connectDB();
  const collection = await db.collection("employees");
  const data = await collection.find().toArray();
  res.status(200).json(data);
});

//4. API: GET /employees - lấy danh sách employees : id, name, salary, dob, gender, depnName

server.get("/employees1", async (req, res) => {
  const db = await connectDB();
  const collection = db.collection("employees");

  const data = await collection
    .aggregate([
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
    ])
    .toArray();

  res.status(200).json(data);
});

// API: GET /employees1/:min/:max
// Lấy danh sách nhân viên có salary nằm trong khoảng [min, max]
// Hiển thị: id, name, salary, dob, gender, depName

server.get("/employees1/:min/:max", async (req, res) => {
  const min = Number(req.params.min);
  const max = Number(req.params.max);

  const db = await connectDB();

  const data = await db
    .collection("employees")
    .aggregate([
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
    ])
    .toArray();

  res.status(200).json(data);
});

//-----------------------------------------------------------------------------------

//6. API: POST /department - thêm 1 department vào db
// tạo 1 middlaware check xem name đã tồn tại chưa
// nếu tồn tại thì báo lỗi k insert
// Ngược lại insert bth
const checkName = async (req, res, next) => {
  const name = req.body.depName;

  const db = await connectDB();
  const collection = db.collection("departments");

  const data = await collection.find({
    depName: name
  }).toArray();

  if (data.length > 0) {
    return next("Name da ton tai !!");
  }

  next();
};
server.post("/departments", checkName, async(req, res) => {
  let dep = req.body;
   const db = await connectDB();
  const collection = await db.collection("departments");
   await collection.insertOne(dep);
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
  const db = await connectDB();
  const data = await db.collection("worksons").aggregate([
    {
      $match: {
        workHours: {
          $gte: hour
        }
      }
    },
    {
      $lookup: {
        from: "employees",
        localField: "empId",
        foreignField: "_id",
        as: "empInfor"
      }
    },
    {
      $unwind: "$empInfor"
    },
    {
      $lookup: {
        from: "projects",
        localField: "proId",
        foreignField: "_id",
        as: "proInfor"
      }
    },
    {
      $unwind: "$proInfor"
    },
    {
      $project: {
        _id: 1,
        empId: 1,
        empName: "$empInfor.name",
        proId: 1,
        proName: "$proInfor.proName",
        workHours: 1
      }
    }
  ]).toArray();

  res.status(200).json(data);
});



//2. Tạo API POST:/employees -- > Insert employee vàodb,
// có middleware check input kieu số cho salary, kieu date cho dob

const checkEmployeeInput = (req, res, next) => {
  const { salary, dob } = req.body;

 if (isNaN(Number(salary))) {
  return res.status(400).json({
    error: "Salary phai la kieu so!"
  });
}

  if (isNaN(Date.parse(dob))) {
    return res.status(400).json({
    error: "Dob phai la kieu date!"
  });
  }

  next();
};
server.post("/employees", checkEmployeeInput, async (req, res) => {
  const employee = req.body;

  employee.salary = Number(employee.salary);

  const db = await connectDB();
  const collection = db.collection("employees");

  const result = await collection.insertOne(employee);

  res.status(201).json({
    message: "Add employee successfully",
    insertedId: result.insertedId,
    employee: employee
  });
});



//3. Tạo API DELETE:/employees/:id -- >Delete employees theo id, có middleware check id ton tại

// Bạn nhớ import ObjectId từ thư viện mongodb ở đầu file nhé
 

const checkEmployeeId = async (req, res, next) => {
  try {
    const id = req.params.id.trim();

    // 1. Kiểm tra xem id truyền lên có đúng định dạng 24 ký tự hex của MongoDB không
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Định dạng ID không hợp lệ!",
      });
    }

    const db = await connectDB();
    const collection = db.collection("employees");

    // 2. Query trực tiếp dưới DB giống Mongo Shell
    const employee = await collection.findOne({ _id: new ObjectId(id) });

    if (!employee) {
      return res.status(404).json({
        error: "Employee không tồn tại!",
      });
    }

    req.employee = employee;
    next();
  } catch (error) {
    next(error);
  }
};

server.delete("/employees/:id", checkEmployeeId, async (req, res, next) => {
  try {
    const db = await connectDB();
    const collection = db.collection("employees");

    // Lệnh deleteOne này của bạn đã ổn rồi, req.employee._id hiện tại đang là 1 Object 
    await collection.deleteOne({ _id: req.employee._id });

    res.status(200).json({
      message: "Delete employee successfully",
      deletedEmployee: req.employee,
    });
  } catch (error) {
    next(error);
  }
});








// Middleware check id ton tai
// Middleware check id ton tai
const checkEmployeeIdU = async (req, res, next) => {
  try {
    const id = req.params.id.trim();

    // 1. Kiểm tra xem id truyền lên có đúng định dạng 24 ký tự hex của MongoDB không
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Định dạng ID không hợp lệ!",
      });
    }

    const db = await connectDB();
    const collection = db.collection("employees");

    // 2. Query trực tiếp dưới DB giống Mongo Shell
    const employee = await collection.findOne({ _id: new ObjectId(id) });

    if (!employee) {
      return res.status(404).json({
        error: "Employee không tồn tại!",
      });
    }

    req.employee = employee;
    next();
  } catch (error) {
    next(error);
  }
};

// PUT /employees/:id
server.put("/employees/:id", checkEmployeeIdU, async (req, res, next) => {
  try {
    const db = await connectDB();
    const collection = db.collection("employees");

    const { name, salary, gender, dob, depId } = req.body;

    // Xử lý depId an toàn hơn một chút
    let formattedDepId = depId;
    if (depId && ObjectId.isValid(depId)) {
      formattedDepId = new ObjectId(depId);
    }

    // Dùng luôn req.employee._id từ middleware, không cần parse lại từ req.params.id
    await collection.updateOne(
      { _id: req.employee._id },
      {
        $set: {
          name,
          salary,
          gender,
          dob,
          depId: formattedDepId,
        },
      }
    );

    // Lấy lại data sau khi update
    const updatedEmployee = await collection.findOne({
      _id: req.employee._id, 
    });

    res.status(200).json({
      message: "Update employee successfully",
      employee: updatedEmployee,
    });
  } catch (error) {
    next(error);
  }
});



//5. Tạo API GET: /employees/: keyword -- > Search employee theo name dua vao keyword


server.get("/employees/:keyword", async (req, res, next) => {
  try {
    const keyword = req.params.keyword;

    const db = await connectDB();
    const collection = db.collection("employees");

    const employees = await collection
      .find({
        name: { $regex: keyword, $options: "i" },
      })
      .toArray();

    res.status(200).json({
      message: "Tìm kiếm thành công!",
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
