# ADR-0002: RESTful API + JWT认证架构

## Status
Accepted (2026-05-08)

## Context
系统采用前后端分离架构，需要：
- 统一的API设计规范
- 安全的用户认证和授权机制
- 支持第三方平台的OAuth集成
- 良好的跨平台支持（Web、未来可能的移动App）

## Decision
采用**RESTful API设计规范** + **JWT认证** + **OAuth 2.0第三方授权**。

### 核心组件

#### 1. RESTful API设计
- **资源导向**：URL设计围绕资源（articles、comments、images）
- **HTTP方法语义**：GET（查询）、POST（创建）、PUT/PATCH（更新）、DELETE（删除）
- **状态码规范**：200（成功）、201（创建）、400（客户端错误）、401（未认证）、403（无权限）、500（服务器错误）
- **版本控制**：通过URL路径版本化（/api/v1/...）

#### 2. JWT认证机制
- **AccessToken**：短期有效（15分钟），包含用户身份和权限
- **RefreshToken**：长期有效（7天），用于刷新AccessToken
- **Token存储**：AccessToken存在内存，RefreshToken存在HttpOnly Cookie
- **Token刷新**：AccessToken过期时自动用RefreshToken刷新

#### 3. OAuth 2.0集成
- **角色**：作为OAuth客户端，集成知乎、X等平台的授权
- **授权流程**：Authorization Code Flow
- **Token管理**：加密存储第三方平台的Access Token

## Consequences

### 正面影响
1. **标准化API设计**
   - 遵循REST最佳实践
   - 良好的可预测性和一致性
   - 便于API文档生成（Swagger/OpenAPI）

2. **无状态认证**
   - 服务器无需维护会话状态
   - 支持水平扩展
   - 跨域支持良好

3. **安全性**
   - JWT签名防止篡改
   - RefreshToken机制减少暴露风险
   - OAuth 2.0标准流程安全可靠

4. **跨平台支持**
   - 统一的API接口适用于Web、移动App等
   - JWT Token便于多种客户端集成

### 负面影响
1. **Token刷新复杂性**
   - 需要处理Token过期和刷新逻辑
   - RefreshToken失效需要重新登录
   - 缓解：前端封装统一的HTTP客户端处理刷新

2. **JWT撤销问题**
   - JWT无法在过期前主动撤销
   - 缓解：短有效期+黑名单机制（必要时）

3. **Token大小**
   - JWT包含较多信息，HTTP头较大
   - 影响：对个人站点可忽略

## API设计示例

### 认证相关
```
POST   /api/v1/auth/register       # 用户注册
POST   /api/v1/auth/login          # 用户登录
POST   /api/v1/auth/refresh        # 刷新Token
POST   /api/v1/auth/logout         # 登出
```

### 文章相关
```
GET    /api/v1/articles            # 获取文章列表
GET    /api/v1/articles/:id        # 获取文章详情
POST   /api/v1/articles            # 创建文章
PUT    /api/v1/articles/:id        # 更新文章
DELETE /api/v1/articles/:id        # 删除文章
POST   /api/v1/articles/:id/publish # 发布文章
```

### 平台授权相关
```
GET    /api/v1/platforms/:id/auth-url    # 获取授权URL
POST   /api/v1/platforms/:id/callback    # OAuth回调
GET    /api/v1/platforms/accounts        # 获取已授权账号
```

## Security Considerations

### JWT安全
- 使用强加密算法（RS256或ES256）
- 短期AccessToken（15分钟）
- RefreshToken存储在HttpOnly Cookie
- 验证Token签名和过期时间

### API安全
- HTTPS加密传输
- CORS配置限制允许的源
- Rate Limiting防止暴力攻击
- 输入验证和SQL注入防护
- CSRF Token（可选，JWT本身有防护）

### OAuth安全
- State参数防止CSRF
- PKCE增强安全性（移动端）
- 加密存储第三方Token
- 定期刷新长期Token

## Implementation Notes

### 前端HTTP客户端封装
```typescript
// 伪代码示例
class ApiClient {
  async request(url, options) {
    let token = getAccessToken();
    if (isTokenExpired(token)) {
      token = await refreshAccessToken();
    }
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      }
    });
  }
}
```

### Token刷新策略
- 前端拦截401响应
- 自动调用Refresh API
- 刷新失败则跳转登录页

## Alternatives Considered

### 选项A：Session-Based认证
**优点**：简单、可主动撤销
**缺点**：服务器维护状态、扩展性差
**不选原因**：前后端分离架构下JWT更合适

### 选项B：API Key认证
**优点**：简单、无状态
**缺点**：安全性差、无法区分用户
**不选原因**：需要用户身份识别和权限控制

## References
- RFC 6749 (OAuth 2.0)
- RFC 7519 (JSON Web Token)
- RESTful API Design Best Practices

---

**Created**: 2026-05-08
**Author**: HF Design Workflow
