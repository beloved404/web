let chatHistory = [];

async function sendMessageToAI(userMessage) {
    // 添加用户消息到历史
    chatHistory.push({ role: "user", parts: [{ text: userMessage }] });
    
    try {
        const apiKey = "AIzaSyALwVl1iwLavjaZW-Wx3FP2zJWoYzQfamU";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        
        const payload = { contents: chatHistory };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            const errorMsg = `抱歉，发生错误: ${errorData.error?.message || response.statusText}`;
            return errorMsg;
        }

        const result = await response.json();
        
        // 解析AI回复
        let aiResponseText = "抱歉，我暂时无法回答。";
        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            aiResponseText = result.candidates[0].content.parts[0].text;
        } else if (result.promptFeedback && result.promptFeedback.blockReason) {
            aiResponseText = `无法生成回复，原因: ${result.promptFeedback.blockReason}`;
        }
        
        // 添加AI回复到历史
        chatHistory.push({ role: "model", parts: [{ text: aiResponseText }] });
        
        return aiResponseText;

    } catch (error) {
        console.error('Fetch Error:', error);
        const networkErrorMsg = '抱歉，连接AI助手时遇到网络问题。';
        chatHistory.push({ role: "model", parts: [{ text: networkErrorMsg }] });
        return networkErrorMsg;
    }
}

export { sendMessageToAI }; 