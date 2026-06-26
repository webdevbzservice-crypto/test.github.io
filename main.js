/* ══════════════════════════════════════════════════════════════════
   BZ DEV — main.js
   Futuristic Premium Web Studio — PT-PT
   ══════════════════════════════════════════════════════════════════ */

'use strict';

/* ═══════════════════════════════════════════════════════════════════
   EMAILJS CONFIGURATION
   ═══════════════════════════════════════════════════════════════════
   Para ativar o envio de emails:
   1. Crie uma conta em https://www.emailjs.com/ (gratuito até 200 emails/mês)
   2. Adicione um serviço de email (Gmail, Outlook, etc.)
   3. Crie um template de email com as variáveis:
      {{nome}}, {{empresa}}, {{email}}, {{telemovel}}, {{mensagem}}
   4. Substitua os valores abaixo pelas suas credenciais reais
   5. Inicialize o EmailJS com a sua Public Key
*/
const EMAILJS_CONFIG = {
  SERVICE_ID:  'service_ueu9zzv',
  TEMPLATE_ID: 'template_958lv7e',
  PUBLIC_KEY:  '4qAu91qLzRlLGHzC_',
};

/* ─── INIT EMAILJS ─────────────────────────────────────────────── */
(function initEmailJS() {
  if (typeof emailjs !== 'undefined') {
    try {
      emailjs.init('4qAu91qLzRlLGHzC_');
    } catch (e) {
      console.warn('[BZ Dev] EmailJS init error:', e);
    }
  }
})();

/* ═══════════════════════════════════════════════════════════════════
   PARTICLE CANVAS
   ═══════════════════════════════════════════════════════════════════ */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrameId;
  let W, H;

  const CONFIG = {
    count: 80,
    maxRadius: 1.5,
    minRadius: 0.3,
    speed: 0.25,
    connectionDist: 140,
    colors: ['#00ff88', '#00d4ff', '#0affef', '#0066ff'],
  };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomColor() {
    return CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
  }

  function createParticle() {
    return {
      x:   Math.random() * W,
      y:   Math.random() * H,
      vx:  (Math.random() - 0.5) * CONFIG.speed,
      vy:  (Math.random() - 0.5) * CONFIG.speed,
      r:   CONFIG.minRadius + Math.random() * (CONFIG.maxRadius - CONFIG.minRadius),
      color: randomColor(),
      opacity: 0.2 + Math.random() * 0.5,
    };
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < CONFIG.count; i++) {
      particles.push(createParticle());
    }
  }

  function drawLine(p1, p2, dist) {
    const alpha = (1 - dist / CONFIG.connectionDist) * 0.18;
    ctx.beginPath();
    ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
    ctx.lineWidth = 0.6;
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Update & draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      // Wrap edges
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Connections
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.connectionDist) {
          ctx.globalAlpha = 1;
          drawLine(p, q, dist);
        }
      }
    }

    animFrameId = requestAnimationFrame(draw);
  }

  function init() {
    resize();
    initParticles();
    draw();
  }

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animFrameId);
    resize();
    initParticles();
    draw();
  });

  // Reduce particles on low-end devices
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
    CONFIG.count = 40;
  }

  init();
})();

/* ═══════════════════════════════════════════════════════════════════
   NAVBAR — scroll behavior + mobile menu
   ═══════════════════════════════════════════════════════════════════ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  // Scroll class
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Hamburger toggle
  hamburger.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile menu on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* ═══════════════════════════════════════════════════════════════════
   INTERSECTION OBSERVER — fade-in animations
   ═══════════════════════════════════════════════════════════════════ */
