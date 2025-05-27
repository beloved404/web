import { sendMessageToAI } from './gemini-api.js';

let chatHistory = [];

function createAIAssistant() {
    // 创建AI助手按钮
    const button = document.createElement('button');
    button.className = 'ai-assistant-button';
    button.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"></path></svg>';
    
    // 创建聊天容器
    const chatContainer = document.createElement('div');
    chatContainer.className = 'chat-container';
    chatContainer.innerHTML = `
        <div class="chat-header">
            <span>AI助手</span>
            <button class="close-chat">×</button>
        </div>
        <div class="chat-messages"></div>
        <div class="chat-input-container">
            <input type="text" class="chat-input" placeholder="请输入您的问题...">
            <button class="send-button">发送</button>
        </div>
    `;

    // 添加到页面
    document.body.appendChild(button);
    document.body.appendChild(chatContainer);

    // 事件处理
    button.addEventListener('click', () => {
        chatContainer.classList.toggle('active');
    });

    const closeButton = chatContainer.querySelector('.close-chat');
    closeButton.addEventListener('click', () => {
        chatContainer.classList.remove('active');
    });

    const sendButton = chatContainer.querySelector('.send-button');
    const input = chatContainer.querySelector('.chat-input');
    const messagesContainer = chatContainer.querySelector('.chat-messages');

    async function sendMessage() {
        const message = input.value.trim();
        if (!message) return;

        // 添加用户消息到界面
        appendMessage('user', message);
        input.value = '';

        // 发送到AI并获取回复
        const response = await sendMessageToAI(message);
        appendMessage('ai', response);
    }

    function appendMessage(type, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    sendButton.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// 页面加载完成后初始化AI助手
document.addEventListener('DOMContentLoaded', createAIAssistant); 