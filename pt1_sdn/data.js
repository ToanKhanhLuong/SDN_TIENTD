const users = [
  {
    id: "f001",
    name: "Nguyễn Văn A",
    email: "a@gmail.com",
    password: "123456",
    phone: "0901234567",
    address: { street: "123 Lê Lợi", city: "HCM", country: "Vietnam" },
  },
  {
    id: "f002",
    name: "Trần Thị B",
    email: "b@gmail.com",
    password: "123456",
    phone: "0902345678",
    address: { street: "456 Trần Hưng Đạo", city: "HCM", country: "Vietnam" },
  },
  {
    id: "f003",
    name: "Lê Văn C",
    email: "c@gmail.com",
    password: "123456",
    phone: "0903456789",
    address: { street: "789 Nguyễn Trãi", city: "HN", country: "Vietnam" },
  },
  {
    id: "f004",
    name: "Phạm Thị D",
    email: "d@gmail.com",
    password: "123456",
    phone: "0904567890",
    address: { street: "321 Hai Bà Trưng", city: "ĐN", country: "Vietnam" },
  },
  {
    id: "f005",
    name: "Hoàng Văn E",
    email: "e@gmail.com",
    password: "123456",
    phone: "0905678901",
    address: { street: "654 Lý Thường Kiệt", city: "CT", country: "Vietnam" },
  },
];

const categories = [
  {
    id: "c001",
    name: "Laptop",
    description: "Các dòng máy tính xách tay",
  },
  {
    id: "c002",
    name: "Smartphone",
    description: "Điện thoại thông minh",
  },
  {
    id: "c003",
    name: "Accessories",
    description: "Phụ kiện công nghệ",
  },
];

const products = [
  {
    id: "p001",
    name: "Laptop Dell XPS",
    price: 30000000,
    stock: 10,
    categoryId: "c001",
  },
  {
    id: "p002",
    name: "iPhone 14 Pro",
    price: 25000000,
    stock: 15,
    categoryId: "c002",
  },
  {
    id: "p003",
    name: "Tai nghe AirPods Pro",
    price: 5000000,
    stock: 20,
    categoryId: "c003",
  },
  {
    id: "p004",
    name: "MacBook Pro M2",
    price: 42000000,
    stock: 5,
    categoryId: "c001",
  },
  {
    id: "p005",
    name: "Samsung Galaxy S23",
    price: 23000000,
    stock: 8,
    categoryId: "c002",
  },
];

const orders = [
  {
    id: "o001",
    userId: "f001",
    items: [
      {
        productId: "p001",
        quantity: 1,
        price: 30000000,
      },
      {
        productId: "p003",
        quantity: 2,
        price: 5000000,
      },
    ],
    total: 40000000,
    shippingAddress: { street: "123 Lê Lợi", city: "HCM", country: "Vietnam" },
    status: "shipped",
  },
  {
    id: "o002",
    userId: "f002",
    items: [
      {
        productId: "p002",
        quantity: 1,
        price: 25000000,
      },
    ],
    total: 25000000,
    shippingAddress: {
      street: "456 Trần Hưng Đạo",
      city: "HCM",
      country: "Vietnam",
    },
    status: "pending",
  },
  {
    id: "o003",
    userId: "f003",
    items: [
      {
        productId: "p005",
        quantity: 1,
        price: 23000000,
      },
    ],
    total: 23000000,
    shippingAddress: {
      street: "789 Nguyễn Trãi",
      city: "HN",
      country: "Vietnam",
    },
    status: "shipped",
  },
  {
    id: "o004",
    userId: "f004",
    items: [
      {
        productId: "p003",
        quantity: 1,
        price: 5000000,
      },
      {
        productId: "p005",
        quantity: 2,
        price: 23000000,
      },
    ],
    total: 51000000,
    shippingAddress: {
      street: "321 Hai Bà Trưng",
      city: "ĐN",
      country: "Vietnam",
    },
    status: "processing",
  },
  {
    id: "o005",
    userId: "f005",
    items: [
      {
        productId: "p004",
        quantity: 1,
        price: 42000000,
      },
    ],
    total: 42000000,
    shippingAddress: {
      street: "654 Lý Thường Kiệt",
      city: "CT",
      country: "Vietnam",
    },
    status: "delivered",
  },
];

module.exports = { users, categories, products, orders };
