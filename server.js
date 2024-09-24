const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());

// 读取提示词
const promptText = fs.readFileSync(path.join(__dirname, 'prompt.txt'), 'utf-8');

const API_KEY = 'sk-DqFoPwTxNbYKQjIm2f6dCf5b0234412eB1F38eA3509cDbAb'; // 请确保安全地存储API密钥

app.post('/api/chat', async (req, res) => {
    try {
        const messages = req.body.messages;

        // 如果messages中没有system角色的消息，添加提示词
        const hasSystemMessage = messages.some(message => message.role === 'system');
        if (!hasSystemMessage) {
            messages.unshift({role: 'system', content: promptText});
        }

        const response = await axios.post('https://oneapi.lucky68.top/v1/chat/completions', {
            model: 'gpt-4o',
            messages: messages
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).send('服务器错误');
    }
});

// 提供静态文件
app.use(express.static(path.join(__dirname, '/')));

app.listen(3000, () => {
    console.log('服务器已启动，端口3000');
});

