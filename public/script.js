document.addEventListener('DOMContentLoaded', () => {
  // ---- Element References ----
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  const shortenForm = document.getElementById('shortenForm');
  const shortenBtn = document.getElementById('shortenBtn');
  const urlInput = document.getElementById('urlInput');
  const shortenResult = document.getElementById('shortenResult');
  const shortenedLink = document.getElementById('shortenedLink');
  const copyBtn = document.getElementById('copyBtn');
  const shortenToast = document.getElementById('shortenToast');

  const analyticsForm = document.getElementById('analyticsForm');
  const analyticsBtn = document.getElementById('analyticsBtn');
  const shortIdInput = document.getElementById('shortIdInput');
  const analyticsResult = document.getElementById('analyticsResult');
  const totalClicks = document.getElementById('totalClicks');
  const visitHistoryList = document.getElementById('visitHistoryList');
  const analyticsToast = document.getElementById('analyticsToast');

  // ---- Tab Switching ----
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      // Update tab buttons
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Update tab panels
      tabContents.forEach(c => c.classList.remove('active'));
      document.getElementById(target).classList.add('active');

      // Clear toasts when switching tabs
      hideToast(shortenToast);
      hideToast(analyticsToast);
    });
  });

  // ---- Loading State Helper ----
  function setLoading(button, isLoading) {
    if (isLoading) {
      button.classList.add('loading');
      button.disabled = true;
    } else {
      button.classList.remove('loading');
      button.disabled = false;
    }
  }

  // ---- Toast Helpers ----
  function showToast(el, message, type) {
    // type: 'error' | 'success'
    el.className = 'toast show ' + type;

    const icon = type === 'error'
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';

    el.innerHTML = icon + '<span>' + message + '</span>';

    // Auto-dismiss after 5s
    clearTimeout(el._timer);
    el._timer = setTimeout(() => hideToast(el), 5000);
  }

  function hideToast(el) {
    el.classList.remove('show', 'error', 'success');
    clearTimeout(el._timer);
  }

  // ---- Animated Counter ----
  function animateCount(el, target) {
    const duration = 600;
    const start = parseInt(el.textContent) || 0;
    const diff = target - start;
    if (diff === 0) {
      el.textContent = target;
      return;
    }
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(start + diff * eased);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  // ---- Handle URL Shortening ----
  shortenForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = urlInput.value.trim();

    if (!url) return;

    hideToast(shortenToast);
    shortenResult.classList.add('hidden');
    setLoading(shortenBtn, true);

    try {
      const res = await fetch('/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to shorten URL');
      }

      if (data.id) {
        const fullUrl = `${window.location.origin}/${data.id}`;
        shortenedLink.href = fullUrl;
        shortenedLink.textContent = fullUrl;
        shortenResult.classList.remove('hidden');

        // Re-trigger animation
        shortenResult.style.animation = 'none';
        shortenResult.offsetHeight; // force reflow
        shortenResult.style.animation = '';
      }
    } catch (err) {
      showToast(shortenToast, err.message || 'Something went wrong. Please try again.', 'error');
    } finally {
      setLoading(shortenBtn, false);
    }
  });

  // ---- Handle Copy ----
  copyBtn.addEventListener('click', () => {
    const url = shortenedLink.href;
    if (!url || url === '#') return;

    navigator.clipboard.writeText(url).then(() => {
      const iconCopy = copyBtn.querySelector('.icon-copy');
      const iconCheck = copyBtn.querySelector('.icon-check');

      iconCopy.classList.add('hidden');
      iconCheck.classList.remove('hidden');
      copyBtn.classList.add('copied');

      setTimeout(() => {
        iconCheck.classList.add('hidden');
        iconCopy.classList.remove('hidden');
        copyBtn.classList.remove('copied');
      }, 2000);
    }).catch(() => {
      showToast(shortenToast, 'Could not copy to clipboard.', 'error');
    });
  });

  // ---- Handle Analytics ----
  analyticsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let shortId = shortIdInput.value.trim();

    if (!shortId) return;

    // Extract short ID from full URL if pasted
    if (shortId.includes('/')) {
      const parts = shortId.split('/');
      shortId = parts[parts.length - 1];
    }

    hideToast(analyticsToast);
    analyticsResult.classList.add('hidden');
    totalClicks.classList.remove('error-state');
    setLoading(analyticsBtn, true);

    try {
      const res = await fetch(`/url/analytics/${shortId}`);

      if (!res.ok) {
        throw new Error('Short ID not found');
      }

      const data = await res.json();

      // Animate the click counter
      animateCount(totalClicks, data.totalClicks);

      // Populate visit history
      visitHistoryList.innerHTML = '';

      if (data.analystics && data.analystics.length > 0) {
        // Show most recent first, limit to 50
        const visits = [...data.analystics].reverse().slice(0, 50);
        visits.forEach(visit => {
          const date = new Date(visit.timestamp);
          const li = document.createElement('li');
          li.innerHTML = `<span class="history-dot"></span>${formatDate(date)}`;
          visitHistoryList.appendChild(li);
        });
      } else {
        const li = document.createElement('li');
        li.className = 'history-empty';
        li.textContent = 'No visits recorded yet.';
        visitHistoryList.appendChild(li);
      }

      analyticsResult.classList.remove('hidden');
    } catch (err) {
      showToast(analyticsToast, err.message || 'Could not retrieve analytics.', 'error');
    } finally {
      setLoading(analyticsBtn, false);
    }
  });

  // ---- Date Formatter ----
  function formatDate(date) {
    const now = new Date();
    const diff = now - date;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      hour: '2-digit',
      minute: '2-digit'
    });
  }
});
