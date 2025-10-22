// ===== AI服务模块 - 修复版本 =====
class AIService {
  constructor(config = {}) {
    this.config = {
      provider: config.provider || 'bigmodel', // 默认使用BigModel
      apiKey: config.apiKey || null,
      baseURL: config.baseURL || null,
      model: config.model || null,
      maxTokens: config.maxTokens || 1000,
      temperature: config.temperature || 0.7,
      ...config
    };

    this.conversationHistory = [];
    this.systemPrompt = this.getSystemPrompt();
    this.jwtToken = null;
    this.tokenExpiry = null;
  }

  // 获取系统提示词
  getSystemPrompt() {
    return `你是一位专业的AI营养教练，名为"智养AI"。你的角色特征是"共情科学家" - 既科学严谨又温暖支持。

核心指导原则：
1. **共情优先**：理解用户的情感需求，不评判任何饮食选择
2. **科学严谨**：基于营养科学提供可靠建议
3. **个性化**：根据用户的具体情况提供定制化建议
4. **可持续**：推荐实际可行的健康方案，避免极端方法

对话风格：
- 温暖友好，如朋友般亲切
- 专业可信，但不临床化
- 积极鼓励，关注进步而非完美
- 简洁明了，避免信息过载

重要提醒：
- 永远不要提供极端的节食建议
- 强调平衡和适度的重要性
- 鼓励用户倾听自己身体的需求
- 在需要时建议咨询专业医生或营养师

请用中文回复，保持温暖专业的语调。`;
  }

