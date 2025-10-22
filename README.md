# 智养AI - 您的专属营养教练

## 项目简介

智养AI是一个全新的AI营养师网站，旨在为"渴望健康却不堪重负的个体"提供个性化的健康指导。我们结合前沿的营养科学与温暖的人文关怀，打造了一个既科学严谨又充满人情味的健康伙伴。

## 核心价值

**品牌人格：共情科学家**
- 科学严谨、值得信赖和精确
- 温暖、支持性和充满人情味
- 知识渊博、平静且鼓舞人心

## 技术架构

### 前端技术栈
- **HTML5** - 语义化标签，符合现代Web标准
- **CSS3** - 基于设计系统的模块化样式
- **JavaScript ES6+** - 现代JavaScript特性，面向对象编程
- **Web APIs** - Intersection Observer, RequestAnimationFrame等

### 设计系统

#### 色彩体系 - 质朴的精致感
```css
--color-sage-green: #C9D3CA      /* 鼠尾草绿 */
--color-warm-taupe: #A39384      /* 暖灰褐色 */
--color-deep-charcoal: #161313   /* 深炭色 */
--color-communicative-blue: #254B5A /* 沟通蓝 */
```

#### 字体系统
```css
--font-serif: 'Lora', serif           /* 标题字体 */
--font-sans: 'Inter', sans-serif      /* 正文字体 */
```

## 功能特性

### 1. 专属AI教练
- **24/7智能对话**：随时可用的营养咨询
- **个性化建议**：基于用户数据的定制化指导
- **情感理解**：共情式对话，提供温暖支持

### 2. 轻松拍照记录
- **智能识别**：95%以上准确率的食物识别
- **自动计算**：营养成分和卡路里自动分析
- **批量记录**：节省时间的记录方式

### 3. 预测性健康洞察
- **趋势分析**：基于数据的健康模式识别
- **预警系统**：个性化的健康风险提醒
- **可行建议**：具体的改善方案

## 网站架构

### 滚动式故事体验
网站采用7个精心设计的章节：

1. **Hero区域** - "健康之路，不必复杂"
2. **问题共鸣** - 用户痛点展示
3. **解决方案** - AI教练介绍
4. **功能特色** - 核心功能详解
5. **AI对话演示** - 交互式体验
6. **工作原理** - 使用流程说明
7. **用户故事** - 真实案例分享

### 页面结构
```
/
├── 导航栏（固定顶部）
├── Hero区域（全屏）
├── 问题共鸣
├── 解决方案
├── 功能特色
├── AI对话演示
├── 工作原理
├── 用户故事（轮播）
├── 会员计划
├── 最终CTA
└── 页脚
```

## 交互设计

### 微交互效果
- **滚动动画**：渐入效果和视差滚动
- **悬停状态**：卡片浮起和阴影变化
- **加载动画**：打字效果和数字递增
- **响应式反馈**：按钮状态变化

### 性能优化
- **懒加载**：图片和组件按需加载
- **防抖节流**：优化滚动和输入事件
- **Intersection Observer**：高效的元素可见性检测
- **RequestAnimationFrame**：流畅的动画性能

## 文件结构

```
营养师/
├── index.html          # 主页面
├── styles.css          # 样式文件
├── script.js           # 交互脚本
├── ai-service.js       # AI服务模块
├── config-example.js   # 配置示例文件
└── README.md           # 项目文档
```

## 使用方法

### 本地运行
1. 将所有文件下载到本地目录
2. 使用浏览器打开 `index.html`
3. 或使用本地服务器运行：
```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve .

# 访问
http://localhost:8000
```

### AI功能配置

#### 方法一：使用配置界面（推荐）
1. 打开网站后，点击导航栏的"⚙️ 设置"按钮
2. 在弹出的配置界面中选择AI服务提供商
3. 输入相应的API密钥
4. 点击"测试连接"验证配置
5. 保存配置后即可使用真实AI对话

#### 方法二：使用配置文件
1. 复制 `config-example.js` 为 `config.js`
2. 编辑 `config.js`，填入您的API密钥
3. 在 `index.html` 中添加配置文件引用：
```html
<script src="config.js"></script>
<script src="ai-service.js"></script>
<script src="script.js"></script>
```

#### 支持的AI服务提供商

