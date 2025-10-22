// ===== 全局状态管理 =====
const app = {
  state: {
    isMenuOpen: false,
    currentTestimonial: 0,
    isChatTyping: false,
    scrollY: 0,
    observerElements: [],
    chatHistory: [],
    aiService: null,
    useRealAI: false
  },

  // 初始化应用
  init() {
    this.initAIService();
    this.initNavigation();
    this.initScrollEffects();
    this.initTestimonialSlider();
    this.initChatDemo();
    this.initFormInteractions();
    this.initAnimations();
    this.initPerformanceOptimizations();

    console.log('智养AI应用已初始化');
  },

  // ===== AI服务初始化 =====
  initAIService() {
    // 检查是否配置了AI服务
    const aiConfig = this.getAIConfig();

    if (aiConfig && aiConfig.apiKey) {
      try {
        console.log('正在初始化AI服务...');
        console.log('AI配置:', { ...aiConfig, apiKey: aiConfig.apiKey.substring(0, 10) + '...' });

        this.state.aiService = new AIService(aiConfig);
        this.state.useRealAI = true;

        // 测试AI服务连接
        this.testAIConnection().then(isConnected => {
          if (isConnected) {
            console.log('✅ AI服务连接测试成功');
            this.updateAIModeIndicator();
            this.showNotification('AI服务已连接，可以使用真实AI对话', 'success');
          } else {
            console.log('❌ AI服务连接测试失败');
            this.state.useRealAI = false;
            this.showNotification('AI服务连接失败，使用演示模式', 'warning');
          }
        });

        console.log('AI服务已初始化，提供商:', aiConfig.provider);
      } catch (error) {
        console.error('AI服务初始化失败:', error);
        this.state.useRealAI = false;
        this.showNotification('AI服务初始化失败：' + error.message, 'error');
      }
    } else {
      console.log('未检测到AI服务配置，使用预设回复模式');
      this.state.useRealAI = false;
    }
  },

  // 测试AI连接
  async testAIConnection() {
    if (!this.state.aiService) {
      return false;
    }

    try {
      console.log('测试AI服务连接...');
      const status = await this.state.aiService.checkServiceStatus();
      console.log('AI服务连接状态:', status);
      return status.status === 'ok';
    } catch (error) {
      console.error('AI服务连接测试失败:', error);
      return false;
    }
  },

  // 获取AI配置
  getAIConfig() {
    // 优先从环境变量或配置文件读取
    if (window.AI_CONFIG) {
      return window.AI_CONFIG;
    }

    // 从localStorage读取用户配置
    const storedConfig = localStorage.getItem('zhiyang-ai-config');
    if (storedConfig) {
      try {
        return JSON.parse(storedConfig);
      } catch (error) {
        console.error('读取AI配置失败:', error);
      }
    }

    // 默认配置（需要用户设置API密钥）
    return null;
  },

  // 设置AI配置
  setAIConfig(config) {
    try {
      localStorage.setItem('zhiyang-ai-config', JSON.stringify(config));

      if (this.state.aiService) {
        this.state.aiService.setConfig(config);
      } else {
        this.state.aiService = new AIService(config);
      }

      this.state.useRealAI = true;
      console.log('AI配置已更新');
      return true;
    } catch (error) {
      console.error('设置AI配置失败:', error);
      return false;
    }
  },

  // 切换AI模式
  toggleAIMode() {
    this.state.useRealAI = !this.state.useRealAI;

    const chatMessages = document.querySelector('.chat-messages');
    if (chatMessages) {
      const statusMessage = this.state.useRealAI ?
        '已切换到真实AI模式 🤖' :
        '已切换到演示模式 🎭';

      this.addSystemMessage(statusMessage);
    }

    return this.state.useRealAI;
  },

  // ===== AI配置界面 =====
  showAIConfig() {
    const modal = document.getElementById('ai-config-modal');
    if (modal) {
      modal.style.display = 'flex';
      this.initConfigModal();
      document.body.style.overflow = 'hidden';
    }
  },

  hideAIConfig() {
    const modal = document.getElementById('ai-config-modal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  },

  initConfigModal() {
    // 初始化标签页
    this.initConfigTabs();

    // 初始化提供商选择
    this.initProviderSelection();

    // 初始化表单
    this.initConfigForm();

    // 加载现有配置
    this.loadCurrentConfig();
  },

  initConfigTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetTab = button.dataset.tab;

        // 移除所有活动状态
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // 添加活动状态
        button.classList.add('active');
        document.getElementById(`${targetTab}-tab`).classList.add('active');
      });
    });
  },

  initProviderSelection() {
    const providerCards = document.querySelectorAll('.provider-card');
    const apiProviderSelect = document.getElementById('api-provider');
    const baseUrlGroup = document.getElementById('base-url-group');

    providerCards.forEach(card => {
      card.addEventListener('click', () => {
        const provider = card.dataset.provider;

        // 更新选中状态
        providerCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');

        // 更新下拉菜单
        if (apiProviderSelect) {
          apiProviderSelect.value = provider;
        }

        // 显示/隐藏本地服务URL输入
        if (baseUrlGroup) {
          baseUrlGroup.style.display = provider === 'local' ? 'block' : 'none';
        }

        // 更新模型选项
        this.updateModelOptions(provider);
      });
    });

    // 监听下拉菜单变化
    if (apiProviderSelect) {
      apiProviderSelect.addEventListener('change', () => {
        const provider = apiProviderSelect.value;

        // 更新卡片选中状态
        providerCards.forEach(card => {
          card.classList.toggle('selected', card.dataset.provider === provider);
        });

        // 显示/隐藏本地服务URL输入
        if (baseUrlGroup) {
          baseUrlGroup.style.display = provider === 'local' ? 'block' : 'none';
        }

        // 更新模型选项
        this.updateModelOptions(provider);
      });
    }

    // 温度滑块实时更新
    const temperatureSlider = document.getElementById('temperature');
    const temperatureValue = document.querySelector('.range-value');

    if (temperatureSlider && temperatureValue) {
      temperatureSlider.addEventListener('input', () => {
        temperatureValue.textContent = temperatureSlider.value;
      });
    }
  },

  initConfigForm() {
    // 表单验证
    const apiKeyInput = document.getElementById('api-key');
    if (apiKeyInput) {
      apiKeyInput.addEventListener('input', () => {
        const saveBtn = document.querySelector('.modal-footer .btn-primary');
        if (saveBtn) {
          saveBtn.disabled = !apiKeyInput.value.trim();
        }
      });
    }
  },

  updateModelOptions(provider) {
    const modelSelect = document.getElementById('model');
    if (!modelSelect) return;

    const models = {
      openai: [
        { value: 'gpt-3.5-turbo', text: 'GPT-3.5 Turbo' },
        { value: 'gpt-4', text: 'GPT-4' },
        { value: 'gpt-4-turbo', text: 'GPT-4 Turbo' }
      ],
      claude: [
        { value: 'claude-3-sonnet-20240229', text: 'Claude-3 Sonnet' },
        { value: 'claude-3-opus-20240229', text: 'Claude-3 Opus' },
        { value: 'claude-3-haiku-20240307', text: 'Claude-3 Haiku' }
      ],
      gemini: [
        { value: 'gemini-pro', text: 'Gemini Pro' },
        { value: 'gemini-pro-vision', text: 'Gemini Pro Vision' }
      ],
      bigmodel: [
        { value: 'glm-4.6', text: 'GLM-4.6' },
        { value: 'glm-4', text: 'GLM-4' },
        { value: 'glm-4-plus', text: 'GLM-4 Plus' }
      ],
      local: [
        { value: 'llama2', text: 'Llama 2' },
        { value: 'codellama', text: 'Code Llama' },
        { value: 'mistral', text: 'Mistral' }
      ]
    };

    // 清空现有选项
    modelSelect.innerHTML = '<option value="">默认模型</option>';

    // 添加新选项
    const providerModels = models[provider] || [];
    providerModels.forEach(model => {
      const option = document.createElement('option');
      option.value = model.value;
      option.textContent = model.text;
      modelSelect.appendChild(option);
    });
  },

  loadCurrentConfig() {
    const config = this.getAIConfig();
    if (!config) return;

    // 设置提供商
    const apiProviderSelect = document.getElementById('api-provider');
    if (apiProviderSelect && config.provider) {
      apiProviderSelect.value = config.provider;
      this.updateModelOptions(config.provider);

      // 更新卡片选中状态
      const providerCards = document.querySelectorAll('.provider-card');
      providerCards.forEach(card => {
        card.classList.toggle('selected', card.dataset.provider === config.provider);
      });
    }

    // 设置API密钥
    const apiKeyInput = document.getElementById('api-key');
    if (apiKeyInput && config.apiKey) {
      apiKeyInput.value = config.apiKey;
    }

    // 设置基础URL（本地服务）
    const baseUrlInput = document.getElementById('base-url');
    if (baseUrlInput && config.baseURL) {
      baseUrlInput.value = config.baseURL;
      document.getElementById('base-url-group').style.display = 'block';
    }

    // 设置模型
    const modelSelect = document.getElementById('model');
    if (modelSelect && config.model) {
      modelSelect.value = config.model;
    }

    // 设置温度
    const temperatureSlider = document.getElementById('temperature');
    const temperatureValue = document.querySelector('.range-value');
    if (temperatureSlider && config.temperature !== undefined) {
      temperatureSlider.value = config.temperature;
      if (temperatureValue) {
        temperatureValue.textContent = config.temperature;
      }
    }

    // 设置最大tokens
    const maxTokensInput = document.getElementById('max-tokens');
    if (maxTokensInput && config.maxTokens) {
      maxTokensInput.value = config.maxTokens;
    }
  },

  async testAIConnection() {
    const config = this.gatherFormConfig();
    if (!config.apiKey && config.provider !== 'local') {
      this.showNotification('请先输入API密钥', 'error');
      return;
    }

    // 显示测试中状态
    const testBtn = document.querySelector('.modal-footer .btn-secondary');
    const originalText = testBtn.textContent;
    testBtn.textContent = '测试中...';
    testBtn.disabled = true;

    console.log('开始测试AI连接...');
    console.log('配置:', { ...config, apiKey: config.apiKey ? config.apiKey.substring(0, 10) + '...' : 'none' });

    try {
      // 创建临时AI服务实例
      const tempAIService = new AIService(config);

      // 分步骤测试
      console.log('步骤1: 测试基本连接...');

      // 先测试简单的对话
      const testResponse = await tempAIService.generateResponse('你好，这是一个连接测试');

      if (testResponse && testResponse.trim()) {
        console.log('✅ 连接测试成功');
        this.showNotification('连接成功！AI服务正常工作', 'success');

        // 更新当前配置（如果测试成功）
        this.setAIConfig(config);
        this.updateAIModeIndicator();
      } else {
        console.log('❌ 连接测试失败: 空响应');
        this.showNotification('连接失败: API返回空响应', 'error');
      }

    } catch (error) {
      console.error('测试连接失败:', error);

      // 提供更详细的错误信息
      let errorMessage = `连接测试失败: ${error.message}`;

      if (error.message.includes('JWT') || error.message.includes('token')) {
        errorMessage += '\n建议：检查API密钥格式是否正确';
      } else if (error.message.includes('401')) {
        errorMessage += '\n建议：API密钥可能无效或已过期';
      } else if (error.message.includes('403')) {
        errorMessage += '\n建议：检查账户权限和余额';
      } else if (error.message.includes('429')) {
        errorMessage += '\n建议：API调用频率过高，请稍后再试';
      } else if (error.message.includes('Network') || error.message.includes('fetch')) {
        errorMessage += '\n建议：检查网络连接或防火墙设置';
      }

      this.showNotification(errorMessage, 'error');
    } finally {
      // 恢复按钮状态
      testBtn.textContent = originalText;
      testBtn.disabled = false;
    }
  },

  saveAIConfig() {
    const config = this.gatherFormConfig();

    if (!config.apiKey && config.provider !== 'local') {
      this.showNotification('请输入API密钥', 'error');
      return;
    }

    // 保存配置
    const success = this.setAIConfig(config);

    if (success) {
      this.showNotification('配置已保存！', 'success');
      this.hideAIConfig();

      // 更新AI模式指示器
      this.updateAIModeIndicator();
    } else {
      this.showNotification('保存配置失败', 'error');
    }
  },

  gatherFormConfig() {
    const apiProviderSelect = document.getElementById('api-provider');
    const apiKeyInput = document.getElementById('api-key');
    const baseUrlInput = document.getElementById('base-url');
    const modelSelect = document.getElementById('model');
    const temperatureSlider = document.getElementById('temperature');
    const maxTokensInput = document.getElementById('max-tokens');

    return {
      provider: apiProviderSelect?.value || 'bigmodel',
      apiKey: apiKeyInput?.value?.trim() || '',
      baseURL: baseUrlInput?.value?.trim() || '',
      model: modelSelect?.value || 'glm-4.6',
      temperature: parseFloat(temperatureSlider?.value) || 0.7,
      maxTokens: parseInt(maxTokensInput?.value) || 1000
    };
  },

  updateAIModeIndicator() {
    const modeToggle = document.getElementById('ai-mode-toggle');
    if (modeToggle) {
      if (this.state.useRealAI) {
        modeToggle.textContent = '🤖 真实AI';
        modeToggle.classList.add('real-ai');
      } else {
        modeToggle.textContent = '🎭 演示模式';
        modeToggle.classList.remove('real-ai');
      }
    }
  },

  showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // 添加样式
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 20px',
      borderRadius: '8px',
      fontWeight: '500',
      zIndex: '10000',
      maxWidth: '300px',
      wordWrap: 'break-word',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease'
    });

    // 设置颜色
    const colors = {
      success: { bg: '#10B981', text: '#FFFFFF' },
      error: { bg: '#EF4444', text: '#FFFFFF' },
      info: { bg: '#3B82F6', text: '#FFFFFF' },
      warning: { bg: '#F59E0B', text: '#FFFFFF' }
    };

    const color = colors[type] || colors.info;
    notification.style.backgroundColor = color.bg;
    notification.style.color = color.text;

    // 添加到页面
    document.body.appendChild(notification);

    // 显示动画
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    // 自动移除
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  },

  // ===== 导航功能 =====
  initNavigation() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // 移动端菜单切换
    if (mobileToggle) {
      mobileToggle.addEventListener('click', () => {
        this.toggleMobileMenu();
      });
    }

    // 导航链接点击处理
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
          e.preventDefault();
          this.smoothScrollTo(href);
          this.closeMobileMenu();
        }
      });
    });

    // 滚动时导航栏样式变化
    this.initHeaderScroll();
  },

  toggleMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    this.state.isMenuOpen = !this.state.isMenuOpen;

    if (this.state.isMenuOpen) {
      navMenu.style.display = 'flex';
      mobileToggle.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      navMenu.style.display = 'none';
      mobileToggle.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  closeMobileMenu() {
    if (this.state.isMenuOpen) {
      this.toggleMobileMenu();
    }
  },

  initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(22, 19, 19, 0.1)';
      } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
      }

      // 隐藏/显示导航栏
      if (currentScrollY > lastScrollY && currentScrollY > 300) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }

      lastScrollY = currentScrollY;
    });
  },

  // ===== 滚动效果和动画 =====
  initScrollEffects() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');

          // 触发特定元素的额外动画
          if (entry.target.classList.contains('hero-title')) {
            this.animateHeroElements();
          }
        }
      });
    }, observerOptions);

    // 观察需要动画的元素
    document.querySelectorAll('.fade-in-up, .section-header, .feature-card, .pain-point, .step').forEach(el => {
      observer.observe(el);
      this.state.observerElements.push(el);
    });

    // 视差滚动效果
    this.initParallaxEffects();
  },

  initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.floating-cards, .ai-avatar, .pulse-circle');

    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;

      parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    });
  },

  animateHeroElements() {
    // Hero 卡片动画
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.style.animation = `float 6s ease-in-out infinite`;
        card.style.animationDelay = `${index * 1.5}s`;
      }, index * 100);
    });
  },

  // ===== 用户故事轮播 =====
  initTestimonialSlider() {
    const dots = document.querySelectorAll('.dot');
    const testimonials = document.querySelectorAll('.testimonial');

    if (dots.length === 0) return;

    // 自动轮播
    setInterval(() => {
      this.nextTestimonial();
    }, 8000);

    // 点击切换
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const index = parseInt(dot.dataset.testimonial);
        this.showTestimonial(index);
      });
    });
  },

  nextTestimonial() {
    const totalTestimonials = document.querySelectorAll('.testimonial').length;
    this.state.currentTestimonial = (this.state.currentTestimonial + 1) % totalTestimonials;
    this.showTestimonial(this.state.currentTestimonial);
  },

  showTestimonial(index) {
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');

    testimonials.forEach((testimonial, i) => {
      testimonial.classList.toggle('active', i === index);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    this.state.currentTestimonial = index;
  },

  // ===== AI聊天演示 =====
  initChatDemo() {
    const exampleMessages = document.querySelectorAll('.example-message');
    const chatMessages = document.querySelector('.chat-messages');
    const chatInput = document.querySelector('.chat-input');
    const sendBtn = document.querySelector('.chat-send-btn');

    if (exampleMessages.length === 0) return;

    // 点击示例消息
    exampleMessages.forEach(message => {
      message.addEventListener('click', () => {
        const messageType = message.dataset.message;
        this.showTypingIndicator();

        setTimeout(() => {
          this.displayChatMessage(messageType);
        }, 2000);
      });
    });

    // 发送消息
    const sendMessage = () => {
      const message = chatInput.value.trim();
      if (message) {
        this.addUserMessage(message);
        chatInput.value = '';

        // 模拟AI回复
        this.showTypingIndicator();
        setTimeout(() => {
          this.generateAIResponse(message);
        }, 1500);
      }
    };

    if (sendBtn) {
      sendBtn.addEventListener('click', sendMessage);
    }

    if (chatInput) {
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          sendMessage();
        }
      });
    }

    // 初始欢迎消息
    setTimeout(() => {
      this.displayChatMessage('welcome');
    }, 1000);
  },

  showTypingIndicator() {
    const chatMessages = document.querySelector('.chat-messages');
    const typingHTML = `
      <div class="message ai-message typing-indicator">
        <div class="message-avatar">
          <div class="avatar-circle-small"></div>
        </div>
        <div class="message-content">
          <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    `;

    chatMessages.insertAdjacentHTML('beforeend', typingHTML);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    this.state.isChatTyping = true;
  },

  hideTypingIndicator() {
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
    this.state.isChatTyping = false;
  },

  displayChatMessage(type) {
    this.hideTypingIndicator();

    const messages = {
      welcome: "欢迎！很高兴能与您一起开启这段健康旅程。在开始之前，让我们聊一聊吧。您的目标、您的挑战，以及您与食物的故事——我都想了解。这里没有对错，只有属于您的独特路径。",
      'non-judgmental': "感谢记录。我看到您享用了一份美味的汉堡和薯条。重要的是，您在倾听自己身体的需求。让我们看看这顿饭如何融入您今天的能量版图，并一起规划接下来的平衡。",
      proactive: "我注意到，在您进行高强度锻炼后的第二天，您的睡眠质量似乎有所下降。这可能是身体恢复需要更多支持的信号。今晚尝试增加一些富含镁的食物，比如菠菜或杏仁，可能会有帮助。需要为您推荐一些相关的食谱吗？"
    };

    const message = messages[type] || "感谢您的消息！我很乐意帮助您在健康之旅中找到平衡。请告诉我更多关于您的目标和挑战。";

    this.addAIMessage(message);
  },

  addAIMessage(message) {
    const chatMessages = document.querySelector('.chat-messages');
    const messageHTML = `
      <div class="message ai-message">
        <div class="message-avatar">
          <div class="avatar-circle-small"></div>
        </div>
        <div class="message-content">
          ${message}
        </div>
      </div>
    `;

    chatMessages.insertAdjacentHTML('beforeend', messageHTML);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // 添加到历史记录
    this.state.chatHistory.push({ type: 'ai', message, timestamp: Date.now() });
  },

  addUserMessage(message) {
    const chatMessages = document.querySelector('.chat-messages');
    const messageHTML = `
      <div class="message user-message">
        <div class="message-avatar">
          <div style="width: 32px; height: 32px; background: var(--gradient-warm); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;">您</div>
        </div>
        <div class="message-content" style="background: var(--gradient-warm); color: white;">
          ${message}
        </div>
      </div>
    `;

    chatMessages.insertAdjacentHTML('beforeend', messageHTML);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // 添加到历史记录
    this.state.chatHistory.push({ type: 'user', message, timestamp: Date.now() });
  },

  async generateAIResponse(userMessage) {
    this.hideTypingIndicator();

    try {
      let response;

      if (this.state.useRealAI && this.state.aiService) {
        // 使用真实AI服务
        this.showTypingIndicator();
        response = await this.state.aiService.generateResponse(userMessage);
        this.hideTypingIndicator();
      } else {
        // 使用预设回复模式
        response = this.getPresetResponse(userMessage);
      }

      this.addAIMessage(response);
    } catch (error) {
      console.error('生成AI回复失败:', error);
      this.hideTypingIndicator();

      // 错误处理
      const errorMessage = this.getErrorMessage(error);
      this.addAIMessage(errorMessage);
    }
  },

  // 获取预设回复（演示模式）
  getPresetResponse(userMessage) {
    const responses = {
     减肥: "我理解您想要健康减重的愿望。与其采用极端的节食方法，不如让我们一起找到一个可持续的方式。首先，我想了解一下您的日常饮食习惯和运动情况。您能告诉我典型的一天都吃些什么吗？",
     瘦身: "我理解您想要健康减重的愿望。与其采用极端的节食方法，不如让我们一起找到一个可持续的方式。首先，我想了解一下您的日常饮食习惯和运动情况。您能告诉我典型的一天都吃些什么吗？",
     食谱: "很好的问题！基于您的目标，我可以为您推荐一些既美味又营养的食谱。考虑到您喜欢简单易做的食物，我建议从彩虹沙拉开始：富含维生素的蔬菜搭配优质蛋白质。需要具体的制作步骤吗？",
     吃什么: "很好的问题！基于您的目标，我可以为您推荐一些既美味又营养的食谱。考虑到您喜欢简单易做的食物，我建议从彩虹沙拉开始：富含维生素的蔬菜搭配优质蛋白质。需要具体的制作步骤吗？",
     运动: "运动是健康生活的重要组成部分！我注意到您最近增加了运动量，这很棒。记得运动后的营养补充同样重要。您目前主要进行什么类型的运动呢？这样我可以给您更精准的建议。",
     锻炼: "运动是健康生活的重要组成部分！我注意到您最近增加了运动量，这很棒。记得运动后的营养补充同样重要。您目前主要进行什么类型的运动呢？这样我可以给您更精准的建议。",
     睡眠: "睡眠质量对整体健康影响很大。让我看看您的数据...我发现您最近几天的睡眠时间不太规律。这与晚餐时间和咖啡因摄入可能有关。您通常几点吃晚餐呢？",
     失眠: "睡眠质量对整体健康影响很大。让我看看您的数据...我发现您最近几天的睡眠时间不太规律。这与晚餐时间和咖啡因摄入可能有关。您通常几点吃晚餐呢？",
     配置: "要启用真实AI功能，您需要配置API密钥。请点击右上角的设置按钮，选择您的AI服务提供商并输入相应的API密钥。目前支持OpenAI、Claude、Gemini等。",
     设置: "要启用真实AI功能，您需要配置API密钥。请点击右上角的设置按钮，选择您的AI服务提供商并输入相应的API密钥。目前支持OpenAI、Claude、Gemini等。",
     api: "要配置API，请在浏览器控制台中运行：\n```javascript\napp.setAIConfig({\n  provider: 'openai', // 或 'claude', 'gemini'\n  apiKey: 'your-api-key-here',\n  model: 'gpt-3.5-turbo' // 可选\n});\n```"
    };

    // 查找匹配的关键词
    for (const [keyword, response] of Object.entries(responses)) {
      if (userMessage.includes(keyword)) {
        return response;
      }
    }

    // 默认回复
    return "感谢您与我分享。每个人的健康旅程都是独特的，我很高兴能陪伴您一起走这条路。基于您刚才提到的，我想深入了解一些具体情况，这样我能给出更贴合您需求的建议。\n\n💡 **提示**：想要体验更智能的对话，请配置您的AI API密钥。输入「配置」查看详细说明。";
  },

  // 获取错误消息
  getErrorMessage(error) {
    const errorMessages = {
      'API密钥': '抱歉，AI服务配置有误。请检查API密钥设置。您可以在控制台输入「配置」查看设置方法。',
      '网络': '网络连接出现问题，请稍后再试。您可以尝试刷新页面重新连接。',
      '额度': 'API调用次数已达上限，请稍后再试或检查您的账户余额。',
      '超时': '请求超时，请稍后再试。可能是网络较慢或服务器繁忙。'
    };

    for (const [keyword, message] of Object.entries(errorMessages)) {
      if (error.message.includes(keyword)) {
        return message;
      }
    }

    return '抱歉，AI服务暂时不可用。您可以尝试使用预设的示例对话，或稍后再试。如需配置真实AI，请输入「配置」查看说明。';
  },

  // 添加系统消息
  addSystemMessage(message) {
    const chatMessages = document.querySelector('.chat-messages');
    if (!chatMessages) return;

    const messageHTML = `
      <div class="message system-message">
        <div class="message-content" style="background: var(--color-light-sage); color: var(--color-text-secondary); font-style: italic; text-align: center;">
          ${message}
        </div>
      </div>
    `;

    chatMessages.insertAdjacentHTML('beforeend', messageHTML);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  },

  // ===== 表单交互 =====
  initFormInteractions() {
    // CTA按钮点击效果
    const ctaButtons = document.querySelectorAll('.btn-primary');
    ctaButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (btn.textContent.includes('开始') || btn.textContent.includes('体验')) {
          e.preventDefault();
          this.scrollToChatDemo();
        }
      });
    });

    // 价格卡片悬停效果
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        if (!card.classList.contains('featured')) {
          card.style.transform = 'translateY(-12px) scale(1.02)';
        }
      });

      card.addEventListener('mouseleave', () => {
        if (!card.classList.contains('featured')) {
          card.style.transform = '';
        }
      });
    });
  },

  scrollToChatDemo() {
    const chatDemo = document.querySelector('#ai-chat');
    if (chatDemo) {
      this.smoothScrollTo('#ai-chat');

      // 聚焦到聊天输入框
      setTimeout(() => {
        const chatInput = document.querySelector('.chat-input');
        if (chatInput) {
          chatInput.focus();
          chatInput.placeholder = '开始和您的AI教练对话...';
        }
      }, 800);
    }
  },

  // ===== 动画效果 =====
  initAnimations() {
    // 数字动画
    this.animateNumbers();

    // 浮动元素动画
    this.initFloatingAnimations();

    // 页面加载动画
    this.initPageLoadAnimations();
  },

  animateNumbers() {
    const animateValue = (element, start, end, duration) => {
      const startTimestamp = Date.now();
      const step = () => {
        const timestamp = Date.now();
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value;
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    };

    // 当价格区域可见时动画化数字
    const priceElements = document.querySelectorAll('.amount');
    const priceObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.animated) {
          const text = entry.target.textContent;
          const number = parseInt(text);
          if (!isNaN(number)) {
            animateValue(entry.target, 0, number, 1500);
            entry.target.animated = true;
          }
        }
      });
    });

    priceElements.forEach(el => priceObserver.observe(el));
  },

  initFloatingAnimations() {
    // 为各种卡片添加随机浮动动画
    const floatingElements = document.querySelectorAll('.card, .element, .feature-card');

    floatingElements.forEach((element, index) => {
      const delay = Math.random() * 2;
      const duration = 4 + Math.random() * 4;

      element.style.animation = `float ${duration}s ease-in-out infinite`;
      element.style.animationDelay = `${delay}s`;
    });
  },

  initPageLoadAnimations() {
    // 页面加载时的序列动画
    window.addEventListener('load', () => {
      document.body.classList.add('loaded');

      // 序列显示导航元素
      const navElements = document.querySelectorAll('.nav-brand, .nav-menu li');
      navElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(-20px)';
        setTimeout(() => {
          el.style.transition = 'all 0.5s ease';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, index * 100);
      });
    });
  },

  // ===== 性能优化 =====
  initPerformanceOptimizations() {
    // 防抖滚动事件
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
      }
      scrollTimeout = window.requestAnimationFrame(() => {
        this.handleScroll();
      });
    });

    // 懒加载图片
    this.initLazyLoading();

    // 预加载关键资源
    this.preloadCriticalResources();
  },

  handleScroll() {
    this.state.scrollY = window.scrollY;

    // 更新活跃的导航链接
    this.updateActiveNavLink();

    // 视差效果的节流处理
    this.updateParallax();
  },

  updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    let currentSection = '';
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 100 && rect.bottom >= 100) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  },

  updateParallax() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-cards, .ai-avatar');

    // 使用 requestAnimationFrame 优化性能
    if (this.parallaxFrame) {
      window.cancelAnimationFrame(this.parallaxFrame);
    }

    this.parallaxFrame = window.requestAnimationFrame(() => {
      parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    });
  },

  initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  },

  preloadCriticalResources() {
    // 预加载字体
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap';
    fontLink.as = 'style';
    document.head.appendChild(fontLink);

    // 预加载关键图片
    const criticalImages = ['logo-icon', 'hero-background'];
    criticalImages.forEach(imgName => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = `/images/${imgName}.webp`;
      document.head.appendChild(link);
    });
  },

  // ===== 工具函数 =====
  smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  },

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};

// ===== 应用启动 =====
document.addEventListener('DOMContentLoaded', () => {
  app.init();

  // 添加全局错误处理
  window.addEventListener('error', (e) => {
    console.error('应用错误:', e.error);
  });

  // 添加性能监控
  if (window.performance) {
    window.addEventListener('load', () => {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      console.log(`页面加载时间: ${pageLoadTime}ms`);
    });
  }
});

// 导出应用对象供调试使用
window.ZhiYangApp = app;