# vue-route-query-hook

A Vue 3 Composable that provides two-way synchronization between reactive parameters and URL query parameters.

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

## License

MIT

## Author

高顺鹏 <handsome@gaoshunpeng.cn>
