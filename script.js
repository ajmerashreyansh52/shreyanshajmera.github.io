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

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Section titles slide in; stats count up when they come into view
    const seen = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('in-view');
            seen.unobserve(entry.target);
        });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(el => seen.observe(el));

    const counters = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            countUp(entry.target);
            counters.unobserve(entry.target);
        });
    }, { threshold: 0.6 });
    if (!reduceMotion) document.querySelectorAll('[data-count]').forEach(el => counters.observe(el));

    function countUp(el) {
        const target = Number(el.dataset.count);
        const start = performance.now(), duration = 1200;
        const tick = now => {
            const p = Math.min(1, (now - start) / duration);
            el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }

    // Project image follows the cursor over the project list
    const float = document.querySelector('.work-float');
    const floatImg = float.querySelector('img');
    let x = 0, y = 0, fx = 0, fy = 0, running = false;

    function follow() {
        fx += (x - fx) * 0.18;
        fy += (y - fy) * 0.18;
        float.style.left = fx + 'px';
        float.style.top = fy + 'px';
        running = float.classList.contains('show') || Math.abs(x - fx) > 0.5;
        if (running) requestAnimationFrame(follow);
    }
    document.querySelectorAll('.work-item').forEach(item => {
        item.addEventListener('pointerenter', e => {
            if (e.pointerType !== 'mouse') return;
            floatImg.src = item.dataset.img;
            if (!float.classList.contains('show')) { fx = x = e.clientX; fy = y = e.clientY; }
            float.classList.add('show');
            if (!running) { running = true; requestAnimationFrame(follow); }
        });
        item.addEventListener('pointerleave', () => float.classList.remove('show'));
    });
    window.addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; }, { passive: true });

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
