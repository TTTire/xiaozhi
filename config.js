/**
 * 智养AI配置文件 - BigModel默认配置
 *
 * 此文件将BigModel (智谱AI) 设置为默认AI服务提供商
 * 请填入您的API密钥来启用功能
 */

// ===== BigModel (智谱AI) 默认配置 =====
window.AI_CONFIG = {
  provider: 'bigmodel',
  apiKey: '8053216b1264431799c02a08c86cd213.YcUOAUDbyGuGSs63', // 用户提供的API密钥
  model: 'glm-4',  // 使用标准的glm-4模型
  maxTokens: 2000, // 增加token限制以获得更好的回复
  temperature: 0.7
};

// 请按照以下步骤获取BigModel API密钥：
// 1. 访问 https://open.bigmodel.cn/
// 2. 登录或注册智谱AI账户
// 3. 进入API密钥管理页面
// 4. 创建新的API密钥
// 5. 将上面的 'your-bigmodel-api-key-here' 替换为您的实际密钥

// 如果要使用其他AI提供商，请参考 config-example.js 文件中的示例