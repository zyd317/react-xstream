# react-xstream
基于[xstream]封装的react响应式状态管理解决方案

### 前言
在react项目中，我们通常会根据具体的业务场景选择Redux或者Mbox来集中管理我们的状态，一是可以解决组件通信问题，二是状态与组件之间职责划分更加解耦清晰。但是存在以下几个问题：

>1. Redux、Mbox本身的功能有限，通过action -> state映射关系，适用于同步状态的管理，却无法优雅地处理异步数据，对于复杂的异步数据聚合、分发处理更是无能为力。
>2. Redux一般用于全局Model（Redux本身没有全局、局部的概念，但是我们一般搭配Provider在根组件注入Store此时就是全局状态，如果适用多个Provider在多处注入不同的Store，这就划分出局部Model了）。全局Model的一个缺点提升了局部状态的作用域，当其对应的组件卸载时我们需要手动清除状态，状态没有生命周期的概念。例如在SPA单页应用中页面进入/跳转时，需要手动初始化/清除状态。

react-xstream结合xstream响应式编程的优势，为组件更好地管理响应式状态。并且状态生命周期随组件生命周期。

### build
1. npm run dev // build
2. npm run start // dev-server
3. http://127.0.0.1:8088/src/test/index.html