| 提供商 | 获取API密钥 | 支持的模型 |
|--------|-------------|------------|
| **OpenAI** | [platform.openai.com](https://platform.openai.com/api-keys) | GPT-3.5 Turbo, GPT-4, GPT-4 Turbo |
| **Claude** | [console.anthropic.com](https://console.anthropic.com/) | Claude-3 Sonnet, Claude-3 Opus, Claude-3 Haiku |
| **Gemini** | [makersuite.google.com](https://makersuite.google.com/app/apikey) | Gemini Pro, Gemini Pro Vision |
| **智谱AI** | [open.bigmodel.cn](https://open.bigmodel.cn/) | GLM-4.6, GLM-4, GLM-4 Plus |
| **本地服务** | 安装 [Ollama](https://ollama.ai/) | Llama 2, Code Llama, Mistral |

#### 快速配置命令

在浏览器控制台中运行以下命令可快速配置：

```javascript
// OpenAI 配置
app.setAIConfig({
  provider: 'openai',
  apiKey: 'sk-your-openai-api-key-here',
  model: 'gpt-3.5-turbo'
});

// Claude 配置
app.setAIConfig({
  provider: 'claude',
  apiKey: 'sk-ant-your-claude-api-key-here',
  model: 'claude-3-sonnet-20240229'
});

// 智谱AI (BigModel) 配置
app.setAIConfig({
  provider: 'bigmodel',
  apiKey: 'your-bigmodel-api-key-here',
  model: 'glm-4.6'
});

// 本地服务配置
app.setAIConfig({
  provider: 'local',
  baseURL: 'http://localhost:11434',
  model: 'llama2'
});
```

### 功能特性

#### AI对话模式
- **演示模式**：使用预设回复，无需配置API
- **真实AI模式**：连接真实AI服务，支持智能对话
- **模式切换**：点击导航栏的"🎭 演示模式/🤖 真实AI"按钮切换

#### 智能回复特点
- **共情科学家人格**：专业严谨且温暖支持
- **营养专业知识**：基于科学的健康建议
- **个性化对话**：根据用户上下文提供定制化回复
- **非评判态度**：理解用户的饮食习惯，不苛责

### 部署到生产环境
1. 上传文件到Web服务器
2. 确保服务器支持HTTPS（推荐）
3. 配置适当的缓存策略

## 响应式设计

### 断点设置
- **桌面端**：> 1024px
- **平板端**：768px - 1024px
- **手机端**：< 768px

### 适配策略
- **弹性布局**：Grid和Flexbox响应式网格
- **相对单位**：rem, em, vh/vw
- **媒体查询**：针对不同设备的样式优化
- **触摸优化**：移动端交互体验提升

## 无障碍设计

### ARIA标签
- 语义化HTML标签
- 适当的ARIA角色和属性
- 键盘导航支持

### 可访问性特性
- **高对比度模式**：支持系统级高对比度设置
- **减少动画**：尊重用户的动画偏好设置
- **焦点管理**：清晰的焦点指示器
- **屏幕阅读器**：内容结构化标记

## 浏览器兼容性

### 支持的浏览器
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

### 渐进增强
- **核心功能**：在所有现代浏览器中正常工作
- **高级特性**：在不支持的浏览器中优雅降级
- **Polyfills**：必要时添加兼容性支持

## 性能指标

### 加载性能
- **首次内容绘制（FCP）**：< 1.5s
- **最大内容绘制（LCP）**：< 2.5s
- **累积布局偏移（CLS）**：< 0.1
- **首次输入延迟（FID）**：< 100ms

### 优化策略
- **代码分割**：按需加载JavaScript模块
- **图片优化**：WebP格式和响应式图片
- **CSS优化**：关键CSS内联，非关键CSS异步加载
- **缓存策略**：适当的浏览器缓存设置

## 维护指南

### 代码规范
- **HTML**：语义化标签，合理的文档结构
- **CSS**：BEM命名规范，模块化样式
- **JavaScript**：ES6+特性，面向对象设计

### 更新流程
1. **功能开发**：在开发环境测试新功能
2. **兼容性测试**：跨浏览器和设备测试
3. **性能检查**：使用Lighthouse等工具评估
4. **部署更新**：备份后部署到生产环境

### 故障排除
- **控制台错误**：检查JavaScript错误和警告
- **网络问题**：确认资源加载状态
- **样式问题**：验证CSS计算值
- **交互问题**：检查事件监听器状态

## 未来规划

### 短期目标（1-3个月）
- [ ] 添加更多AI对话场景
- [ ] 优化移动端体验
- [ ] 增加数据可视化功能
- [ ] 集成用户反馈系统

### 中期目标（3-6个月）
- [ ] 开发移动应用
- [ ] 添加社交分享功能
- [ ] 实现用户账户系统
- [ ] 增加营养数据库

### 长期目标（6-12个月）
- [ ] AI算法优化
- [ ] 多语言支持
- [ ] 可穿戴设备集成
- [ ] 个性化推荐系统

## 贡献指南

### 开发环境设置
1. Fork项目仓库
2. 创建功能分支：`git checkout -b feature/new-feature`
3. 提交更改：`git commit -m 'Add new feature'`
4. 推送分支：`git push origin feature/new-feature`
5. 提交Pull Request

### 代码审查标准
- 代码符合项目规范
- 功能测试通过
- 性能影响评估
- 文档更新完整

## 联系方式

- **项目维护者**：开发团队
- **技术支持**：support@zhiyangai.com
- **商务合作**：business@zhiyangai.com

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

**智养AI** - 让健康之旅变得简单、温暖且可持续。