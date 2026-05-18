const readline = require("readline");
const { showToys, searchToys, addToy, updateToy, deleteToy } = require("./services/ToyServices");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// tạo giao diện của chương trình

const promptUser = () => {
  // tạo menu
  console.log(`
======Menu======        
1. Xem danh sách đồ chơi
2. Tìm kiếm danh sách đồ chơi
3. Thêm mới đồ chơi
4. Cập nhật đồ chơi
5. Xóa đồ chơi
0. Thoát
        
        `);

  // cho phép người dùng nhập tùy chọn từ bàn phím.
  rl.question(`Nhập tùy chọn:`, (option) => {
    switch (option) {
      case "1":
        showToys();
        promptUser();
        break;
      case "2":
        rl.question("Nhập từ khóa tìm kiếm:", (keyword) => {
          searchToys(keyword);
          promptUser();
        });
        break;
      case "3":
        rl.question("Tên đồ chơi: ", (name) => {
          rl.question("Độ tuổi: ", (age) => {
            rl.question("Tags (phân cách dấu phẩy): ", (tagInput) => {
              const tags = tagInput.split(",").map((t) => t.trim());
              addToy(name, age, tags);
              promptUser();
            });
          });
        });

        break;
      case "4":
        rl.question("ID cần sửa: ", (id) => {
          rl.question("Tên mới: ", (name) => {
            rl.question("Độ tuổi mới: ", (age) => {
              rl.question("Tags mới: ", (tagInput) => {
                const tags = tagInput.split(",").map((t) => t.trim());
                updateToy(id, name, age, tags);
                promptUser();
              });
            });
          });
        });

        break;
      case "5":
        rl.question("Nhập ID cần xóa: ", (id) => {
          deleteToy(id);

          promptUser();
        });

        break;
      case "0":
        console.log("Cảm ơn bạn đã sử dụng chương trình!");
        rl.close();
        return;
      default:
        console.log("Tùy chọn không hợp lệ. Vui lòng chọn lại.");
        promptUser();
    }
  });
};

promptUser();
