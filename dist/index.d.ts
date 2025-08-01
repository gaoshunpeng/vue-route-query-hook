import { Ref } from 'vue';

/**
 * 支持的查询参数值类型
 */
type QueryValue = string | number | boolean | undefined | null;
/**
 * 参数配置类型 - 响应式参数对象的键值对
 */
type QueryParams = Record<string, Ref<QueryValue>>;
/**
 * useRouteQuery 配置选项
 */
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
/**
 * useRouteQuery 返回的工具方法
 */
interface UseRouteQueryReturn {
    /**
     * 手动更新路由查询参数
     * @description 将当前参数值同步到路由中
     */
    updateRouteQuery: () => void;
    /**
     * 从路由初始化参数
     * @description 从当前路由的查询参数中读取值并设置到响应式参数中
     */
    initParamsFromRoute: () => void;
    /**
     * 重置参数为初始值
     * @param resetValues - 可选的重置值对象，如果不提供则重置为默认值
     */
    resetParams: (resetValues?: Partial<Record<keyof QueryParams, QueryValue>>) => void;
}
/**
 * 路由查询参数同步 Hook
 *
 * @description
 * 这个 Hook 提供了响应式参数与 URL 查询参数之间的双向同步功能。
 * 当响应式参数发生变化时，会自动更新 URL；当 URL 查询参数变化时，也会更新响应式参数。
 *
 * @author 高顺鹏 <handsome@gaoshunpeng.cn>
 * @since 2025-08-01
 *
 * @param params 要同步的响应式参数对象，key 为路由参数名，value 为响应式引用
 * @param options 配置选项
 *
 * @returns 返回包含工具方法的对象
 *
 * @example
 * ```typescript
 * // 基础用法
 * const searchParams = reactive({
 *   keyword: '',
 *   page: 1,
 *   status: 'active'
 * });
 *
 * const { updateRouteQuery, resetParams } = useRouteQuery({
 *   q: toRef(searchParams, 'keyword'),
 *   page: toRef(searchParams, 'page'),
 *   status: toRef(searchParams, 'status')
 * });
 *
 * // 排除某些字段不同步到路由
 * useRouteQuery(
 *   {
 *     keyword: toRef(searchParams, 'keyword'),
 *     internalFlag: toRef(searchParams, 'internalFlag')
 *   },
 *   {
 *     excludeKeys: ['internalFlag'] // internalFlag 不会同步到路由
 *   }
 * );
 *
 * // 禁用立即执行，手动控制同步时机
 * const { updateRouteQuery } = useRouteQuery(
 *   { status: toRef(searchParams, 'status') },
 *   { immediate: false }
 * );
 * // 在需要的时候手动同步
 * updateRouteQuery();
 * ```
 */
declare function useRouteQuery(params: QueryParams, options?: UseRouteQueryOptions): UseRouteQueryReturn;

export { useRouteQuery };
export type { QueryParams, QueryValue, UseRouteQueryOptions, UseRouteQueryReturn };
