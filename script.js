document.addEventListener('DOMContentLoaded', function () {

    // Mobile menu
    const navToggle = document.getElementById('navToggle');
    const navLinks  = document.getElementById('navLinks');
    const header    = document.querySelector('.site-header');

    function closeMenu() {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
    }
    navToggle.addEventListener('click', () => {
        const open = navLinks.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', String(open));
    });
    navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('click', e => {
        if (!header.contains(e.target)) closeMenu();
    });

    // Highlight the nav link for the section in view
    const sections = document.querySelectorAll('section[id]');
    const navItems = navLinks.querySelectorAll('a');
    function setActiveNav() {
        let current = '';
        sections.forEach(s => {
            if (window.scrollY >= s.offsetTop - 120) current = s.id;
        });
        navItems.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
        });
    }
    window.addEventListener('scroll', debounce(setActiveNav, 60), { passive: true });
    setActiveNav();

    // Analytics
    navItems.forEach(a =>
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
