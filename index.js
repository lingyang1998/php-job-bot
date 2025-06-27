const express = require('express');
const axios = require('axios');
const fs = require('fs');

const app = express();
app.use(express.json());

// 多 bot 配置：token → 默认频道引导
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

// 加载关键词自动回复配置
const keywordMap = JSON.parse(fs.readFileSync('keywordReplies.json', 'utf-8'));

// 匹配关键词
function matchKeyword(text) {
  for (const key in keywordMap) {
    const keywords = key.split(',');
    if (keywords.some(k => text.includes(k))) {
      return keywordMap[key];
    }
  }
  return null;
}

// 主入口：不同 bot 分别处理
app.post('/:token', async (req, res) => {
  const token = req.params.token;
  const config = bots[token];
  const chatId = req.body.message?.chat?.id;
  const text = req.body.message?.text?.toLowerCase();

  if (config && chatId) {
    const reply = text ? matchKeyword(text) : null;
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: chatId,
      text: reply || config.reply
    });
  }

  res.send('ok');
});

app.listen(3000, () => {
  console.log('🤖 Multi-bot + 关键词匹配 is running!');
});
