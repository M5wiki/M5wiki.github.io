(function() {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent) || navigator.maxTouchPoints > 1;

    const cfg = {
        months: [11, 0, 1],
        max: isMobile ? 50 : 200,
        chars: ['❄', '❅', '❆', '✻', '✼', '❉', '❋', '✱', '✲', '✳', '•', '·', '✦', '✧', '⋆', '✶', '✴', '✵', '❈', '❊', '✷', '✸', '*', '˖', '˙'],
        colors: ['#FFFFFF', '#F0F8FF', '#E6E6FA', '#F5F5F5'],
        glows: ['none', '0 0 2px rgba(255,255,255,0.4)', '0 0 4px rgba(255,255,255,0.6)', '0 0 6px rgba(255,255,255,0.8)']
    };
    if (!cfg.months.includes(new Date().getMonth())) return;

    const c = document.createElement('div');
    document.body.appendChild(c);
    const m = { x: -1e3, y: -1e3 };
    addEventListener('mousemove', e => { m.x = e.clientX; m.y = e.clientY; });

    const cs = () => {
        const s = document.createElement('div');
        s.innerHTML = cfg.chars[~~(Math.random() * cfg.chars.length)];
        Object.assign(s.style, {
            color: cfg.colors[~~(Math.random() * cfg.colors.length)],
            textShadow: cfg.glows[~~(Math.random() * cfg.glows.length)],
            fontSize: '0.6em', userSelect: 'none', position: 'fixed', top: 0, left: 0, zIndex: 9999, pointerEvents: 'none'
        });
        const st = { el: s, x: Math.random() * innerWidth, y: -20, vx: 0, vy: 0, sz: Math.random() * 0.5 + 0.5, fs: Math.random() + 0.5, ss: Math.random() * 0.02 + 0.01, sc: Math.random() * Math.PI * 2, r: 0, rs: (Math.random() - 0.5) * 3 };
        s.style.fontSize = st.sz + 'em';
        c.appendChild(s);
        const as = () => {
            st.vy = st.fs;
            const dx = st.x - m.x, dy = st.y - m.y, dist = Math.hypot(dx, dy);
            if (dist < 60 && dist > 0) { const f = (1 - dist / 60) * 0.1; st.vx += (dx / dist) * f; st.vy += (dy / dist) * f; }
            st.vx += Math.sin(st.sc) * 0.03; st.sc += st.ss; st.vx *= 0.98;
            st.r += st.rs;
            st.x += st.vx; st.y += st.vy;
            st.el.style.transform = `translate(${st.x}px, ${st.y}px) rotate(${st.r}deg)`;
            st.y > innerHeight + 20 ? st.el.remove() : requestAnimationFrame(as);
        };
        requestAnimationFrame(as);
    };
    setInterval(() => c.children.length < cfg.max && cs(), 300);
})();
