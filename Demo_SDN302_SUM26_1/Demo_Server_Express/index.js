// Đây là nơi code tạo ra server.
const express = require("express");
const data = require("./data"); // Giả sử data.js export mảng students




// tạo server và trong đó sẽ chứa các API theo yêu cầu.
const server = express();
require("dotenv").config();
server.use(express.json());




// Tạo các API
// 1. API: GET / - trả về message chào mừng
server.get("/", (req, res) => {
  res.status(200).end("Welcome to server using Express");
  // res.status(200).json({ message: "Welcome to server using Express" });    trả về dạng json
});

//-----------------------------------------------------------------------------------


//2. API: GET /user - trả về danh sách user (hoặc students nếu data.js là students)
server.get("/user", (req, res) => {
  res.status(200).json(data);
})

//-----------------------------------------------------------------------------------


//3. API: POST /user - thêm mới user vào danh sách
// tạo 1 middlaware check xem id đã tồn tại chưa
// nếu tồn tại thì báo lỗi k insert
// Ngược lại insert bth
const checkId = (req, res, next) =>{
  let result = data.find((item) => item.id == req.body.id);
  if(result){
return next("Id da ton tai");
  }else{
    return next();
  }
}
server.post("/user", checkId,  (req, res) => {
  let user = req.body;
  data.push(user);
  res.status(201).json({message : "Add successfully", user}); 
});

server.use((err, req, res, next) =>{
  res.status(400).json({error: err})
});



//-----------------------------------------------------------------------------------




// Luyện Tập
//1. Update API GET danh sách user:
     // - Hiển thị gender là male/ female thay cho 1/0
     // - address chỉ hiển thị city.
server.get("/users", (req, res) => {
  const result = data.map(user => ({
    ...user,
    gender: user.gender === 1 ? "male" : "female",
    address: user.address.city
  }));

  res.status(200).json(result);
});


//-----------------------------------------------------------------------------------



//2. Update API POST insert user:  Thêm 1 middleware check input valid các trường
const validateUserInput = (req, res, next) => {
  const { name, age, gender, address } = req.body;

  if (!name || name.trim() === "") {
    res.status(400).json({message: "Name is required"});
  } else if (age === undefined || isNaN(age) || age <= 0) {
    res.status(400).json({message: "Age must be a positive number"});

  } else if (gender !== 0 && gender !== 1) {
    res.status(400).json({
      message: "Gender must be 0 or 1"
    });

  } else if (!address || !address.city || address.city.trim() === "") {
    res.status(400).json({
      message: "Address city is required"
    });

  } else {
    next();
  }
};

server.post("/user", validateUserInput, (req, res) => {
  const newUser = {
    id: data.length + 1,
    ...req.body
  };

  data.push(newUser);

  res.status(201).json({
    message: "Insert user successfully", data: newUser
  });
});



//-----------------------------------------------------------------------------------



//3. Tạo API GET: /user/:mark --> Tìm kiếm user theo mark
server.get("/user/:mark", (req, res) => {
  const mark = Number(req.params.mark);
  const result = data.filter(user => user.grade === mark);
  if (result.length === 0) {
    return res.status(404).json({
      message: "No user found"
    });
  }

  res.status(200).json(result);
});

server.get("/user")


//-----------------------------------------------------------------------------------



//4. Tạo API PUT: /user/:id ---> Update users theo id, có middleware check id tồn tại
// Middleware check id tồn tại
const checkUserId = (req, res, next) => {
  const id = req.params.id;

  const user = data.find(item => item.id === id);

  if (!user) {
    return res.status(404).json({
      message: "User not found"
    });
  }
  next();
};
// PUT update user theo id
server.put("/user/:id", checkUserId, (req, res) => {
  const id = req.params.id;

  const index = data.findIndex(item => item.id === id);

  data[index] = {
    ...data[index],
    ...req.body
  };
  res.status(200).json({message: "Update successfully",data: data[index]
  });
});







//5. Tạo API Delete; /user/:id --> Delete user theo id, có ,iddleware check id tồn tại.
// Middleware check id tồn tại
const checkUserIdDelete = (req, res, next) => {
  const id = req.params.id;

  const user = data.find(item => item.id === id);

  if (!user) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  next();
};

// DELETE user theo id
server.delete("/user/:id", checkUserId, (req, res) => {
  const id = req.params.id;

  const index = data.findIndex(item => item.id === id);

  data.splice(index, 1);
  res.status(200).json({message: "Delete successfully", data: data});
});



// run server đã tạo ở bên trên để clien nào đó có thể call API.
const PORT = process.env.PORT || 8888;
const HOST = process.env.HOST || "localhost";
server.listen(PORT, HOST, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});