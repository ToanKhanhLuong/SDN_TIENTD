const Toys = require("../models/Toys");

const data = [
  new Toys(1, "Lego", "Trẻ em từ 6 tuổi trở lên", ["xây dựng", "tư duy"]),
  new Toys(2, "Babi", "Trẻ em từ 4 tuổi trở lên", ["Búp Bê", "tưởng tượng"]),
  new Toys(3, "Gấu Bông", "Trẻ em từ 2 tuổi trở lên", ["mềm mại", "ngủ ngon"]),
  new Toys(4, "Robot biến hình", "Trẻ 10+", ["tương tác", "hành động"]),
];

// Hàm hiển thị danh sách đồ chơi
const showToys = () => {
  data.forEach((toy) => console.log(toy.toString()));
};

// Hàm tìm kiếm đồ chơi theo tên hoặc tag
const searchToys = (keyword) => {
  const result = data.filter(
    ({ name, tags }) =>
      name.toLowerCase().includes(keyword.toLowerCase()) ||
      tags.some((tag) => tag.toLowerCase().includes(keyword.toLowerCase())),
  );

  if (result.length === 0) {
    console.log("Không tìm thấy đồ chơi phù hợp với từ khóa:", keyword);
  } else {
    result.forEach((toy) => console.log(toy.toString()));
  }
};
// Thêm đồ chơi mới
const addToy = (name, age, tags) => {
  const id = data.length + 1;
  const newToy = new Toys(id, name, age, tags);
  data.push(newToy);
  console.log(`Đã thêm thành công: ${newToy.toString()}`);
};

const updateToy = (id, newName, newAge, newTags) => {
  const toy = data.find((toy) => toy.id === Number(id));
  if (!toy) {
    console.log("Không tìm thấy đồ chơi");
    return;
  } else {
    toy.name = newName;
    toy.age = newAge;
    toy.tags = newTags;
    console.log("Đã cập nhật:");
    console.log(toy.toString());
  }
};

const deleteToy = (id) => {
  const index = data.findIndex((toy) => toy.id === Number(id));

  if (index === -1) {
    console.log("Không tìm thấy đồ chơi");
    return;
  }
  const deleted = data.splice(index, 1);
  console.log("Đã xóa:", deleted[0].toString());
};
module.exports = { showToys, searchToys, addToy, updateToy, deleteToy };
