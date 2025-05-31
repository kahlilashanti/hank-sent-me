console.log('[Hank] Profile page content script running ✅');
chrome.runtime.sendMessage({ type: 'HANK_PROFILE_PAGE' });
