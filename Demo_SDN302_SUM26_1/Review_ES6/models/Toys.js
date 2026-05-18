class Toys {
  constructor(id, name, age, tags = []) {
    this.id = id;
    this.name = name;
    this.age = age;
    this.tags = tags;
  }

  toString() {
    return `${this.name} (ID: ${this.id}) - ${this.age} - Tags: ${this.tags.join(", ")}`;
  }
};



module.exports = Toys;