const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// 自动回复逻辑
app.post('/', async (req, res) => {
  const token = process.env.TELEGRAM_TOKEN; // 从环境变量中获取 Token
  const chatId = req.body.message?.chat?.id;

  if (chatId) {
    const msg = `📢 欢迎关注我们的 PHP 招聘频道！\n👉 @PHP_job_group`;  // ✅ 修复：这里要关闭字符串
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: chatId,
      text: msg
    });
  }

  res.send('ok');
});

// 启动服务
app.listen(3000, () => {
  console.log('Bot is running!');
});
