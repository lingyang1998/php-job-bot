const express = require('express');
const axios = require('axios');
const fs = require('fs');

const app = express();
app.use(express.json());

// 多 Bot 配置
const bots = {
  '7171854531:AAFag6hlDGL7B7K46WPE49GvhJy_b1XNkt4': {
    reply: `🎯 欢迎关注【运营岗位】\n👉 @yunying_job_group`
  },
  '7918845251:AAHLjezgYuibDJ0BS9uO2kY5Ygzpkdb52vg': {
    reply: `💼 欢迎关注【Java 工作机会】\n👉 @java_jobs_bot`
  },
  '7835528371:AAG2IBpE9ljuj0pW6Ak_TZOvUaUzrYa-SHw': {
    reply: `📊 欢迎查看【运营岗位】\n👉 @OpsHub_CN_bot`
  },
  '7872308369:AAFLzE26sGBLvI7RSRpe1y480zxxGVbPGI0': {
    reply: `🧱 欢迎关注高级 Web 工作机会\n👉 @AdvancedWebJobs`
  },  // Added missing comma and closing brace here
  '7931339905:AAFMGS76pZMaJsoT2fUCXZbAo7YVUHYbTXU': {
    reply: `🔍 欢迎查看【SEO 岗位】\n👉 @SEO_job_group`
  },
  '7610127686:AAGD3RatvfYTOr2sD5_s_kq1b0JXl-5xaNc': {
    reply: `🔍 欢迎查看【PHP 岗位】\n👉 @PHP_job_group`
  },
  '7974931780:AAELrytLHKsC4XAZktMDUfPteBCo2crsPKA': {
    reply: `🎯 欢迎关注招聘岗位\n👉 @HR_foya_job`
  },
  '8090677272:AAGWCQHgENvSXA8e-Wl7nWsBSQ-rt7KCBOA': {
    reply: `🎯 欢迎关注招聘岗位\n👉 @HR_foya_job`
  },
  '7629133624:AAF4Is5JdT2iZPzRhXzDK8ZwwyPvcv8aJD4': {
    reply: `🎯 欢迎关注招聘岗位\n👉 @HR_foya_job`
  },
  '7952117177:AAHI5cHs3sbD54sxFR0WpQcmZZ1QUe4DMWA': {
    reply: `🧱 欢迎关注 Web 前端岗位\n👉 @web_job2`
  },
  '7422937810:AAFQxO9rJWZDG03-O_Of9FO-3gPaRIWFayQ': {
    reply: `🎉 欢迎加入 FOYA 科技官方直招渠道！\n👉 @foya02`
  },
  '8096260794:AAEDo8QrRr3_rZusiqsoCS49l3qeIiVZZU8': {
    reply: `🎉 欢迎加入 FOYA 科技官方直招渠道！\n👉 @foya02`
  },
  '7116469550:AAEAz3IZwMhxrayYJyHE6rf6yyMeyasn4Hk': {
    reply: `🔍 SEO 岗位推荐\n👉 @SEO_job188`
  },
  '7763589134:AAFRCdEcp1bOhmi4jFumC3Yzsxyf0NJwVCA': {
    reply: `📊 欢迎了解运营岗位\n👉 @yunying_job_group`
  },
  '7964552472:AAHikf4d2MjRdAnlDw2yqalrOSXOlleGd38': {
    reply: `🧱 Web 前端岗位推荐\n👉 @web_H5_CSS_JS_job`
  },
  '7709168603:AAGTI3jqr8swAKlVatM1WQKNjS_lyJuINpk': {
    reply: `🎨 UI / UX 求职频道\n👉 @UI_UX_job`
  },
  '8156400800:AAEFZQ_sp4-O5XAqmU9NSnOe0Qw0k2KDOZs': {
    reply: `📋 产品经理岗位投递\n👉 @PM_job_group`
  },
  '7892070269:AAH2Mypqzf_iAHuEMXCEFAmu7P1g1mufkfs': {
    reply: `📋 产品经理岗位推荐\n👉 @PM_job_group`
  },
  '7358603470:AAFernynlE6-2_MHBBpyQvhKp6eyUjxD3ak': {
    reply: `📋 产品经理岗位推荐\n👉 @PM_job_group`
  },
  '7724003289:AAEW22DgHtAB2T1Cr0x84j_SxO6Ox9do73Y': {
    reply: `📋 产品经理岗位推荐\n👉 @PM_job_group`
  },
  '7756824011:AAEokWeLtdtkqknqz0USh5nGcw-PtHxHPio': {
    reply: `📋 产品经理岗位推荐\n👉 @PM_job_group`
  },
  '8091025610:AAFh77-RS3W1IvxQhdE0HIADvZ9nZinKzEk': {
    reply: `💻 PHP岗位推荐\n👉 @PHP_job_group`
  },
  '7731970911:AAG6-KPvFDHdfvjHITBtmimIBXJ4agXe5tc': {
    reply: `💻 PHP岗位推荐\n👉 @PHP_job_group`
  }
};

