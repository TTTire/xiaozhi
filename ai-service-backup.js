// ===== AI服务模块 =====
class AIService {
  constructor(config = {}) {
    this.config = {
      provider: config.provider || 'openai', // 'openai', 'claude', 'gemini', 'local'
      apiKey: config.apiKey || null,
      baseURL: config.baseURL || null,
      model: config.model || null,
      maxTokens: config.maxTokens || 1000,
      temperature: config.temperature || 0.7,
      ...config
    };

    this.conversationHistory = [];
    this.systemPrompt = this.getSystemPrompt();
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
  },

  // BigModel (智谱AI) API调用
  async callBigModel(messages) {
    // 转换消息格式为BigModel格式
    const bigModelMessages = messages.map(msg => ({
      role: msg.role === 'system' ? 'system' : msg.role,
      content: msg.content
    }));

    let token = this.config.apiKey;

    try {
      // 智谱AI可能需要JWT token，先尝试直接使用API密钥
      let response = await this.makeBigModelRequest(token, bigModelMessages);

      // 如果认证失败，尝试获取JWT token
      if (!response.ok && response.status === 401) {
        console.log('直接认证失败，尝试获取JWT token...');
        token = await this.getBigModelJWT();
        if (token) {
          response = await this.makeBigModelRequest(token, bigModelMessages);
        }
      }

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `BigModel API错误: ${response.status} ${response.statusText}`;

        try {
          const errorData = JSON.parse(errorText);
          if (errorData.error && errorData.error.message) {
            errorMessage += ` - ${errorData.error.message}`;
          }
        } catch (e) {
          errorMessage += ` - ${errorText}`;
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (data.choices && data.choices[0] && data.choices[0].message) {
        return data.choices[0].message.content;
      } else {
        throw new Error('BigModel API返回格式异常');
      }
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('网络连接失败，请检查网络或API地址');
      }
      throw error;
    }
  },

  // 发起BigModel请求
  async makeBigModelRequest(token, messages) {
    // 智谱AI需要使用JWT token
    const jwtToken = await this.getBigModelJWT();
    if (!jwtToken) {
      throw new Error('无法获取JWT Token');
    }

    return await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      },
      body: JSON.stringify({
        model: this.config.model || 'glm-4',
        messages: messages,
        max_tokens: this.config.maxTokens || 1000,
        temperature: this.config.temperature || 0.7,
        stream: false
      })
    });
  },

  // 获取BigModel JWT token
  async getBigModelJWT() {
    try {
      const response = await fetch('https://open.bigmodel.cn/api/paas/v4/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          api_key: this.config.apiKey
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          return data.token;
        }
      }
    } catch (error) {
      console.error('获取JWT token失败:', error);
    }
    return null;
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
        return '抱歉，AI服务暂时不可用。您可以尝试使用预设的示例对话，或稍后再试。';
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