// 主逻辑脚本

let messages = [];

// 初始化应用
function init() {
    loadPrompt((promptText) => {
        messages.push({ role: 'system', content: promptText });
        ui.userInput.disabled = false; // 启用输入框
    });

    ui.initialize(handleMessageSend);
}

function handleMessageSend() {
    const content = ui.userInput.value.trim();
    if (content) {
        ui.addMessage('user', content);
        messages.push({ role: 'user', content: content });
        ui.userInput.value = '';
        sendMessage();
    }
}

function sendMessage() {
    ui.toggleInput(false);

    api.sendMessage(
        messages,
        (assistantMessage) => {
            ui.addMessage('assistant', assistantMessage);
            messages.push({ role: 'assistant', content: assistantMessage });
        },
        (errorMessage) => {
            ui.addMessage('assistant', errorMessage);
        },
        () => {
            ui.toggleInput(true);
            ui.userInput.focus();
        }
    );
}

// 启动应用
init();

