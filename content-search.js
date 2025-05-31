console.log('[Hank] Full Mutuals content script running ✅');

function extractMutuals() {
    const names = [];
    const anchors = document.querySelectorAll('a');
    anchors.forEach(a => {
        const text = a.innerText.trim();
        if (text.length > 0 && text.includes('View') && text.includes('profile')) {
            const parts = text.split('View');
            if (parts.length > 1) {
                names.push(parts[0].trim());
            }
        }
    });

    console.log(`[Hank] ✅ Final mutuals parsed: (${names.length})`, names);

    if (names.length > 0) {
        chrome.runtime.sendMessage({ type: 'STORE_MUTUALS', mutuals: names });
    }
}

function setupRefreshListener() {
    window.addEventListener("hank-refresh", () => {
        console.log("[Hank] 🔁 Refresh triggered from popup");
        extractMutuals();
    });
}

setTimeout(() => {
    extractMutuals();
    setupRefreshListener();
}, 1500);
