// 界面交互模块

const ui = {
    messagesDiv: document.getElementById('messages'),
    userInput: document.getElementById('user-input'),
    sendButton: document.getElementById('send-button'),

    initialize: function (sendMessageCallback) {
        this.userInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); // 防止换行
                sendMessageCallback();
            }
        });

        this.sendButton.addEventListener('click', () => {
            sendMessageCallback();
        });
    },

    addMessage: function (role, content) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', role);

        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('content');

        if (role === 'assistant') {
            // 将内容中的代码块转换为可视化的代码块
            const formattedContent = formatCodeBlocks(content);
            contentDiv.innerHTML = formattedContent;

            // 语法高亮
            contentDiv.querySelectorAll('pre code').forEach((el) => {
                hljs.highlightElement(el);
            });

            // 提取并渲染SVG
            const svgCode = extractSVGCode(content);
            if (svgCode) {
                this.renderSVG(svgCode, contentDiv); // 将SVG添加到消息内容中
            }

            // 添加代码块折叠功能
            this.addCodeToggle(contentDiv);
        } else {
            contentDiv.textContent = content;
        }

        messageContent.appendChild(contentDiv);
        messageDiv.appendChild(messageContent);
        this.messagesDiv.appendChild(messageDiv);
        this.messagesDiv.scrollTop = this.messagesDiv.scrollHeight;
    },

    renderSVG: function (svgCode, parentDiv) {
        const svgContainer = document.createElement('div');
        svgContainer.classList.add('svg-container');
        svgContainer.innerHTML = svgCode;

        const svgElement = svgContainer.querySelector('svg');

        if (svgElement) {
            svgElement.classList.add('rendered-svg');
            // 添加下载按钮
            const downloadButton = document.createElement('button');
            downloadButton.classList.add('download-button');
            downloadButton.textContent = '下载SVG';
            downloadButton.addEventListener('click', () => {
                this.downloadSVG(svgElement);
            });

            svgContainer.appendChild(downloadButton);
            parentDiv.appendChild(svgContainer); // 将SVG容器添加到消息内容中
            this.messagesDiv.scrollTop = this.messagesDiv.scrollHeight;
        }
    },

    addCodeToggle: function (contentDiv) {
        const codeWrappers = contentDiv.querySelectorAll('.code-block-wrapper');
        codeWrappers.forEach(wrapper => {
            const toggle = wrapper.querySelector('.code-toggle');
            const codeBlock = wrapper.querySelector('.code-block');
            toggle.addEventListener('click', () => {
                if (codeBlock.style.display === 'none') {
                    codeBlock.style.display = 'block';
                    toggle.textContent = '隐藏代码';
                } else {
                    codeBlock.style.display = 'none';
                    toggle.textContent = '显示代码';
                }
            });
            // 默认折叠代码块
            codeBlock.style.display = 'none';
        });
    },

    downloadSVG: function (svgElement) {
        const clone = svgElement.cloneNode(true);
        const svgData = new XMLSerializer().serializeToString(clone);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = 'image.svg';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        URL.revokeObjectURL(url);
    },

    toggleInput: function (enabled) {
        this.userInput.disabled = !enabled;
        this.sendButton.disabled = !enabled;
    }
};

