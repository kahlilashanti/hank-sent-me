document.addEventListener('DOMContentLoaded', () => {
    const profilePrompt = document.getElementById('profilePrompt');
    const scorePanel = document.getElementById('scorePanel');
    const mutualList = document.getElementById('mutualList');
    const statusText = document.getElementById('statusText');
    const openFullBtn = document.getElementById('openFullBtn');

    chrome.runtime.sendMessage({ type: 'GET_MUTUALS' }, (response) => {
        const mutuals = response?.mutuals || [];
        if (mutuals.length > 0) {
            scorePanel.classList.remove('d-none');
            mutuals.forEach(name => {
                const score = Math.floor(Math.random() * 50 + 50);
                const li = document.createElement('li');
                li.className = 'list-group-item bg-transparent border-white';
                li.textContent = `${name} – Hank Score: ${score}`;
                mutualList.appendChild(li);
            });
            statusText.textContent = `Found ${mutuals.length} connections.`;
        } else {
            statusText.textContent = 'No mutuals found on this page.';
        }
    });

    chrome.runtime.onMessage.addListener((msg) => {
        if (msg.type === 'HANK_PROFILE_PAGE') {
            profilePrompt.classList.remove('d-none');
            statusText.textContent = 'Click below to open the full mutuals list.';
        }
    });

    openFullBtn?.addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tabUrl = tabs[0].url;
            const profileIdMatch = tabUrl.match(/linkedin\.com\/in\/([^/]+)/);
            if (profileIdMatch) {
                const id = encodeURIComponent(profileIdMatch[1]);
                const fullUrl = `https://www.linkedin.com/search/results/people/?facetConnectionOf=%22${id}%22&facetNetwork=%22F%22&origin=MEMBER_PROFILE_CANNED_SEARCH`;
                chrome.tabs.create({ url: fullUrl });
            }
        });
    });
});
