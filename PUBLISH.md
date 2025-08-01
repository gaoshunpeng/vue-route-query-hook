# 发布指南

## npm包发布步骤

### 1. 登录npm账户

```bash
npm login
```

输入你的npm用户名、密码和邮箱。

### 2. 检查包信息

```bash
npm pack --dry-run
```

这会显示将要发布的文件列表，确认包含了正确的文件。

### 3. 发布包

```bash
npm publish
```

### 4. 发布后验证

访问 https://www.npmjs.com/package/vue-route-query-hook 确认包已成功发布。

## 版本管理

### 更新版本号

```bash
# 补丁版本 (1.0.0 -> 1.0.1)
npm version patch

# 次要版本 (1.0.0 -> 1.1.0)
npm version minor

# 主要版本 (1.0.0 -> 2.0.0)
npm version major
```

### 发布新版本

```bash
npm version patch  # 或 minor/major
npm publish
```

## 注意事项

1. **包名唯一性**: 确保包名在npm上是唯一的
2. **版本语义化**: 遵循语义化版本规范
3. **文档更新**: 发布前确保README.md内容准确
4. **测试**: 确保所有功能正常工作
5. **Git标签**: npm version会自动创建git标签

## 测试安装

发布后可以在其他项目中测试安装：

```bash
npm install vue-route-query-hook
```

然后测试导入：

```typescript
import { useRouteQuery } from "vue-route-query-hook";
```

## 包信息

- **包名**: vue-route-query-hook
- **当前版本**: 1.0.0
- **许可证**: MIT
- **作者**: 高顺鹏
- **仓库**: 需要更新package.json中的repository字段为实际的git仓库地址

## 发布前检查清单

- [ ] 代码构建成功 (`npm run build`)
- [ ] 类型检查通过 (`npm run type-check`)
- [ ] README.md文档完整
- [ ] package.json信息正确
- [ ] 版本号合适
- [ ] 许可证文件存在
- [ ] .npmignore配置正确
