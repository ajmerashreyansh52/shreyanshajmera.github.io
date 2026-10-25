document.addEventListener('DOMContentLoaded', function () {

    requestAnimationFrame(() => document.body.classList.add('loaded'));

    // Full-screen menu
    const menuBtn = document.getElementById('menuBtn');
    const menu    = document.getElementById('menu');
    const label   = menuBtn.querySelector('.menu-label');

    function setMenu(open) {
        document.body.classList.toggle('menu-open', open);
        menuBtn.setAttribute('aria-expanded', String(open));
        label.textContent = open ? 'Close' : 'Menu';
        if (open) {
            menu.hidden = false;
            requestAnimationFrame(() => menu.classList.add('open'));
        } else {
            menu.classList.remove('open');
            setTimeout(() => { if (!menu.classList.contains('open')) menu.hidden = true; }, 600);
        }
    }
    menuBtn.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

    // Section titles slide in when they come into view
    const seen = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('in-view');
            seen.unobserve(entry.target);
        });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(el => seen.observe(el));

    // Analytics
    menu.querySelectorAll('nav a').forEach(a =>
        a.addEventListener('click', () => trackEvent('navigation_click', { section: a.getAttribute('href').slice(1) }))
    );
    document.querySelectorAll('a[href^="mailto:"]').forEach(a =>
        a.addEventListener('click', () => trackEvent('email_click'))
    );
    document.querySelectorAll('a[target="_blank"]').forEach(a =>
        a.addEventListener('click', () => trackEvent('external_link_click', { url: a.href }))
    );
    document.querySelectorAll('a[download]').forEach(a =>
        a.addEventListener('click', () => trackEvent('cv_download'))
    );

    let maxDepth = 0;
    window.addEventListener('scroll', debounce(() => {
        const pct = Math.round(window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100);
        if (pct > maxDepth) {
            maxDepth = pct;
            if (pct % 25 === 0) trackEvent('scroll_depth', { percentage: pct });
        }
    }, 500), { passive: true });
});

function debounce(fn, wait) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
}

function trackEvent(name, params = {}) {
    if (typeof gtag !== 'undefined') gtag('event', name, params);
}
