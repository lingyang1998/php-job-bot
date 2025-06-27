const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// 所有 bot 的配置：token 对应欢迎语和频道链接
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

// 主路由，路径中 token 用于识别 bot
app.post('/:token', async (req, res) => {
  const token = req.params.token;
  const config = bots[token];
  const chatId = req.body.message?.chat?.id;

  if (config && chatId) {
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: chatId,
      text: config.reply
    });
  }

  res.send('ok');
});

app.listen(3000, () => {
  console.log('🤖 Multi-bot is running!');
});
