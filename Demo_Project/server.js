const express = require("express");
const users = require("./data");

const server = express();
require("dotenv").config();

server.use(express.json());

// HOME
server.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to server using Express PT1",
  });
});






// 1. GET all users
server.get("/users", (req, res) => {
  const result = users.map((user) => ({
    ...user,
    gender: user.gender === 1 ? "Male" : "Female",
    role: user.role.name,
  }));

  res.status(200).json(result);
});

// 2. GET user by email

const checkEmail = (req, res, next) => {
  const email = req.params.email;
  const user = users.find((item) => item.email === email);
  if (!user) {
    return res.status(404).json({
      message: "Account not exist",
    });
  }

  next();
};

server.get("/users/:email", checkEmail, (req, res) => {
  const email = req.params.email;

  const result = users
    .filter((user) => user.email === email)
    .map((user) => ({
      ...user,
      gender: user.gender === 1 ? "Male" : "Female",
      role: user.role.name,
    }));

  res.status(200).json(result);
});


// Middleware check dữ liệu user

const checkUserInput = (req, res, next) => {
  const {account, password, name, gender, email, phone, status, role, profile} = req.body;

  // Check empty
  if ( !account || !password || !name || gender === undefined || !email || !phone || !status || !role || !profile
  ) {
    return res.status(400).json({message: "All fields are required",});
  }

  // Check gender
  if (![0, 1].includes(Number(gender))) {
    return res.status(400).json({
      message: "Gender must be 0 or 1",
    });
  }

  // Check email có @
  const atIndex = email.indexOf("@");

  if (atIndex <= 0 || atIndex === email.length - 1) {
    return res.status(400).json({
      message: "Email must contain @ in the middle",
    });
  }

  // Check account trùng
  const accountExist = users.some(
    (user) => user.account.toLowerCase() === account.toLowerCase()
  );

  if (accountExist) {
    return res.status(400).json({message: "Account already exists",});
  }

  // Check email trùng
  const emailExist = users.some(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );

  if (emailExist) {
    return res.status(400).json({
      message: "Email already exists",
    });
  }

  next();
};

// 3. POST /users

server.post("/users", checkUserInput, (req, res) => {
  const {
    account,
    password,
    name,
    gender,
    email,
    phone,
    status,
    role,
    profile,
  } = req.body;

  // Tạo id tự động
  const newId = "U" + String(users.length + 1).padStart(3, "0");

  const newUser = {
    id: newId,
    account,
    password,
    name,
    gender: Number(gender),
    email,
    phone,
    status,
    role,
    profile,
  };

  users.push(newUser);

  return res.status(201).json({
    message: "Add user successfully",
    data: newUser,
  });
});

// 3. UPDATE user

const checkAccountExist = (req, res, next) => {
  const { account, password } = req.params;
  const user = users.find((u) => u.account === account);
  const pass = users.find((p) => p.password === password);
  if (!user) {
    return res.status(404).json({ message: "Account not found" });
  }

  if (!pass) {
    return res.status(401).json({ message: "Password incorrect" });
  }

  next();
};

server.put("/users/:account/:password", checkAccountExist, (req, res) => {
  const { account, password } = req.params;

  const index = users.findIndex((u) => u.account === account);

  const updateData = req.body;

  if (updateData.account !== account) {
    return res.status(400).json({
      message: "Account cannot be changed",
    });
  }

  users[index] = {
    ...users[index],
    ...updateData,
    account: users[index].account,
  };

  return res
    .status(200)
    .json({ message: "Update successfully", data: users[index] });
});

// 4. DELETE user by email

const checkEmailDelete = (req, res, next) => {
  const email = req.params.email;

  const user = users.find((item) => item.email === email);

  if (!user) {
    return res.status(404).json({
      message: "Email not found",
    });
  }

  next();
};

server.delete("/users/:email", checkEmailDelete, (req, res) => {
  const email = req.params.email;

  const index = users.findIndex((item) => item.email === email);

  users.splice(index, 1);

  res.status(200).json({
    message: "Delete successfully",
    data: users,
  });
});

// RUN SERVER
const PORT = process.env.PORT || 8888;
const HOST = process.env.HOST || "localhost";

server.listen(PORT, HOST, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});
