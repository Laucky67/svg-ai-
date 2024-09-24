// 与后端交互的模块

const api = {
    sendMessage: function (messages, onSuccess, onError, onFinally) {
        fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: messages.filter(msg => msg.role !== 'system') // 前端不发送系统提示词
            })
        })
        .then(response => response.json())
        .then(data => {
            const assistantMessage = data.choices[0].message.content;
            onSuccess(assistantMessage);
        })
        .catch(error => {
            console.error('Error:', error);
            onError('抱歉，发生了错误。');
        })
        .finally(() => {
            onFinally();
        });
    }
};

