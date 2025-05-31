document.addEventListener('DOMContentLoaded', () => {
    const profilePrompt = document.getElementById('profilePrompt');
    const scorePanel = document.getElementById('scorePanel');
    const mutualList = document.getElementById('mutualList');
    const statusText = document.getElementById('statusText');
    const openFullBtn = document.getElementById('openFullBtn');

    // Get cached mutuals from background
    chrome.runtime.sendMessage({ type: 'GET_MUTUALS' }, (response) => {
        const mutuals = response?.mutuals || [];
        mutualList.innerHTML = ''; // Clear existing

        if (mutuals.length > 0) {
            scorePanel.classList.remove('d-none');
            const topMutuals = mutuals.slice(0, 10); // limit to top 10

            topMutuals.forEach(name => {
                const score = calculateHankScore(name);
                const card = document.createElement('div');
                card.className = 'card card-glass-sm p-2 text-center flex-fill';
                card.innerHTML = `
                    <div class="fw-bold mb-1">${name}</div>
                    <div class="hank-score">Hank Score: ${score}</div>
                `;
                mutualList.appendChild(card);
            });

            statusText.textContent = `Top ${topMutuals.length} mutual connections scored.`;
        } else {
            statusText.textContent = 'No mutuals found on this page.';
        }
    });

    // Listen for context shift to profile pages
    chrome.runtime.onMessage.addListener((msg) => {
        if (msg.type === 'HANK_PROFILE_PAGE') {
            profilePrompt.classList.remove('d-none');
            scorePanel.classList.add('d-none');
            statusText.textContent = 'Click below to open the full mutuals list.';
        }
    });

    // Button to open full mutuals
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

    // Basic scoring logic – replace with real heuristics later
    function calculateHankScore(name) {
        // For now: randomize for testing
        return Math.floor(Math.random() * 50 + 50); // 50–99
    }
});