  // 设置API配置
  setConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    // 清除缓存token
    this.jwtToken = null;
    this.tokenExpiry = null;
  }

  // 获取当前配置
  getConfig() {
    return { ...this.config };
  }

  // 清空对话历史
  clearHistory() {
    this.conversationHistory = [];
  }

  // 添加消息到历史记录
  addToHistory(role, content) {
    this.conversationHistory.push({
      role,
      content,
      timestamp: new Date().toISOString()
    });

    // 保持历史记录在合理范围内
    if (this.conversationHistory.length > 20) {
      this.conversationHistory = this.conversationHistory.slice(-20);
    }
  }

  // 构建API请求的messages数组
  buildMessages(userMessage) {
    const messages = [
      {
        role: 'system',
        content: this.systemPrompt
      }
    ];

    // 添加最近的对话历史
    const recentHistory = this.conversationHistory.slice(-6);
    messages.push(...recentHistory);

    // 添加当前用户消息
    messages.push({
      role: 'user',
      content: userMessage
    });

    return messages;
  }

  // 获取BigModel JWT token
  async getBigModelJWT() {
    // 检查缓存的token是否仍然有效
    if (this.jwtToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      console.log('使用缓存的JWT Token');
      return this.jwtToken;
    }

    try {
      console.log('正在获取BigModel JWT Token...');
      console.log('使用API密钥:', this.config.apiKey.substring(0, 10) + '...');

      // 智谱AI可能有多个Token端点，尝试不同的端点
      const endpoints = [
        'https://open.bigmodel.cn/api/paas/v4/token',
        'https://open.bigmodel.cn/api/paas/v4/authorization',
        'https://api.bigmodel.cn/api/paas/v4/token'
      ];

      let lastError = null;

      for (const endpoint of endpoints) {
        try {
          console.log(`尝试端点: ${endpoint}`);

          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              api_key: this.config.apiKey
            })
          });

          console.log(`端点 ${endpoint} 响应状态:`, response.status);
          console.log('响应头:', response.headers);

          const responseText = await response.text();
          console.log(`端点 ${endpoint} 响应内容:`, responseText);

          if (response.ok) {
            const data = JSON.parse(responseText);
            console.log('JWT Token响应:', data);

            if (data.token) {
              this.jwtToken = data.token;
              // 智谱AI的token通常有效期较长，设置为1小时减去1分钟缓冲
              const expiresIn = data.expires_in || 3600;
              this.tokenExpiry = Date.now() + (expiresIn - 60) * 1000;

              console.log('JWT Token获取成功，有效期:', expiresIn, '秒');
              return this.jwtToken;
            } else if (data.access_token) {
              // 某些API可能返回access_token
              this.jwtToken = data.access_token;
              const expiresIn = data.expires_in || 3600;
              this.tokenExpiry = Date.now() + (expiresIn - 60) * 1000;

              console.log('Access Token获取成功，有效期:', expiresIn, '秒');
              return this.jwtToken;
            } else {
              throw new Error(`响应中未找到token字段: ${JSON.stringify(data)}`);
            }
          } else {
            lastError = new Error(`端点 ${endpoint} 返回错误 ${response.status}: ${responseText}`);
            console.warn(`端点 ${endpoint} 失败，尝试下一个端点`);
          }
        } catch (error) {
          lastError = error;
          console.warn(`端点 ${endpoint} 异常:`, error.message);
        }
      }

      // 如果所有端点都失败了，抛出最后一个错误
      throw lastError || new Error('所有Token端点都无法访问');

    } catch (error) {
      console.error('获取JWT Token彻底失败:', error);

      // 尝试直接使用API密钥（某些情况下可能不需要JWT Token）
      console.log('尝试直接使用API密钥进行认证...');
      return this.config.apiKey;
    }
  }

  // BigModel (智谱AI) API调用
  async callBigModel(messages) {
    console.log('开始调用BigModel API...');

    try {
      // 获取认证Token
      let token;
      try {
        token = await this.getBigModelJWT();
        console.log('JWT Token获取成功，前缀:', token.substring(0, 20) + '...');
      } catch (jwtError) {
        console.warn('JWT Token获取失败，尝试直接使用API密钥:', jwtError.message);
        token = this.config.apiKey;
      }

      // 转换消息格式为BigModel格式
      const bigModelMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // 准备请求体
      const requestBody = {
        model: this.config.model || 'glm-4',
        messages: bigModelMessages,
        max_tokens: Math.min(this.config.maxTokens || 1000, 4000), // 限制最大token数
        temperature: this.config.temperature || 0.7,
        stream: false
      };

      console.log('BigModel请求体:', JSON.stringify(requestBody, null, 2));

      // 尝试多个API端点
      const chatEndpoints = [
        'https://open.bigmodel.cn/api/paas/v4/chat/completions',
        'https://api.bigmodel.cn/api/paas/v4/chat/completions'
      ];

      let lastError = null;
      let successfulResponse = null;

      for (const endpoint of chatEndpoints) {
        try {
          console.log(`尝试API端点: ${endpoint}`);

          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            },
            body: JSON.stringify(requestBody)
          });

          console.log(`端点 ${endpoint} 响应状态:`, response.status);

          if (response.ok) {
            successfulResponse = response;
            console.log(`端点 ${endpoint} 成功`);
            break;
          } else {
            const errorText = await response.text();
            console.warn(`端点 ${endpoint} 失败:`, errorText);
            lastError = new Error(`端点 ${endpoint} 返回 ${response.status}: ${errorText}`);
          }
        } catch (error) {
          console.warn(`端点 ${endpoint} 异常:`, error.message);
          lastError = error;
        }
      }

      if (!successfulResponse) {
        throw lastError || new Error('所有API端点都无法访问');
      }

      // 解析响应
      const responseText = await successfulResponse.text();
      console.log('BigModel原始响应:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(`JSON解析失败: ${parseError.message}\n原始响应: ${responseText}`);
      }

      console.log('BigModel解析后的响应:', data);

      // 检查响应格式
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const content = data.choices[0].message.content;
        if (typeof content === 'string' && content.trim()) {
          return content.trim();
        } else {
          throw new Error('响应内容格式异常或为空');
        }
      } else {
        throw new Error(`API响应格式异常，缺少choices字段\n完整响应: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error('BigModel API调用失败:', error);

      // 提供更详细的错误信息
      if (error.message.includes('JWT') || error.message.includes('token')) {
        throw new Error(`认证失败: ${error.message}。请检查API密钥是否正确。`);
      } else if (error.message.includes('401')) {
        throw new Error('认证失败，API密钥可能无效或已过期。');
      } else if (error.message.includes('403')) {
        throw new Error('访问被拒绝，可能没有API访问权限。');
      } else if (error.message.includes('429')) {
        throw new Error('API调用频率过高，请稍后再试。');
      } else if (error.message.includes('Network') || error.message.includes('fetch')) {
        throw new Error('网络连接失败，请检查网络连接或防火墙设置。');
      } else {
        throw new Error(`BigModel API调用失败: ${error.message}`);
      }
    }
  }

  // OpenAI API调用
  async callOpenAI(messages) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        model: this.config.model || 'gpt-3.5-turbo',
        messages,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API错误: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  // Claude API调用
  async callClaude(messages) {
    // 转换消息格式为Claude格式
    const claudeMessages = messages.map(msg => ({
      role: msg.role === 'system' ? 'user' : msg.role,
      content: msg.content
    }));

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: this.config.model || 'claude-3-sonnet-20240229',
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
        messages: claudeMessages
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API错误: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  // Gemini API调用
  async callGemini(messages) {
    // 转换为Gemini格式
    const contents = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.config.model || 'gemini-pro'}:generateContent?key=${this.config.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: this.config.temperature,
          maxOutputTokens: this.config.maxTokens
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API错误: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  // 本地AI服务（使用Ollama等）
  async callLocalAI(messages) {
    if (!this.config.baseURL) {
      throw new Error('本地AI服务需要配置baseURL');
    }

    const response = await fetch(`${this.config.baseURL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.config.model || 'llama2',
        messages,
        stream: false,
        options: {
          temperature: this.config.temperature,
          num_predict: this.config.maxTokens
        }
      })
    });

    if (!response.ok) {
      throw new Error(`本地AI服务错误: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.message.content;
  }

  // 统一的AI调用接口
  async generateResponse(userMessage) {
    try {
      // 检查API配置
      if (!this.config.apiKey && this.config.provider !== 'local') {
        throw new Error('未配置API密钥');
      }

      if (this.config.provider === 'local' && !this.config.baseURL) {
        throw new Error('本地AI服务需要配置baseURL');
      }

      // 构建消息
      const messages = this.buildMessages(userMessage);

      // 根据provider调用不同的API
      let response;
      switch (this.config.provider) {
        case 'openai':
          response = await this.callOpenAI(messages);
          break;
        case 'claude':
          response = await this.callClaude(messages);
          break;
        case 'gemini':
          response = await this.callGemini(messages);
          break;
        case 'bigmodel':
          response = await this.callBigModel(messages);
          break;
        case 'local':
          response = await this.callLocalAI(messages);
          break;
        default:
          throw new Error(`不支持的AI提供商: ${this.config.provider}`);
      }

      // 添加到历史记录
      this.addToHistory('user', userMessage);
      this.addToHistory('assistant', response);

      return response;

    } catch (error) {
      console.error('AI服务错误:', error);

      // 返回友好的错误消息
      if (error.message.includes('API密钥')) {
        return '抱歉，AI服务配置有误。请检查API密钥设置。您可以先使用预设的示例对话体验功能。';
      } else if (error.message.includes('网络')) {
        return '网络连接出现问题，请稍后再试。您可以尝试刷新页面重新连接。';
      } else if (error.message.includes('quota') || error.message.includes('额度')) {
        return 'API调用次数已达上限，请稍后再试或联系管理员。';
      } else {
        return '抱歉，AI服务暂时不可用。您可以尝试使用预设的示例对话，或稍后再试。错误详情：' + error.message;
      }
    }
  }

  // 流式响应（用于支持流式API）
  async *generateStreamingResponse(userMessage) {
    try {
      const messages = this.buildMessages(userMessage);

      if (this.config.provider === 'openai') {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiKey}`
          },
          body: JSON.stringify({
            model: this.config.model || 'gpt-3.5-turbo',
            messages,
            max_tokens: this.config.maxTokens,
            temperature: this.config.temperature,
            stream: true
          })
        });

        if (!response.ok) {
          throw new Error(`OpenAI API错误: ${response.status} ${response.statusText}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') return;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices[0]?.delta?.content;
                if (content) {
                  yield content;
                }
              } catch (e) {
                // 忽略解析错误
              }
            }
          }
        }
      } else {
        // 对于不支持流式的API，返回完整响应
        const response = await this.generateResponse(userMessage);
        yield response;
      }

    } catch (error) {
      console.error('流式AI服务错误:', error);
      yield '抱歉，AI服务出现错误，请稍后再试。';
    }
  }

  // 获取服务状态
  async checkServiceStatus() {
    try {
      if (!this.config.apiKey && this.config.provider !== 'local') {
        return { status: 'error', message: '未配置API密钥' };
      }

      // 发送简单的测试请求
      const testResponse = await this.generateResponse('你好');
      return { status: 'ok', message: '服务正常' };
    } catch (error) {
      return {
        status: 'error',
        message: error.message || '服务不可用'
      };
    }
  }
}

// 导出AI服务类
window.AIService = AIService;