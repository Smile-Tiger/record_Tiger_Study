// 题 1：使用 Pick 从以下 Article 接口中提取 title 和 summary，形成新类型 ArticlePreview。
interface Article {
  id: number;
  title: string;
  summary: string;
  content: string;
  author: string;
}
type ArticlePreview = Pick<Article, 'title' | 'summary'>

// 题 2：使用 Omit 从 Article 中剔除 content 字段，形成新类型 ArticleList。
type ArticleList = Omit<Article, 'content'>

// 题 3：实现一个函数 updateUser，它接收一个 Partial<User> 类型作为参数，并返回更新后的用户（直接返回参数）。
// （请给这个函数加上正确的 TS 类型注解）
function updateUser(content: Partial<User>): Partial<User>{ return content } 

// 题 4（阿里）：阅读以下代码，请问 Result 的类型是什么？这种写法有什么好处？
interface Props {
  id: number;
  name: string;
  age: number;
}
type Result = Omit<Props, 'id'> & { id: string };
// 答：使用Omit方法进行剔除用户的id，用户的id可能是number存储，通过交叉类型变成string存储，
// 这样在返回给前端时，可以避免number类型可能造成id数据丢失的问题

// 你提到了“避免number类型可能造成id数据丢失”，这确实是真实场景之一（比如后端 MongoDB 返回的是长字符串 ID，
// 前端以前错写成 number 会丢失精度）。但更常见的场景是“覆盖第三方库的固定类型”——比如第三方库把 id 写死了 number，
// 但你的数据库实际是 string，你就可以用这种方式无缝覆盖掉它。

