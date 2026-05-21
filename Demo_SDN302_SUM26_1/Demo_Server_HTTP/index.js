// Đây là nơi code tạo ra server.

const { error } = require("console");
const http = require("http");

// tạp 1 danh sách user Fake DB
const data = [
  { id: "SV01", name: "Toan Luong Khanh", gender: "Male", grade: 8 },
  { id: "SV02", name: "Nguyen Mai Phuong", gender: "Female", grade: 8 },
  { id: "SV03", name: "Boi Van Nam", gender: "Male", grade: 1 },
];

// tạo server và trong đó sẽ chứa các API theo yêu cầu.
const server = http.createServer((req, res) => {
  // req: request - yêu cầu của client gửi lên server.
  // res: response - phản hồi của server trả về cho client.

  const { method, url } = req;

  if (method === "GET" && url === "/") {
    res.end("Welcome to server");
  } else if (method === "GET" && url === "/user") {
    //Lấy ra danh sách user
    res.statusCode = 200;
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify(data));
  }

  // Thêm mới user
  else if (method === "POST" && url === "/user") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const user = JSON.parse(body);
        data.push(user);

        res.statusCode = 201;
        res.setHeader("content-type", "application/json");
        res.end(JSON.stringify({ message: "User added successfully", user }));
      } catch (e) {
        res.statusCode = 400;
        res.setHeader("content-type", "application/json");
        res.end(JSON.stringify({ error: "Invalid JSON body" }));
      }
    });
  }

  // Tìm user theo id
  else if (method === "GET" && url.startsWith("/user/")) {
    const id = url.split("/")[2];

    const user = data.find((item) => item.id === id);
    res.setHeader("content-type", "application/json");
    if (user) {
      res.statusCode = 200;
      res.end(JSON.stringify(user));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: "User not found" }));
    }
  }

  // // Update user theo ID
  else if (method === "PUT" && url.startsWith("/user/")) {
    const id = url.split("/")[2];
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const updatedUser = JSON.parse(body);

        // tìm vị trí user
        const index = data.findIndex((item) => item.id === id);

        if (index === -1) {
          res.statusCode = 404;
          return res.end(JSON.stringify({ error: "User not found" }));
        }

        // cập nhật dữ liệu
        data[index] = {
          ...data[index],
          ...updatedUser,
        };

        res.statusCode = 200;
        res.setHeader("content-type", "application/json");

        res.end(JSON.stringify({message: "Update success",user: data[index],}),);
      } catch (e) {
    res.statusCode = 400;
        res.end(JSON.stringify({error: "Invalid JSON",}),
        );
      }
    });
  }

  // xóa user theo ID
  else if (method === "DELETE" && url.startsWith("/user/")) {
    const id = url.split("/")[2];

    // tìm vị trí user
    const index = data.findIndex((item) => item.id === id);

    if (index === -1) {
      res.statusCode = 404;
      res.setHeader("content-type", "application/json");

      return res.end(JSON.stringify({error: "User not found",}),
      );
    }

    // xóa user
    const deletedUser = data.splice(index, 1);

    res.statusCode = 200;
    res.setHeader("content-type", "application/json");

    res.end(JSON.stringify({message: "Delete success",user: deletedUser[0],}),);
  } else {
    res.statusCode = 404;
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ error: "API not found" }));
  }
});

// run server đã tạo ở bên trên để clien nào đó có thể call API.

const PORT = 8888;
const HOST = "localhost";

server.listen(PORT, HOST, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});
