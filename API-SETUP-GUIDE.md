# 🤖 智养AI API配置指南

## 🚀 快速开始

### 1. 打开配置界面
访问网站后，点击导航栏右上角的 **"⚙️ 设置"** 按钮

### 2. 选择AI提供商
我们支持以下AI服务：

| 🤖 OpenAI | 🧠 Claude | ✨ Gemini | 🏠 本地服务 |
|-----------|-----------|-----------|-------------|
| GPT-3.5/4 | Claude-3 | Gemini Pro | Ollama等 |

### 3. 配置API密钥

#### 🔑 OpenAI设置
1. 访问 [OpenAI API控制台](https://platform.openai.com/api-keys)
2. 登录并创建新的API密钥
3. 复制密钥并粘贴到配置界面
4. 选择模型：推荐 `gpt-3.5-turbo`（性价比高）或 `gpt-4`（质量更好）

#### 🔑 Claude设置
1. 访问 [Anthropic控制台](https://console.anthropic.com/)
2. 创建API密钥
3. 选择模型：推荐 `claude-3-sonnet-20240229`

#### 🔑 Gemini设置
1. 访问 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 创建API密钥
3. 选择模型：推荐 `gemini-pro`

#### 🚀 智谱AI (BigModel)设置
1. 访问 [智谱AI开放平台](https://open.bigmodel.cn/)
2. 登录或注册账户
3. 进入API密钥管理页面
4. 创建API密钥
5. 选择模型：推荐 `glm-4.6`

#### 🏠 本地服务设置（Ollama）
1. 安装 [Ollama](https://ollama.ai/)
2. 启动服务：`ollama serve`
3. 下载模型：`ollama pull llama2`
4. 在配置中设置服务地址：`http://localhost:11434`

### 4. 测试连接
点击 **"测试连接"** 按钮验证配置是否正确

### 5. 保存配置
点击 **"保存配置"** 完成设置

---

## 💡 使用技巧

### 对话模式切换
- **🎭 演示模式**：使用预设回复，无需API
- **🤖 真实AI模式**：连接真实AI，智能对话

点击导航栏的模式切换按钮可在两种模式间切换

### 优化对话质量
- **温度设置**：0.7为平衡点，更高更有创意，更低更保守
- **最大长度**：建议1000 tokens，足够详细回复
- **模型选择**：根据需求和预算选择合适模型

### 常见问题

**Q: API密钥安全吗？**
A: 密钥仅存储在浏览器本地，不会上传到任何服务器

**Q: 如何切换AI提供商？**
A: 重新打开设置界面，选择新的提供商并配置

**Q: 本地服务如何设置？**
A: 安装Ollama后，确保服务运行在默认端口11434

**Q: API费用如何计算？**
A: 各提供商按token使用量计费，建议查看官方定价

---

## 🔧 高级配置

### 通过代码配置
在浏览器控制台运行：
```javascript
// 快速配置OpenAI
app.setAIConfig({
  provider: 'openai',
  apiKey: 'your-api-key-here',
  model: 'gpt-3.5-turbo'
});

// 快速配置智谱AI (BigModel)
app.setAIConfig({
  provider: 'bigmodel',
  apiKey: 'your-bigmodel-api-key-here',
  model: 'glm-4.6'
});
```

### 配置文件方式
1. 复制 `config-example.js` 为 `config.js`
2. 编辑配置文件
3. 在HTML中引入：`<script src="config.js"></script>`

---

## 🆘 故障排除

### 连接失败
- 检查API密钥是否正确
- 确认网络连接正常
- 验证API服务商状态

### 回复质量不佳
- 调整温度参数
- 尝试不同模型
- 检查对话历史是否过长

### 本地服务问题
- 确认Ollama服务正在运行
- 检查端口是否被占用
- 验证模型是否已下载

---

## 📞 获取帮助

如遇到问题，可以：
1. 查看浏览器控制台错误信息
2. 访问我们的GitHub仓库
3. 联系技术支持：support@zhiyangai.com

---

**💬 提示**：首次使用建议先在演示模式下熟悉功能，再配置真实API服务。