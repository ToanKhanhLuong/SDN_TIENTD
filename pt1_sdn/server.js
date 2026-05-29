const express = require("express");
const { users, categories, products, orders } = require("./data");
const server = express();
require("dotenv").config();

server.use(express.json());


// HOME
server.get("/", (req, res) => {
  res.status(200).json({message: "Welcome to server using Express PT1",});
});

server.get("/orders", (req, res) => {
  res.status(200).json(orders);
});

server.get("/products", (req, res) => {
  res.status(200).json(products);
});

// get all user
server.get("/users", (req, res) => {
  const result = users.map(({ password, ...user }) => ({
    ...user,
    Address: `${user.address.street}, ${user.address.city}, ${user.address.country}`,
  }));

  res.status(200).json(result);
});


// 2. GET /products/:name

const checkProductExist = (req, res, next) => {
  const name = req.params.name.toLowerCase();
  const result = products.filter((product) => product.name.toLowerCase().includes(name)).map((product) => {
      const category = categories.find((c) => c.id === product.categoryId);

      return {id: product.id, name: product.name, price: product.price, stock: product.stock, categoryName: category ? category.name : null};
    });

  if (result.length === 0) {
    return res.status(404).json({message: "Products not exist",});
  }

  req.result = result;
  next();
};

server.get("/products/:name", checkProductExist, (req, res) => {
  res.status(200).json(req.result);
});


// 3.POST /products:


const checkAddProduct = (req, res, next) => {
  const { name, price, stock, categoryId } = req.body;

  const errors = {};

  // Check empty
  if (!name || name.trim() === "") {
    errors.name = "Name is required";
  }

  if (price === undefined || price === null || price === "") {
    errors.price = "Price is required";
  }

  if (stock === undefined || stock === null || stock === "") {
    errors.stock = "Stock is required";
  }

  if (!categoryId || categoryId.trim() === "") {
    errors.categoryId = "CategoryId is required";
  }

  
  if (price !== undefined && price !== "" && isNaN(Number(price))) {
    errors.price = "Price must be number";
  }

  if (stock !== undefined && stock !== "" && isNaN(Number(stock))) {
    errors.stock = "Stock must be number";
  }

  
  if (name && name.trim() !== "") {
    const productExist = products.some(
      (product) => product.name.toLowerCase() === name.toLowerCase()
    );

    if (productExist) {
      errors.name = "Product name already exists";
    }
  }

  
  if (categoryId && categoryId.trim() !== "") {
    const categoryExist = categories.some(
      (category) => category.id === categoryId
    );

    if (!categoryExist) {
      errors.categoryId = "CategoryId not exist";
    }
  }

  
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "Errors",
      errors: errors,
    });
  }

  next();
};

server.post("/products", checkAddProduct, (req, res) => {
  const { name, price, stock, categoryId } = req.body;

  const newProduct = {
    id: `p00${products.length + 1}`,
    name,
    price: Number(price),
    stock: Number(stock),
    categoryId,
  };

  products.push(newProduct);

  res.status(201).json(newProduct);
});



// 4. PUT /orders/:_id

const checkOrderExist = (req, res, next) => {
  const _id = req.params._id;

  const order = orders.find((order) => order.id === _id);

  if (!order) {
    return res.status(404).json({
      message: "Order not exist",
    });
  }

  next();
};

server.put("/orders/:_id", checkOrderExist, (req, res) => {
  const _id = req.params._id;

  const index = orders.findIndex((order) => order.id === _id);

  orders[index] = {
    ...orders[index],
    ...req.body,
    id: _id, 
  };

  res.status(200).json(orders[index]);
});

// Delete

const checkUserIdDelete = (req, res, next) => {
  const userId = req.params.userId;

  const hasOrder = orders.some((item) => item.userId === userId);

  if (!hasOrder) {
    return res.status(404).json({
      message: "UserId not found",
    });
  }

  next();
};

server.delete("/orders/:userId", checkUserIdDelete, (req, res) => {
  const userId = req.params.userId;

  const deletedOrders = orders.filter((item) => item.userId === userId);
  const remainingOrders = orders.filter((item) => item.userId !== userId);

  orders.length = 0;
  orders.push(...remainingOrders);
  res.status(200).json({
    message: "Delete successfully",
    deleted: deletedOrders,
    data: orders,
  });
});


// RUN SERVER
const PORT = process.env.PORT || 8888;
const HOST = process.env.HOST || "localhost";

server.listen(PORT, HOST, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});
