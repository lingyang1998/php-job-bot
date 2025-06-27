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
  '7931339905:AAFMGS76pZMaJsoT2fUCXZbAo7YVUHYbTXU': {
    reply: `🔍 欢迎查看【SEO 岗位】\n👉 @SEO_job_group`
  },
  '7964552472:AAHikf4d2MjRdAnlDw2yqalrOSXOlleGd38': {
    reply: `🧱 Web 前端岗位推荐\n👉 @web_H5_CSS_JS_job`
  },
  '7709168603:AAGTI3jqr8swAKlVatM1WQKNjS_lyJuINpk': {
    reply: `🎨 UI / UX 求职频道\n👉 @UI_UX_job`
  },
  '8156400800:AAEFZQ_sp4-O5XAqmU9NSnOe0Qw0k2KDOZs': {
    reply: `📋 产品经理岗位投递\n👉 @PM_job_group`
  }
};

// 加载关键词配置 JSON
const keywordMap = JSON.parse(fs.readFileSync('keywordReplies.json', 'utf-8'));

// 清洗用户文本（去除标点 emoji 空格）
function cleanText(text) {
  return text.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '').trim();
}

// 匹配关键词
function matchKeyword(text) {
  const cleaned = cleanText(text);
  for (const key in keywordMap) {
    const keywords = key.split(',').map(k => cleanText(k));
    if (keywords.some(k => cleaned.includes(k))) {
      return keywordMap[key];
    }
  }
  return null;
}

// 主入口
app.post('/:token', async (req, res) => {
  const token = req.params.token;
  const config = bots[token];
  const chatId = req.body.message?.chat?.id;
  const textRaw = req.body.message?.text;

  if (config && chatId) {
    const text = textRaw || '';
    console.log('📝 收到内容:', text);

    const matchedReply = matchKeyword(text);

    const response = matchedReply || config.reply || '📢 请输入关键词查看岗位信息，如：远程岗位 / 简历投递 / 福利待遇';

    try {
      await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
        chat_id: chatId,
        text: response
      });
    } catch (err) {
      console.error('❌ 消息发送失败:', err.message);
    }
  }

  res.send('ok');
});

app.listen(3000, () => {
  console.log('✅ Multi-bot AI 招聘客服 is running!');
});
