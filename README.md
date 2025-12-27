# vue-route-query-hook

[中文](./README-zh.md) | English

A Vue 3 Composable that provides two-way synchronization between reactive parameters and URL query parameters.

[![npm version](https://img.shields.io/npm/v/vue-route-query-hook.svg)](https://www.npmjs.com/package/vue-route-query-hook)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🔄 **Two-way Sync**: Automatic synchronization between reactive parameters and URL query parameters
- 🎯 **Type Safe**: Full TypeScript support
- ⚙️ **Flexible Configuration**: Support for excluding fields, empty value handling, and various other configurations
- 🚀 **Vue 3**: Built on Vue 3 Composition API
- 📦 **Lightweight**: No extra dependencies, only depends on Vue and Vue Router

## Installation

```bash
npm install vue-route-query-hook
```

Or using yarn:

```bash
yarn add vue-route-query-hook
```

Or using pnpm:

```bash
pnpm add vue-route-query-hook
```

## Basic Usage

```vue
<template>
  <div>
    <input v-model="searchParams.keyword" placeholder="Search keyword" />
    <select v-model="searchParams.status">
      <option value="">All</option>
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select>
    <input v-model.number="searchParams.page" type="number" min="1" />

    <button @click="resetParams()">Reset</button>
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

#### Parameters

- **params**: `QueryParams` - The reactive parameter object to synchronize

  - key: Route parameter name
  - value: Vue reactive reference (Ref)

- **options**: `UseRouteQueryOptions` (optional) - Configuration options

#### Return Value

Returns an object containing the following methods:

- **updateRouteQuery**: `() => void` - Manually update route query parameters
- **initParamsFromRoute**: `() => void` - Initialize parameters from route
- **resetParams**: `(resetValues?) => void` - Reset parameters to initial values

## Configuration Options

### UseRouteQueryOptions

```typescript
interface UseRouteQueryOptions {
  /**
   * Excluded fields that will not be synchronized to the route
   * @default []
   */
  excludeKeys?: string[];

  /**
   * Whether to immediately execute watch listener
   * @default true
   */
  immediate?: boolean;

  /**
   * Whether to initialize parameters from route when component is mounted
   * @default true
   */
  initFromRoute?: boolean;

  /**
   * Empty value handling method
   * - 'remove': Remove parameter
   * - 'keep': Keep parameter
   * @default 'remove'
   */
  emptyValueHandle?: "remove" | "keep";
}
```

## Advanced Usage

### Excluding Certain Fields

```typescript
const searchParams = reactive({
  keyword: "",
  internalFlag: false, // This field doesn't need to sync to URL
});

useRouteQuery(
  {
    q: toRef(searchParams, "keyword"),
    internal: toRef(searchParams, "internalFlag"),
  },
  {
    excludeKeys: ["internal"], // Exclude internal field
  }
);
```

### Manual Control of Synchronization Timing

```typescript
const { updateRouteQuery } = useRouteQuery(
  {
    status: toRef(searchParams, "status"),
  },
  {
    immediate: false, // Disable automatic synchronization
  }
);

// Manually synchronize when needed
function handleSubmit() {
  updateRouteQuery();
}
```

### Keep Empty Value Parameters

```typescript
useRouteQuery(
  {
    q: toRef(searchParams, "keyword"),
  },
  {
    emptyValueHandle: "keep", // Keep parameter as empty string when empty
  }
);
```

### Custom Reset Values

```typescript
const { resetParams } = useRouteQuery({
  keyword: toRef(searchParams, "keyword"),
  page: toRef(searchParams, "page"),
});

// Reset to default values
resetParams();

// Reset to specified values
resetParams({
  keyword: "default search",
  page: 1,
});
```

## Type Support

This package provides full TypeScript type support:

```typescript
import type {
  QueryValue,
  QueryParams,
  UseRouteQueryOptions,
  UseRouteQueryReturn,
} from "vue-route-query-hook";
```

### Type Definitions

```typescript
type QueryValue = string | number | boolean | undefined | null;
type QueryParams = Record<string, Ref<QueryValue>>;
```

## Important Notes

1. **Type Conversion**: The hook automatically converts route parameters based on the type of original values

   - `number`: Converts to number, keeps original value if invalid
   - `boolean`: `'true'` converts to `true`, others to `false`
   - `string`: Returns string value directly

2. **History**: Uses `router.replace` to update routes, which doesn't create browser history entries

3. **Deep Watching**: Automatically enables deep watching, supports change detection for nested objects

## Compatibility

- Vue 3.0+
- Vue Router 4.0+

## Repository

- **GitHub**: [https://github.com/gaoshunpeng/vue-route-query-hook](https://github.com/gaoshunpeng/vue-route-query-hook)
- **Gitee**: [https://gitee.com/gao-shunpeng/vue-route-query-hook](https://gitee.com/gao-shunpeng/vue-route-query-hook)

## Contributing

### Issue Submission Guidelines

To better maintain the project and quickly locate issues, please follow these guidelines when submitting Issues:

#### Issue Types

Please add the corresponding type label before the Issue title:

- 🐛 **[Bug]**: Functional anomalies or errors
- ✨ **[Feature]**: New feature requests
- 📚 **[Docs]**: Documentation-related issues
- ❓ **[Question]**: Usage consultation or questions
- 💡 **[Enhancement]**: Feature improvement suggestions

#### Issue Templates

**Bug Report**

```
**Bug Description**
Briefly describe the encountered issue

**Steps to Reproduce**
1. First operation step
2. Second operation step
3. See error

**Expected Behavior**
Describe the expected correct behavior

**Actual Behavior**
Describe the actual behavior that occurred

**Environment Information**
- Vue version:
- Vue Router version:
- vue-route-query-hook version:
- Browser:
- Operating System:

**Code Example**
Provide minimal reproducible code example

**Additional Information**
Any other information that helps locate the issue
```

**Feature Request**

```
**Feature Description**
Detailed description of the desired feature

**Use Case**
Explain when this feature would be needed

**Suggested Implementation**
If you have implementation ideas, please briefly explain

**Alternative Solutions**
Whether other solutions have been considered
```

#### Submission Guidelines

1. **Search Existing Issues**: Please search for similar issues before submitting
2. **Use English**: Use English for international communication
3. **Provide Complete Information**: Please provide detailed information according to the template
4. **Code Formatting**: Use \`\`\` to wrap code blocks
5. **Be Polite**: Use friendly and constructive language

#### Examples

Good Issue titles:

- 🐛 [Bug] useRouteQuery throws error in SSR environment
- ✨ [Feature] Support array type query parameters
- 📚 [Docs] Missing resetParams parameter description in API documentation

Bad Issue titles:

- Doesn't work
- How to use?
- There's a bug

Thank you for your contribution! 🎉

## License

MIT

## Author

高顺鹏 <handsome@gaoshunpeng.cn>
