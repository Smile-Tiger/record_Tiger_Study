## 关于Vue（从面试问题去学）

## React Hooks 和 Vue Composable的区别

| 维度        | React Hooks                                                | Vue Composable                                                                        |
| --------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **调用顺序**  | **极其严格**。必须在组件顶层调用，不能放在 `if` 或 `for` 里，因为 React 靠调用顺序匹配状态。 | **无限制**。可以放在 `if` 里，可以放在 `setTimeout` 里。因为 Vue 的状态（`ref`）是通过**变量引用**（闭包）来追踪的，不依赖调用顺序。 |
| **响应式更新** | 返回的 `setX` 函数是稳定的。如果返回普通对象，对象变了但引用没变，React 不知道要更新。         | 返回的 `ref` 或 `reactive` 自带响应式代理。无论你怎么解构（只要用 `toRefs`），数据变了，视图必变。                       |
| **心智负担**  | 必须手动写依赖数组（`useCallback`、`useMemo`、`useEffect` 的依赖）。        | `watch` 虽然也有依赖，但 `watchEffect` 自动收集依赖，大部分情况不用手动填数组。                                   |

关于调用顺序的问题：React内部是一个链表顺序排列，如果放到if或for，useState可能存在不执行的情况，此时链表顺序混乱。而Vue的话会一直记住所定义的变量。

关于响应式更新

```JavaScript
const updateAge = () => {
    // ❌ 错误写法：直接修改同一个对象
    user.age = 19;
    setUser(user); // React 认为 user 的引用没变，不触发更新

    // ✅ 正确写法：创建一个新对象
    setUser({ ...user, age: 19 }); // 引用变了，触发更新
  };
// React 不关心你对象里的内容变没变，它只关心对象的“引用（内存地址）”变没变。


const user = ref({ name: '张三', age: 18 });

function updateAge() {
  // ✅ Vue 检测到 user.value 的 age 变了，自动更新视图
  user.value.age = 19; // 不需要创建新对象
}
// Vue 的 ref 是一个响应式代理，它会在你修改 .value 时自动检测变化并触发更新。
```

心智负担（只是一个名词）：**为了用好这个能力，你需要花费多少脑力去思考“该怎么做才不出错”。**

这里的心智负担指的是：**为了实现响应式更新，你额外需要操的心**

```JavaScript
useEffect(() => {
  console.log(count);
}, [count]); // 必须写 [count]，否则不知道 count 变了

// watchEffect 会自动追踪它所用到响应式变量
watchEffect(() => {
  console.log(count.value); // Vue 自动知道它依赖了 count
});
```

## Vue2和Vue3的响应式原理、ref和reactive的区别

**Vue 2 和 Vue 3 的响应式核心区别是：Vue 2 用 **`Object.defineProperty`** 劫持对象属性，无法监听新增和删除，数组需要 hack；Vue 3 用 **`Proxy`** 代理整个对象，可以监听增删改，且采用懒代理提升性能。**

`ref`** 适合基本类型，通过 **`.value`** 访问，可以整体替换；**`reactive`** 适合对象，直接访问属性，但不能整体替换。在模板中，**`ref`** 会自动解包，不需要写 **`.value`**。**

关于Vue2的响应式，我讲解更详细些

**Vue 2 就是靠 **`Object.defineProperty`** 只能给对象已有属性加上 **`getter`** 和 **`setter`**，从而在数据被读取或修改时收集依赖 / 触发更新，如果你新增或删除属性，Vue 2 根本不知道它的存在，自然就无法监听它的变化。**

`Object.defineProperty` 也可以给数组的索引（如 `arr[0]`）添加 getter/setter，但**直接修改数组索引或 **`length`** 不会触发 setter**：

```JavaScript
const arr = [1, 2, 3];

// ❌ 这样不会触发更新（Vue 2 不会检测到）
arr[0] = 999;
arr.length = 0;

// ✅ 必须用变异方法才能触发更新
arr.push(4);
arr.pop();
arr.splice(1, 1);
```

所以 Vue 2 内部**重写了数组的 **`push`**、**`pop`**、**`shift`**、**`unshift`**、**`splice`**、**`sort`**、**`reverse`** 这 7 个方法**，让它们在执行原生操作的同时，额外触发视图更新。这就是“数组需要 hack”的意思。
