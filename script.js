// Shreyansh Ajmera — Website JS
document.addEventListener('DOMContentLoaded', function () {

    // ── Navbar scroll effect ──
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    // ── Mobile nav toggle ──
    const navToggle = document.getElementById('navToggle');
    const navLinks  = document.getElementById('navLinks');
    navToggle?.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });

    // Close mobile nav on link click
    navLinks?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => navLinks.classList.remove('open'));
    });

    // Close mobile nav on outside click
    document.addEventListener('click', e => {
        if (!navbar.contains(e.target)) navLinks?.classList.remove('open');
    });

    // ── Active nav highlighting ──
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');

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

    // ── Scroll reveal ──
    const revealEls = document.querySelectorAll('.reveal-up, .reveal-right');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));

    // Trigger hero reveals immediately (they're in viewport)
    document.querySelectorAll('.hero .reveal-up, .hero .reveal-right').forEach(el => {
        setTimeout(() => el.classList.add('revealed'), parseFloat(el.style.getPropertyValue('--delay') || '0') * 1000);
    });

    // ── Smooth scroll ──
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                trackEvent('navigation_click', { section: link.getAttribute('href').slice(1) });
            }
        });
    });

    // ── Back to top ──
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        backToTop?.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    backToTop?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ── Video system ──
    const videoConfig = {
        1: 'dXG51nwp46U',
        2: null,
        3: null,
        4: null,
        5: null,
        6: null
    };
    Object.entries(videoConfig).forEach(([id, ytId]) => {
        const el = document.querySelector(`[data-video-id="${id}"]`);
        if (el) el.classList.toggle('d-none', !ytId);
    });

    // ── Analytics ──
    document.querySelectorAll('a[href^="mailto:"]').forEach(a =>
        a.addEventListener('click', () => trackEvent('email_click'))
    );
    document.querySelectorAll('a[target="_blank"]').forEach(a =>
        a.addEventListener('click', () => trackEvent('external_link_click', { url: a.href }))
    );
    document.querySelectorAll('a[download]').forEach(a =>
        a.addEventListener('click', () => trackEvent('cv_download'))
    );

    // Scroll depth tracking
    let maxDepth = 0;
    window.addEventListener('scroll', debounce(() => {
        const pct = Math.round(window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100);
        if (pct > maxDepth) {
            maxDepth = pct;
            if (pct % 25 === 0) trackEvent('scroll_depth', { percentage: pct });
        }
    }, 500), { passive: true });

    console.log('Site initialised ✓');
});

// ── Utilities ──
function debounce(fn, wait) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
}

function trackEvent(name, params = {}) {
    if (typeof gtag !== 'undefined') gtag('event', name, params);
}

// ── Public API: video management ──
window.showVideo = function (videoId, youtubeId, title, description, publishDate) {
    const el = document.querySelector(`[data-video-id="${videoId}"]`);
    if (!el) return;
    el.classList.remove('d-none');
    const iframe = el.querySelector('iframe');
    if (iframe) iframe.src = `https://www.youtube.com/embed/${youtubeId}`;
    if (title) { const t = el.querySelector('.card-title, h3'); if (t) t.textContent = title; }
    if (description) { const d = el.querySelector('.card-text, p'); if (d) d.textContent = description; }
    const s = el.querySelector('.text-muted, small');
    if (s) s.textContent = publishDate ? `Published: ${publishDate}` : `Published: ${new Date().toLocaleDateString()}`;
};

window.hideVideo = function (videoId) {
    document.querySelector(`[data-video-id="${videoId}"]`)?.classList.add('d-none');
};
