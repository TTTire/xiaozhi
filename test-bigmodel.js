/**
 * BigModel API测试脚本
 * 在浏览器控制台中运行此脚本来测试API密钥
 */

// 测试BigModel API连接
async function testBigModelAPI(apiKey) {
  console.log('🚀 开始测试BigModel API...');

  try {
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'glm-4.6',
        messages: [
          {
            role: 'system',
            content: '你是一位专业的营养教练，请简洁地回答问题。'
          },
          {
            role: 'user',
            content: '你好，请简单介绍一下你自己。'
          }
        ],
        max_tokens: 100,
        temperature: 0.7,
        stream: false
      })
    });

    console.log('📡 响应状态:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API错误详情:', errorText);

      try {
        const errorData = JSON.parse(errorText);
        console.error('❌ 错误结构:', errorData);
      } catch (e) {
        console.error('❌ 无法解析错误响应');
      }

      return false;
    }

    const data = await response.json();
    console.log('✅ API响应成功:', data);

    if (data.choices && data.choices[0] && data.choices[0].message) {
      console.log('💬 AI回复:', data.choices[0].message.content);
      return true;
    } else {
      console.error('❌ 响应格式异常:', data);
      return false;
    }
  } catch (error) {
    console.error('❌ 网络错误:', error);
    return false;
  }
}

// 使用示例：
// 1. 在浏览器中打开智养AI网站
// 2. 打开开发者工具控制台
// 3. 复制粘贴下面的代码并替换API密钥
// 4. 运行测试

/*
// 替换 'your-api-key-here' 为您的实际API密钥
const yourApiKey = 'your-api-key-here';

// 运行测试
testBigModelAPI(yourApiKey).then(success => {
  if (success) {
    console.log('🎉 API密钥测试成功！可以使用BigModel功能。');

    // 自动设置配置
    if (typeof app !== 'undefined') {
      app.setAIConfig({
        provider: 'bigmodel',
        apiKey: yourApiKey,
        model: 'glm-4.6'
      });
      console.log('✅ 已自动配置BigModel到智养AI应用');
    }
  } else {
    console.log('💔 API密钥测试失败，请检查密钥是否正确。');
  }
});
*/

// 导出测试函数
window.testBigModelAPI = testBigModelAPI;