console.log('[Hank] Full Mutuals content script running ✅');

function parseSearchMutuals() {
    const mutuals = new Set();
    const anchors = document.querySelectorAll('a');

    anchors.forEach(a => {
        const text = a.textContent?.trim();
        if (!text) return;

        const cleaned = text.replace(/View.*$/, '').trim();

        if (
            cleaned &&
            cleaned.length > 2 &&
            cleaned.split(' ').length >= 2 &&
            !/mutual|status|connections|services|Premium|Messages|Notifications|Jobs|Events|Courses/i.test(cleaned)
        ) {
            mutuals.add(cleaned);
        }
    });

    const result = Array.from(mutuals);
    console.log('[Hank] ✅ Final mutuals parsed:', result);

    chrome.runtime.sendMessage({ type: 'HANK_MUTUALS', payload: result });
}

parseSearchMutuals();
