# vue-route-query-hook

中文 | [English](./README.md)

一个用于 Vue 3 的 Composable，提供响应式参数与 URL 查询参数之间的双向同步功能。

[![npm version](https://img.shields.io/npm/v/vue-route-query-hook.svg)](https://www.npmjs.com/package/vue-route-query-hook)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 特性

- 🔄 **双向同步**: 响应式参数与 URL 查询参数自动同步
- 🎯 **类型安全**: 完整的 TypeScript 支持
- ⚙️ **灵活配置**: 支持排除字段、空值处理等多种配置
- 🚀 **Vue 3**: 基于 Vue 3 Composition API
- 📦 **轻量级**: 无额外依赖，仅依赖 Vue 和 Vue Router

## 安装

```bash
npm install vue-route-query-hook
```

或使用 yarn:

```bash
yarn add vue-route-query-hook
```

或使用 pnpm:

```bash
pnpm add vue-route-query-hook
```

## 基础用法

```vue
<template>
  <div>
    <input v-model="searchParams.keyword" placeholder="搜索关键词" />
    <select v-model="searchParams.status">
      <option value="">全部</option>
      <option value="active">激活</option>
      <option value="inactive">未激活</option>
    </select>
    <input v-model.number="searchParams.page" type="number" min="1" />

    <button @click="resetParams()">重置</button>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRef } from "vue";
import { useRouteQuery } from "vue-route-query-hook";

const searchParams = reactive({
  keyword: "",
  status: "",
  page: 1,
});

const { updateRouteQuery, resetParams } = useRouteQuery({
  q: toRef(searchParams, "keyword"),
  status: toRef(searchParams, "status"),
  page: toRef(searchParams, "page"),
});
</script>
```

## API

### useRouteQuery(params, options?)

#### 参数

- **params**: `QueryParams` - 要同步的响应式参数对象

  - key: 路由参数名
  - value: Vue 响应式引用 (Ref)

- **options**: `UseRouteQueryOptions` (可选) - 配置选项

#### 返回值

返回一个包含以下方法的对象：

- **updateRouteQuery**: `() => void` - 手动更新路由查询参数
- **initParamsFromRoute**: `() => void` - 从路由初始化参数
- **resetParams**: `(resetValues?) => void` - 重置参数为初始值

## 配置选项

### UseRouteQueryOptions

```typescript
interface UseRouteQueryOptions {
  /**
   * 排除的字段，这些字段不会同步到路由
   * @default []
   */
  excludeKeys?: string[];

  /**
   * 是否立即执行 watch 监听
   * @default true
   */
  immediate?: boolean;

  /**
   * 是否在组件挂载时从路由初始化参数
   * @default true
   */
  initFromRoute?: boolean;

  /**
   * 空值处理方式
   * - 'remove': 移除参数
   * - 'keep': 保留参数
   * @default 'remove'
   */
  emptyValueHandle?: "remove" | "keep";
}
```

## 高级用法

### 排除某些字段

```typescript
const searchParams = reactive({
  keyword: "",
  internalFlag: false, // 这个字段不需要同步到 URL
});

useRouteQuery(
  {
    q: toRef(searchParams, "keyword"),
    internal: toRef(searchParams, "internalFlag"),
  },
  {
    excludeKeys: ["internal"], // 排除 internal 字段
  }
);
```

### 手动控制同步时机

```typescript
const { updateRouteQuery } = useRouteQuery(
  {
    status: toRef(searchParams, "status"),
  },
  {
    immediate: false, // 禁用自动同步
  }
);

// 在需要的时候手动同步
function handleSubmit() {
  updateRouteQuery();
}
```

### 保留空值参数

```typescript
useRouteQuery(
  {
    q: toRef(searchParams, "keyword"),
  },
  {
    emptyValueHandle: "keep", // 空值时保留参数为空字符串
  }
);
```

### 自定义重置值

```typescript
const { resetParams } = useRouteQuery({
  keyword: toRef(searchParams, "keyword"),
  page: toRef(searchParams, "page"),
});

// 重置为默认值
resetParams();

// 重置为指定值
resetParams({
  keyword: "default search",
  page: 1,
});
```

## 类型支持

该包提供完整的 TypeScript 类型支持：

```typescript
import type {
  QueryValue,
  QueryParams,
  UseRouteQueryOptions,
  UseRouteQueryReturn,
} from "vue-route-query-hook";
```

### 类型定义

```typescript
type QueryValue = string | number | boolean | undefined | null;
type QueryParams = Record<string, Ref<QueryValue>>;
```

## 注意事项

1. **类型转换**: Hook 会根据原始值的类型自动转换路由参数

   - `number`: 转换为数字，无效时保持原值
   - `boolean`: `'true'` 转换为 `true`，其他为 `false`
   - `string`: 直接返回字符串值

2. **历史记录**: 使用 `router.replace` 更新路由，不会产生浏览器历史记录

3. **深度监听**: 自动开启深度监听，支持嵌套对象的变化检测

## 兼容性

- Vue 3.0+
- Vue Router 4.0+

## 仓库地址

- **GitHub**: [https://github.com/gaoshunpeng/vue-route-query-hook](https://github.com/gaoshunpeng/vue-route-query-hook)
- **Gitee**: [https://gitee.com/gao-shunpeng/vue-route-query-hook](https://gitee.com/gao-shunpeng/vue-route-query-hook)

## 贡献指南

### Issue 提交规范

为了更好地维护项目和快速定位问题，请在提交 Issue 时遵循以下规范：

#### Issue 类型

请在 Issue 标题前添加对应的类型标签：

- 🐛 **[Bug]**: 功能异常或错误
- ✨ **[Feature]**: 新功能请求
- 📚 **[Docs]**: 文档相关问题
- ❓ **[Question]**: 使用咨询或疑问
- 💡 **[Enhancement]**: 功能改进建议

#### Issue 模板

**Bug 报告**

```
**问题描述**
简要描述遇到的问题

**重现步骤**
1. 第一步操作
2. 第二步操作
3. 看到错误

**期望行为**
描述期望的正确行为

**实际行为**
描述实际发生的行为

**环境信息**
- Vue 版本:
- Vue Router 版本:
- vue-route-query-hook 版本:
- 浏览器:
- 操作系统:

**代码示例**
提供最小可复现的代码示例

**其他信息**
任何其他有助于定位问题的信息
```

**功能请求**

```
**功能描述**
详细描述希望添加的功能

**使用场景**
说明在什么情况下需要这个功能

**建议实现**
如果有实现思路，请简要说明

**替代方案**
是否考虑过其他解决方案
```

#### 提交须知

1. **搜索现有 Issue**: 提交前请搜索是否已有相似问题
2. **使用中文**: 优先使用中文描述，方便交流
3. **提供完整信息**: 请按照模板提供详细信息
4. **代码格式**: 使用 \`\`\` 包裹代码块
5. **保持礼貌**: 使用友好和建设性的语言

#### 示例

好的 Issue 标题：

- 🐛 [Bug] useRouteQuery 在 SSR 环境下报错
- ✨ [Feature] 支持数组类型的查询参数
- 📚 [Docs] API 文档中缺少 resetParams 参数说明

不好的 Issue 标题：

- 不工作
- 怎么用？
- 有 bug

感谢你的贡献！🎉

## 许可证

MIT

## 作者

高顺鹏 <handsome@gaoshunpeng.cn>
