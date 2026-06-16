## **1. 基本类定义 vs 构造函数**

```JavaScript
// 构造函数
function Person(name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.sayHello = function() {
  console.log(`你好，我是 ${this.name}`);
};

// class
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  sayHello() {
    console.log(`你好，我是 ${this.name}`);
  }
}
```

**对应关系**：

- `constructor` 方法 = 构造函数体
- 类中的普通方法 = 挂在原型上的方法

## **2. 静态属性和方法**

```JavaScript
// 构造函数
Person.staticMethod = function() {
  console.log('我是静态方法');
};
Person.staticProp = '静态属性';

// class
class Person {
  static staticMethod() {
    console.log('我是静态方法');
  }
  static staticProp = '静态属性';
}
```

**对应关系**：

- `static` 方法/属性 = 直接挂在构造函数上的方法/属性

## **3. 继承**

```JavaScript
// 构造函数
function Student(name, age, grade) {
  Person.call(this, name, age); // 调用父类构造函数
  this.grade = grade;
}
Student.prototype = Object.create(Person.prototype);
Student.prototype.constructor = Student;
Student.prototype.study = function() {
  console.log(`${this.name} 正在学习`);
};

// class
class Student extends Person {
  constructor(name, age, grade) {
    super(name, age); // 调用父类构造函数
    this.grade = grade;
  }
  study() {
    console.log(`${this.name} 正在学习`);
  }
}
```

**对应关系**：

- `extends` = `Object.create(Parent.prototype)` + 修正 `constructor`
- `super()` = `Parent.call(this, ...)`
- `super.method()` = `Parent.prototype.method.call(this, ...)`

## **4. 私有属性/方法**

```JavaScript
// 构造函数（通过闭包模拟）
function Wallet(initial) {
  let balance = initial; // 私有
  this.getBalance = function() {
    return balance;
  };
  this.add = function(amount) {
    balance += amount;
  };
}

// class（使用 #）
class Wallet {
  #balance = 0;
  constructor(initial) {
    this.#balance = initial;
  }
  getBalance() {
    return this.#balance;
  }
  add(amount) {
    this.#balance += amount;
  }
}
```

**对应关系**：

- class 的 `#` 私有字段更接近真正意义上的私有，比闭包更清晰。

## **5. 实例属性写法（不写在 constructor 里）**

javascript

```JavaScript
// 构造函数（只能在构造函数里写）
function Person(name) {
  this.name = name;
  this.type = '人类';
}

// class
class Person {
  type = '人类'; // 直接写在类里
  constructor(name) {
    this.name = name;
  }
}
```

## **6. Getter / Setter**

```JavaScript
// 构造函数（需要定义在原型上或使用 Object.defineProperty）
function User(first, last) {
  this.first = first;
  this.last = last;
}
// 定义一个属性在你需要操作的对象中，精确操作
Object.defineProperty(User.prototype, 'fullName', {
  get() { return this.first + ' ' + this.last; },
  set(val) { /* ... */ }
});

// class
class User {
  constructor(first, last) {
    this.first = first;
    this.last = last;
  }
  get fullName() {
    return this.first + ' ' + this.last;
  }
  set fullName(val) {
    const parts = val.split(' ');
    this.first = parts[0];
    this.last = parts[1];
  }
}
```

