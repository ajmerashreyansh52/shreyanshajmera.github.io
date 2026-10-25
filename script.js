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

    initBridge();

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

// Hero drawing: a three-span continuous deck under a moving point load.
// Support moments come from the three-moment equation; the deflected shape
// is integrated numerically from the bending moment, span by span.
function initBridge() {
    const figure = document.getElementById('bridge');
    if (!figure) return;
    const svg    = figure.querySelector('svg');
    const slider = figure.querySelector('#loadPos');
    const out = {
        x:   figure.querySelector('[data-out="x"]'),
        sag: figure.querySelector('[data-out="sag"]'),
        hog: figure.querySelector('[data-out="hog"]')
    };

    const SPANS = [24, 33, 24];                 // m
    const SUPPORTS = [0, 24, 57, 81];           // m
    const TOTAL = 81;
    const LOAD = 100;                           // kN
    const N = 324;                              // samples along the deck (0.25 m)
    const STEP = TOTAL / N;
    const MIN_X = 0.5, MAX_X = 80.5;

    const spanOf = x => (x < SUPPORTS[1] ? 0 : x < SUPPORTS[2] ? 1 : 2);

    function analyse(a) {
        const [L1, L2, L3] = SPANS;
        const k = spanOf(a);
        const s = a - SUPPORTS[k];
        let r1 = 0, r2 = 0;
        if (k === 0) r1 = -LOAD * s * (L1 * L1 - s * s) / L1;
        if (k === 1) {
            const b = L2 - s;
            r1 = -LOAD * b * (L2 * L2 - b * b) / L2;
            r2 = -LOAD * s * (L2 * L2 - s * s) / L2;
        }
        if (k === 2) {
            const b = L3 - s;
            r2 = -LOAD * b * (L3 * L3 - b * b) / L3;
        }
        const a11 = 2 * (L1 + L2), a12 = L2, a22 = 2 * (L2 + L3);
        const det = a11 * a22 - a12 * a12;
        const M = [0, (r1 * a22 - a12 * r2) / det, (a11 * r2 - a12 * r1) / det, 0];

        const L = SPANS[k];
        const atLoad = M[k] * (1 - s / L) + M[k + 1] * (s / L) + LOAD * s * (L - s) / L;

        const m = new Float64Array(N + 1);
        for (let i = 0; i <= N; i++) {
            const x = i * STEP;
            const j = spanOf(x);
            const Lj = SPANS[j];
            const t = x - SUPPORTS[j];
            let v = M[j] * (1 - t / Lj) + M[j + 1] * (t / Lj);
            if (j === k) v += t <= s ? LOAD * (L - s) * t / L : LOAD * s * (L - t) / L;
            m[i] = v;
        }

        // Deflection (downwards positive) with zero displacement at every support
        const d = new Float64Array(N + 1);
        for (let j = 0; j < 3; j++) {
            const i0 = Math.round(SUPPORTS[j] / STEP);
            const i1 = Math.round(SUPPORTS[j + 1] / STEP);
            const J = [0];
            let slope = 0;
            for (let i = i0 + 1; i <= i1; i++) {
                const prev = slope;
                slope -= (m[i - 1] + m[i]) / 2 * STEP;
                J.push(J[J.length - 1] + (prev + slope) / 2 * STEP);
            }
            const n = i1 - i0, end = J[n];
            for (let i = 0; i <= n; i++) d[i0 + i] = J[i] - (i / n) * end;
        }
        return { M, m, d, atLoad };
    }

    // Fixed plotting scales, so the diagrams grow and shrink as the load moves
    let maxM = 0, maxD = 0;
    for (let a = MIN_X; a <= MAX_X; a += 0.5) {
        const r = analyse(a);
        for (let i = 0; i <= N; i++) {
            maxM = Math.max(maxM, Math.abs(r.m[i]));
            maxD = Math.max(maxD, Math.abs(r.d[i]));
        }
    }

    let geo = null;
    let load = 40.5;
    let interacted = false;
    let sweep = null;

    const fmt = v => (v < 0 ? '−' : '+') + Math.abs(Math.round(v));

    function layout() {
        const W = Math.round(svg.getBoundingClientRect().width) || 1000;
        const narrow = W < 640;
        const H = narrow ? 310 : 384;
        const ML = narrow ? 20 : 48;
        geo = {
            W, H, narrow, ML,
            usable: W - 2 * ML,
            deckY: narrow ? 112 : 128,
            bmdY: narrow ? 200 : 244,
            amp: narrow ? 46 : 64,
            dimY: H - 22,
            defl: narrow ? 14 : 20
        };
        svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
        svg.style.height = H + 'px';
        drawStatic();
        draw();
    }

    const px = x => geo.ML + (x / TOTAL) * geo.usable;

    function drawStatic() {
        const { deckY, bmdY, dimY, W, ML, narrow } = geo;
        let s = '';
        SUPPORTS.forEach((x, i) => {
            const X = px(x);
            s += `<line class="grid-line" x1="${X}" y1="36" x2="${X}" y2="${dimY + 10}"/>`;
            s += `<circle class="grid-bubble" cx="${X}" cy="20" r="13"/>`;
            s += `<text class="grid-label" x="${X}" y="24">${i + 1}</text>`;
            s += `<polygon class="support" points="${X},${deckY + 4} ${X - 9},${deckY + 20} ${X + 9},${deckY + 20}"/>`;
            s += `<line class="hatch" x1="${X - 14}" y1="${deckY + 22}" x2="${X + 14}" y2="${deckY + 22}"/>`;
            for (let t = -12; t <= 12; t += 6) {
                s += `<line class="hatch" x1="${X + t}" y1="${deckY + 22}" x2="${X + t - 5}" y2="${deckY + 28}"/>`;
            }
        });
        s += `<line class="deck-ref" x1="${ML}" y1="${deckY}" x2="${W - ML}" y2="${deckY}"/>`;
        s += `<line class="axis" x1="${ML}" y1="${bmdY}" x2="${W - ML}" y2="${bmdY}"/>`;
        if (!narrow) {
            s += `<text class="note-text" x="${ML + 10}" y="${bmdY - geo.amp - 12}">Bending moment, kNm</text>`;
        }
        s += `<line class="dim" x1="${ML}" y1="${dimY}" x2="${W - ML}" y2="${dimY}"/>`;
        SUPPORTS.forEach(x => {
            const X = px(x);
            s += `<line class="dim" x1="${X - 5}" y1="${dimY + 5}" x2="${X + 5}" y2="${dimY - 5}"/>`;
        });
        SPANS.forEach((L, i) => {
            s += `<text class="dim-text" x="${px(SUPPORTS[i] + L / 2)}" y="${dimY - 7}">${L.toFixed(1)} m</text>`;
        });
        svg.querySelectorAll('.static, .dynamic').forEach(g => g.remove());
        svg.insertAdjacentHTML('beforeend', `<g class="static">${s}</g><g class="dynamic"></g>`);
    }

    function draw() {
        const { deckY, bmdY, amp, defl, W, ML } = geo;
        const r = analyse(load);
        const mScale = amp / maxM, dScale = defl / maxD;
        const iLoad = Math.round(load / STEP);
        const yDeck = deckY + r.d[iLoad] * dScale;

        let bmd = `${px(0)},${bmdY}`, deck = '';
        for (let i = 0; i <= N; i++) {
            const X = px(i * STEP).toFixed(1);
            bmd  += ` ${X},${(bmdY + r.m[i] * mScale).toFixed(1)}`;
            deck += ` ${X},${(deckY + r.d[i] * dScale).toFixed(1)}`;
        }
        bmd += ` ${px(TOTAL)},${bmdY}`;

        const X = px(load);
        const yBmd = bmdY + r.atLoad * mScale;
        const anchor = X < ML + 40 ? 'start' : X > W - ML - 40 ? 'end' : 'middle';

        let s = '';
        s += `<polygon class="bmd" points="${bmd}"/>`;
        s += `<polyline class="deck" points="${deck}"/>`;
        s += `<line class="leader" x1="${X}" y1="${yDeck + 6}" x2="${X}" y2="${yBmd}"/>`;
        s += `<text class="value" x="${X}" y="${yBmd + 17}" text-anchor="${anchor}">${fmt(r.atLoad)}</text>`;
        [1, 2].forEach(i => {
            s += `<text class="value" x="${px(SUPPORTS[i])}" y="${bmdY + r.M[i] * mScale - 8}">${fmt(r.M[i])}</text>`;
        });
        s += `<line class="load" x1="${X}" y1="${yDeck - 62}" x2="${X}" y2="${yDeck - 12}"/>`;
        s += `<polygon class="load-head" points="${X},${yDeck - 3} ${X - 6},${yDeck - 14} ${X + 6},${yDeck - 14}"/>`;
        s += `<text class="load-text" x="${X}" y="${yDeck - 70}" text-anchor="${anchor}">${LOAD} kN</text>`;
        svg.querySelector('.dynamic').innerHTML = s;

        out.x.textContent = `${load.toFixed(1)} m`;
        out.sag.textContent = `${fmt(r.atLoad)} kNm`;
        out.hog.textContent = `${fmt(r.M[1])} / ${fmt(r.M[2])} kNm`;
        slider.value = load;
        slider.setAttribute('aria-valuetext', `Load at ${load.toFixed(1)} metres`);
    }

    function setLoad(x, byUser) {
        load = Math.min(MAX_X, Math.max(MIN_X, x));
        if (byUser) {
            if (sweep) { cancelAnimationFrame(sweep); sweep = null; }
            if (!interacted) { interacted = true; trackEvent('bridge_interaction'); }
        }
        draw();
    }

    function toMetres(clientX) {
        const rect = svg.getBoundingClientRect();
        const xSvg = (clientX - rect.left) * (geo.W / rect.width);
        return ((xSvg - geo.ML) / geo.usable) * TOTAL;
    }

    let dragging = false;
    svg.addEventListener('pointerdown', e => { dragging = true; setLoad(toMetres(e.clientX), true); });
    svg.addEventListener('pointermove', e => {
        if (dragging || e.pointerType === 'mouse') setLoad(toMetres(e.clientX), true);
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(t => svg.addEventListener(t, () => { dragging = false; }));
    slider.addEventListener('input', () => setLoad(parseFloat(slider.value), true));

    new ResizeObserver(debounce(layout, 100)).observe(svg);
    layout();

    // One slow pass of the load from the left abutment to mid-span, to show it moves
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const from = 2, to = 40.5, duration = 2400;
        let start = null;
        const step = t => {
            if (start === null) start = t;
            const p = Math.min(1, (t - start) / duration);
            const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
            setLoad(from + (to - from) * eased, false);
            sweep = p < 1 ? requestAnimationFrame(step) : null;
        };
        sweep = requestAnimationFrame(step);
    }
}

function debounce(fn, wait) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
}

function trackEvent(name, params = {}) {
    if (typeof gtag !== 'undefined') gtag('event', name, params);
}
