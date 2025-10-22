/**
 * 智养AI配置示例文件
 *
 * 使用方法：
 * 1. 复制此文件为 config.js
 * 2. 填入您的API密钥
 * 3. 在 index.html 中引入此文件
 */

// ===== OpenAI 配置示例 =====
window.AI_CONFIG = {
  provider: 'openai',
  apiKey: 'sk-your-openai-api-key-here',
  model: 'gpt-3.5-turbo',
  maxTokens: 1000,
  temperature: 0.7
};

// ===== Claude 配置示例 =====
/*
window.AI_CONFIG = {
  provider: 'claude',
  apiKey: 'sk-ant-your-claude-api-key-here',
  model: 'claude-3-sonnet-20240229',
  maxTokens: 1000,
  temperature: 0.7
};
*/

// ===== Gemini 配置示例 =====
/*
window.AI_CONFIG = {
  provider: 'gemini',
  apiKey: 'your-gemini-api-key-here',
  model: 'gemini-pro',
  maxTokens: 1000,
  temperature: 0.7
};
*/

// ===== 智谱AI (BigModel) 配置示例 =====
/*
window.AI_CONFIG = {
  provider: 'bigmodel',
  apiKey: 'your-bigmodel-api-key-here',
  model: 'glm-4.6',
  maxTokens: 1000,
  temperature: 0.7
};
*/

// ===== 本地服务配置示例 (Ollama) =====
/*
window.AI_CONFIG = {
  provider: 'local',
  baseURL: 'http://localhost:11434',
  model: 'llama2',
  maxTokens: 1000,
  temperature: 0.7
};
*/

// ===== 多环境配置示例 =====
/*
// 根据环境自动选择配置
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

if (isDevelopment) {
  // 开发环境使用本地服务
  window.AI_CONFIG = {
    provider: 'local',
    baseURL: 'http://localhost:11434',
    model: 'llama2',
    maxTokens: 1000,
    temperature: 0.7
  };
} else {
  // 生产环境使用云服务
  window.AI_CONFIG = {
    provider: 'openai',
    apiKey: 'sk-your-production-openai-key-here',
    model: 'gpt-3.5-turbo',
    maxTokens: 1000,
    temperature: 0.7
  };
}
*/

// ===== API密钥获取指南 =====

/*
OpenAI API密钥获取：
1. 访问 https://platform.openai.com/api-keys
2. 登录或注册OpenAI账户
3. 创建新的API密钥
4. 复制密钥并填入上方配置

Claude API密钥获取：
1. 访问 https://console.anthropic.com/
2. 登录或注册Anthropic账户
3. 在API Keys页面创建新密钥
4. 复制密钥并填入上方配置

Gemini API密钥获取：
1. 访问 https://makersuite.google.com/app/apikey
2. 登录Google账户
3. 创建新的API密钥
4. 复制密钥并填入上方配置

智谱AI (BigModel) API密钥获取：
1. 访问 https://open.bigmodel.cn/
2. 登录或注册智谱AI账户
3. 进入API密钥管理页面
4. 创建新的API密钥
5. 复制密钥并填入上方配置

本地服务设置（Ollama）：
1. 安装Ollama：https://ollama.ai/
2. 启动Ollama服务
3. 下载模型：ollama pull llama2
4. 确认服务运行在 http://localhost:11434
*/