(function initScrollAnimations() {
  const targets = document.querySelectorAll('.fade-in-up');
  if (!targets.length) return;

  // Stagger children inside a parent
  document.querySelectorAll('.servicos-grid, .valores-grid, .founders-grid').forEach(parent => {
    const children = parent.querySelectorAll('.fade-in-up');
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.1}s`;
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
})();

/* ═══════════════════════════════════════════════════════════════════
   CONTACT FORM — EmailJS integration
   ═══════════════════════════════════════════════════════════════════ */
(function initContactForm() {
  const form    = document.getElementById('contact-form');
  const btnText = document.getElementById('btn-text');
  const btnLoad = document.getElementById('btn-loading');
  const status  = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');

  if (!form) return;

  function setStatus(type, msg) {
    status.className = `form-status ${type}`;
    status.textContent = msg;
    status.style.display = 'block';
    // Auto-hide after 7s
    setTimeout(() => {
      status.style.display = 'none';
    }, 7000);
  }

  function setLoading(loading) {
    submitBtn.disabled = loading;
    btnText.style.display  = loading ? 'none' : 'flex';
    btnLoad.style.display  = loading ? 'flex' : 'none';
  }

  function validateForm(data) {
    if (!data.nome.trim()) {
      setStatus('error', 'Por favor, preencha o seu nome.');
      return false;
    }
    if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      setStatus('error', 'Por favor, insira um endereço de email válido.');
      return false;
    }
    if (!data.mensagem.trim() || data.mensagem.trim().length < 10) {
      setStatus('error', 'Por favor, escreva uma mensagem com pelo menos 10 caracteres.');
      return false;
    }
    return true;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.style.display = 'none';

    const formData = {
      nome:      document.getElementById('field-nome').value,
      empresa:   document.getElementById('field-empresa').value,
      email:     document.getElementById('field-email').value,
      telemovel: document.getElementById('field-telemovel').value,
      mensagem:  document.getElementById('field-mensagem').value,
    };

    if (!validateForm(formData)) return;

    setLoading(true);

    /* ─── EMAILJS SEND ─────────────────────────────────────────── */
    try {
      await emailjs.sendForm(
        'service_ueu9zzv',
        'template_958lv7e',
        form
      );
      setStatus('success', '✓ Mensagem enviada com sucesso! Entraremos em contacto em breve.');
      form.reset();
    } catch (err) {
      console.error('[BZ Dev] Erro ao enviar email:', err);
      setStatus('error', '✗ Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente ou contacte-nos diretamente por email.');
    } finally {
      setLoading(false);
    }
  });
})();

/* ═══════════════════════════════════════════════════════════════════
   SMOOTH SCROLL — para links internos
   ═══════════════════════════════════════════════════════════════════ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

/* ═══════════════════════════════════════════════════════════════════
   FOOTER YEAR
   ═══════════════════════════════════════════════════════════════════ */
(function setFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ═══════════════════════════════════════════════════════════════════
   ACTIVE NAV LINK — highlight on scroll
   ═══════════════════════════════════════════════════════════════════ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link:not(.nav-cta)');

  function updateActive() {
    let current = '';
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 120) current = section.id;
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
})();

/* ═══════════════════════════════════════════════════════════════════
   CONSENTIMENTO DE COOKIES
   Guarda a escolha do utilizador em localStorage.
   Chave: 'bzdev_cookie_consent'
   Valores possíveis:
     'all'       — aceitou todos os cookies
     'essential' — rejeitou os não essenciais (apenas necessários)
     null        — ainda não escolheu (banner visível)
   ═══════════════════════════════════════════════════════════════════ */
(function initCookieConsent() {
  const STORAGE_KEY  = 'bzdev_cookie_consent';
  const EXPIRY_DAYS  = 365; // renovar consentimento após 1 ano

  const banner       = document.getElementById('cookie-banner');
  const acceptBtn    = document.getElementById('cookie-accept-btn');
  const rejectBtn    = document.getElementById('cookie-reject-btn');
  const manageBtn    = document.getElementById('cookie-manage-btn');
  const prefPanel    = document.getElementById('cookie-preferences');
  const analyticsChk = document.getElementById('pref-analytics');

  if (!banner) return; // página sem banner

  /* ── helpers ──────────────────────────────────────────────────── */
  function getConsent() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      // Verificar expiração
      if (parsed.expires && Date.now() > parsed.expires) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  }

  function saveConsent(choice, analytics) {
    const expires = Date.now() + EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ choice, analytics, expires, date: new Date().toISOString() }));
  }

  function hideBanner() {
    banner.classList.remove('visible');
    banner.addEventListener('transitionend', () => {
      banner.style.display = 'none';
    }, { once: true });
  }

  function showBanner() {
    banner.style.display = 'block';
    // Pequeno delay para a animação ser percetível
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        banner.classList.add('visible');
      });
    });
  }

  function applyConsent(consentData) {
    if (!consentData) return;
    // Aqui pode ativar/desativar scripts de analytics conforme consentData.analytics
    // Exemplo para Google Analytics:
    // if (consentData.analytics) { /* inicializar GA */ }
    // console.info('[BZ Dev] Consentimento aplicado:', consentData.choice);
  }

  /* ── init ─────────────────────────────────────────────────────── */
  const existing = getConsent();

  if (existing) {
    // Utilizador já escolheu — aplicar e não mostrar banner
    applyConsent(existing);
    banner.style.display = 'none';
    return;
  }

  // Primeira visita — mostrar banner após 800ms para não colidir com animações de entrada
  setTimeout(showBanner, 800);

  /* ── botão: Aceitar Todos ─────────────────────────────────────── */
  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      saveConsent('all', true);
      applyConsent({ choice: 'all', analytics: true });
      hideBanner();
    });
  }

  /* ── botão: Rejeitar Não Essenciais ──────────────────────────── */
  if (rejectBtn) {
    rejectBtn.addEventListener('click', () => {
      saveConsent('essential', false);
      applyConsent({ choice: 'essential', analytics: false });
      hideBanner();
    });
  }

  /* ── botão: Gerir Preferências ───────────────────────────────── */
  if (manageBtn && prefPanel) {
    manageBtn.addEventListener('click', () => {
      const isOpen = prefPanel.style.display === 'none' || prefPanel.style.display === '';

      if (isOpen) {
        prefPanel.style.display = 'flex';
        prefPanel.removeAttribute('aria-hidden');
        manageBtn.textContent = 'Guardar Preferências';
        manageBtn.setAttribute('aria-expanded', 'true');
      } else {
        // Guardar as preferências personalizadas
        const analyticsAccepted = analyticsChk ? analyticsChk.checked : false;
        saveConsent(analyticsAccepted ? 'all' : 'essential', analyticsAccepted);
        applyConsent({ choice: analyticsAccepted ? 'all' : 'essential', analytics: analyticsAccepted });
        hideBanner();
      }
    });
  }
})();
