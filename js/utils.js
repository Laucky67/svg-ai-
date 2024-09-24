// 工具函数模块

// 从外部文件加载提示词
function loadPrompt(callback) {
    fetch('prompt.txt')
        .then(response => response.text())
        .then(promptText => {
            callback(promptText);
        })
        .catch(error => {
            console.error('无法加载提示词：', error);
            callback('你是一个根据用户描述生成SVG代码的助手，请将SVG代码放在单独的代码块中。');
        });
}

// 格式化代码块
function formatCodeBlocks(content) {
    return content.replace(/```(.*?)\n([\s\S]*?)```/g, function (match, lang, code) {
        return `<div class="code-block-wrapper">
                    <div class="code-toggle">显示代码</div>
                    <pre class="code-block"><code class="${lang}">${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
                </div>`;
    });
}

// 提取SVG代码
function extractSVGCode(content) {
    const codeBlockMatch = content.match(/```(svg)?\n([\s\S]*?)```/);
    if (codeBlockMatch) {
        return codeBlockMatch[2];
    }
    return null;
}

