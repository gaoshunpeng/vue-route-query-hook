'use strict';

var vue = require('vue');
var vueRouter = require('vue-router');

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
function useRouteQuery(params, options = {}) {
    const router = vueRouter.useRouter();
    const route = vueRouter.useRoute();
    const { excludeKeys = [], immediate = true, initFromRoute = true, emptyValueHandle = "remove" } = options;
    /**
     * 将路由参数转换为对应类型的值
     *
     * @param routeValue - 来自路由的查询参数值
     * @param originalValue - 原始的响应式参数值，用于类型推断
     * @returns 转换后的值
     *
     * @description
     * 根据原始值的类型自动转换路由参数：
     * - number: 转换为数字，无效时保持原值
     * - boolean: 'true' 转换为 true，其他为 false
     * - string: 直接返回字符串值
     */
    const convertRouteValue = (routeValue, originalValue) => {
        // 处理 null 和 undefined
        if (routeValue === undefined || routeValue === null)
            return originalValue;
        const stringValue = Array.isArray(routeValue) ? routeValue[0] : String(routeValue);
        // 根据原始值的类型进行转换
        if (typeof originalValue === "number") {
            const num = Number(stringValue);
            return isNaN(num) ? originalValue : num;
        }
        else if (typeof originalValue === "boolean") {
            return stringValue === "true";
        }
        return stringValue;
    };
    /**
     * 从路由初始化参数
     *
     * @description
     * 遍历所有配置的参数，从当前路由的查询参数中读取值并设置到对应的响应式参数中。
     * 会跳过 excludeKeys 中指定的字段。
     */
    const initParamsFromRoute = () => {
        for (const key in params) {
            if (excludeKeys.includes(key))
                continue;
            const routeValue = route.query[key];
            if (routeValue !== undefined && routeValue !== null) {
                params[key].value = convertRouteValue(routeValue, params[key].value);
            }
        }
    };
    /**
     * 更新路由查询参数
     *
     * @description
     * 将当前的响应式参数值同步到路由的查询参数中。
     * 会根据 emptyValueHandle 配置处理空值：
     * - 'remove': 移除空值参数
     * - 'keep': 保留空值参数作为空字符串
     * 使用 router.replace 避免产生历史记录。
     */
    const updateRouteQuery = () => {
        const currentQuery = { ...route.query };
        for (const key in params) {
            if (excludeKeys.includes(key))
                continue;
            const value = params[key].value;
            // 处理空值
            if (value === undefined || value === null || value === "") {
                if (emptyValueHandle === "remove") {
                    delete currentQuery[key];
                }
                else {
                    currentQuery[key] = "";
                }
            }
            else {
                currentQuery[key] = String(value);
            }
        }
        // 使用replace避免产生历史记录
        router.replace({
            query: currentQuery,
        });
    };
    /**
     * 手动重置所有参数为初始值
     *
     * @param resetValues - 可选的重置值对象，如果提供则使用指定值，否则使用类型默认值
     *
     * @description
     * 重置所有参数到初始状态：
     * - 如果提供 resetValues，使用指定的值
     * - 否则根据参数类型重置为默认值：
     *   - number: 0
     *   - boolean: false
     *   - string: ""
     * 会跳过 excludeKeys 中指定的字段。
     *
     * @example
     * ```typescript
     * // 重置为默认值
     * resetParams();
     *
     * // 重置为指定值
     * resetParams({
     *   keyword: 'default search',
     *   page: 1
     * });
     * ```
     */
    const resetParams = (resetValues) => {
        for (const key in params) {
            if (excludeKeys.includes(key))
                continue;
            if (resetValues && key in resetValues) {
                params[key].value = resetValues[key];
            }
            else {
                // 重置为对应类型的默认值
                const currentValue = params[key].value;
                if (typeof currentValue === "number") {
                    params[key].value = 0;
                }
                else if (typeof currentValue === "boolean") {
                    params[key].value = false;
                }
                else {
                    params[key].value = "";
                }
            }
        }
    };
    // 监听参数变化并同步到路由
    vue.watch(() => Object.keys(params)
        .filter((key) => !excludeKeys.includes(key))
        .map((key) => params[key].value), () => {
        updateRouteQuery();
    }, {
        deep: true,
        immediate,
    });
    // 组件挂载时从路由初始化参数
    if (initFromRoute) {
        vue.onMounted(() => {
            initParamsFromRoute();
        });
    }
    return {
        updateRouteQuery,
        initParamsFromRoute,
        resetParams,
    };
}

exports.useRouteQuery = useRouteQuery;