// 加载关键词配置 JSON
let keywordMap = {};
try {
  keywordMap = JSON.parse(fs.readFileSync('keywordReplies.json', 'utf-8'));
  console.log('✅ 关键词配置加载成功');
} catch (err) {
  console.error('❌ 加载关键词配置失败:', err);
  process.exit(1);
}

// 清洗用户文本（保留中文、字母、数字和空格）
function cleanText(text) {
  if (!text) return '';
  return text.toLowerCase().replace(/[^\p{Script=Han}\p{L}\p{N}\s]/gu, '').replace(/\s+/g, ' ').trim();
}

// 转义Telegram用户名中的下划线
function escapeUsername(text) {
  return text.replace(/@(\w+)_(\w+)/g, '@$1\\_$2');
}

// 匹配关键词
function matchKeyword(text) {
  if (!text) return null;
  
  const cleaned = cleanText(text);
  console.log('🔍 清洗后文本:', cleaned);
  
  for (const key in keywordMap) {
    const keywords = key.split(',').map(k => cleanText(k));
    console.log('🔎 尝试匹配关键词:', keywords);
    
    if (keywords.some(k => cleaned.includes(k))) {
      console.log('🎯 匹配成功:', key);
      return keywordMap[key];
    }
  }
  return null;
}

// 主入口
app.post('/:token', async (req, res) => {
  const token = req.params.token;
  const config = bots[token];
  
  if (!config) {
    console.warn(`⚠️ 未知的 Token: ${token}`);
    return res.status(404).send('Bot not found');
  }

  const chatId = req.body.message?.chat?.id;
  const textRaw = req.body.message?.text;

  if (!chatId) {
    console.warn('⚠️ 缺少 chatId');
    return res.status(400).send('Missing chatId');
  }

  const text = textRaw || '';
  console.log('📝 收到消息 - 用户ID:', chatId, '内容:', text);

  const matchedReply = matchKeyword(text);
  const response = matchedReply || config.reply || '📢 请输入关键词查看岗位信息，如：远程岗位 / 简历投递 / 福利待遇';

  try {
    const escapedResponse = escapeUsername(response);
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: chatId,
      text: escapedResponse,
      parse_mode: 'MarkdownV2'
    });
    console.log('✅ 回复发送成功');
  } catch (err) {
    console.error('❌ 消息发送失败:', err.response?.data || err.message);
    try {
      await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
        chat_id: chatId,
        text: response
      });
    } catch (fallbackErr) {
      console.error('🔥 降级发送失败:', fallbackErr.message);
    }
  }

  res.send('ok');
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('🔥 服务器错误:', err.stack);
  res.status(500).send('Server error');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Multi-bot AI 招聘客服正在运行，端口: ${PORT}`);
});
