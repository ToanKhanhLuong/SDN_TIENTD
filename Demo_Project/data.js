const users = [
  {
    id: "U001",
    account: "admin1",
    password: "123",
    name: "Thich tu do",
    gender: 0,
    email: "tudo@gmail.com",
    phone: "0912345678",
    status: "Active",
    role: {
      name: "Admin",
      permissions: ["USER_CREATE", "USER_UPDATE", "USER_DELETE", "USER_VIEW"],
    },
    profile: {
      avatar: "https://example.com/avatar1.png",
      dob: "1995-04-10",
      address: {
        city: "Ha Noi",
        district: "Cau Giay",
        street: "Ho Tung Mau",
      },
    },
  },

  {
    id: "U002",
    account: "user1",
    password: "456",
    name: "Thich moi thu",
    gender: 1,
    email: "moithu@gmail.com",
    phone: "0988777666",
    status: "Active",
    role: {
      name: "User",
      permissions: ["USER_VIEW"],
    },
    profile: {
      avatar: "https://example.com/avatar2.png",
      dob: "2000-08-15",
      address: {
        city: "Da Nang",
        district: "Hai Chau",
        street: "Nguyen Van Linh",
      },
    },
  },
];

module.exports = users;
