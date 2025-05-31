chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'STORE_MUTUALS') {
        chrome.storage.local.set({ mutuals: message.mutuals }, () => {
            console.log('[Hank] ✅ Mutuals stored');
            sendResponse({ success: true });
        });
        return true; // async response
    } else if (message.type === 'GET_MUTUALS') {
        chrome.storage.local.get('mutuals', (data) => {
            sendResponse({ mutuals: data.mutuals || [] });
        });
        return true;
    }
});
