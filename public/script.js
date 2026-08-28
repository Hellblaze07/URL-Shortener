document.addEventListener('DOMContentLoaded', () => {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    const shortenForm = document.getElementById('shortenForm');
    const shortenResult = document.getElementById('shortenResult');
    const shortenedLink = document.getElementById('shortenedLink');
    const copyBtn = document.getElementById('copyBtn');

    const analyticsForm = document.getElementById('analyticsForm');
    const analyticsResult = document.getElementById('analyticsResult');
    const totalClicks = document.getElementById('totalClicks');
    const visitHistoryList = document.getElementById('visitHistoryList');

    // Tab Switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(target).classList.add('active');
        });
    });

    // Helper for buttons
    const setLoading = (form, isLoading) => {
        const btnText = form.querySelector('.btn-text');
        const loader = form.querySelector('.loader');
        if(isLoading) {
            btnText.classList.add('hidden');
            loader.classList.remove('hidden');
        } else {
            btnText.classList.remove('hidden');
            loader.classList.add('hidden');
        }
    }

    // Handle URL Shortening
    shortenForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const urlInput = document.getElementById('urlInput').value;
        setLoading(shortenForm, true);
        shortenResult.classList.add('hidden');

        try {
            const res = await fetch('/url', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: urlInput })
            });
            const data = await res.json();
            
            if(data.id) {
                const fullUrl = `${window.location.origin}/${data.id}`;
                shortenedLink.href = fullUrl;
                shortenedLink.textContent = fullUrl;
                shortenResult.classList.remove('hidden');
            }
        } catch (err) {
            alert('Failed to shorten URL');
        } finally {
            setLoading(shortenForm, false);
        }
    });

    // Handle Copy
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(shortenedLink.href).then(() => {
            const oldHtml = copyBtn.innerHTML;
            copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
            setTimeout(() => { copyBtn.innerHTML = oldHtml; }, 2000);
        });
    });

    // Handle Analytics
    analyticsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        let shortId = document.getElementById('shortIdInput').value.trim();
        
        // If user pastes the full URL, extract just the short ID
        if (shortId.includes('/')) {
            const parts = shortId.split('/');
            shortId = parts[parts.length - 1];
        }

        setLoading(analyticsForm, true);
        analyticsResult.classList.add('hidden');
        visitHistoryList.innerHTML = '';
        totalClicks.classList.remove('error-msg');

        try {
            const res = await fetch(`/url/analytics/${shortId}`);
            if(!res.ok) throw new Error('Not found');
            const data = await res.json();
            
            totalClicks.textContent = data.totalClicks;
            
            if(data.analystics && data.analystics.length > 0) {
                data.analystics.reverse().forEach(visit => {
                    const date = new Date(visit.timestamp);
                    const li = document.createElement('li');
                    li.textContent = date.toLocaleString();
                    visitHistoryList.appendChild(li);
                });
            } else {
                const li = document.createElement('li');
                li.textContent = 'No visits yet.';
                li.style.color = 'var(--text-muted)';
                visitHistoryList.appendChild(li);
            }
            
            analyticsResult.classList.remove('hidden');
        } catch (err) {
            totalClicks.textContent = 'Invalid ID';
            totalClicks.classList.add('error-msg');
            visitHistoryList.innerHTML = '<li>Cannot fetch analytics for this ID.</li>';
            analyticsResult.classList.remove('hidden');
        } finally {
            setLoading(analyticsForm, false);
        }
    });
});
