/* ==========================================
   LEGADO MURIALDINO — main.js
   ==========================================

   IMPORTANTE — EMAILJS SETUP:
   Para que el formulario envíe emails a bautycortereal@gmail.com
   necesitás configurar EmailJS (gratis):

   1. Creá una cuenta en https://www.emailjs.com
   2. Agregá un servicio de Gmail (conectá tu Gmail)
   3. Creá un Email Template con estas variables:
        {{nombre}}  {{apellido}}  {{telefono}}
        {{email}}   {{mensaje}}   {{reply_to}}
   4. Reemplazá los 3 valores de abajo con tus datos reales:
        EMAILJS_SERVICE_ID  → tu Service ID (ej: "service_abc123")
        EMAILJS_TEMPLATE_ID → tu Template ID (ej: "template_xyz456")
        EMAILJS_PUBLIC_KEY  → tu Public Key (ej: "user_XXXXXXXXX")

   Todo gratuito, sin backend, sin servidor.
   Instrucciones detalladas: https://www.emailjs.com/docs/
   ========================================== */

const EMAILJS_SERVICE_ID  = 'TU_SERVICE_ID';    // ← reemplazá
const EMAILJS_TEMPLATE_ID = 'TU_TEMPLATE_ID';   // ← reemplazá
const EMAILJS_PUBLIC_KEY  = 'TU_PUBLIC_KEY';     // ← reemplazá

document.addEventListener('DOMContentLoaded', () => {

  // ── INIT EMAILJS ──────────────────────────
  if (typeof emailjs !== 'undefined') {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  // ══════════════════════════════════════════
  // CURSOR PERSONALIZADO
  // ══════════════════════════════════════════
  const cursor         = document.getElementById('cursor');
  const cursorFollower = document.getElementById('cursorFollower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;
  let rafId;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  }, { passive: true });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.11;
    followerY += (mouseY - followerY) * 0.11;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top  = followerY + 'px';
    rafId = requestAnimationFrame(animateFollower);
  }
  animateFollower();

  document.querySelectorAll('a, button, input, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });

  // Ocultar cursor al salir de la ventana
  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; cursorFollower.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; cursorFollower.style.opacity = '1'; });


  // ══════════════════════════════════════════
  // PARTÍCULAS FLOTANTES
  // ══════════════════════════════════════════
  const particlesContainer = document.getElementById('particles');
  const PARTICLE_COUNT = 30;
  const COLORS = [
    'rgba(240,192,16,0.75)',
    'rgba(192,57,43,0.55)',
    'rgba(90,130,240,0.45)',
  ];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p    = document.createElement('div');
    const size = Math.random() * 2.8 + 1;
    p.className = 'particle';
    p.style.cssText = [
      `left:${Math.random() * 100}%`,
      `width:${size}px`,
      `height:${size}px`,
      `animation-duration:${Math.random() * 15 + 12}s`,
      `animation-delay:${Math.random() * 14}s`,
      `background:${COLORS[Math.floor(Math.random() * COLORS.length)]}`,
    ].join(';');
    particlesContainer.appendChild(p);
  }


  // ══════════════════════════════════════════
  // NAVBAR — scroll + active link
  // ══════════════════════════════════════════
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = Array.from(document.querySelectorAll('section[id]'));

  function updateNavbar() {
    // Fondo al hacer scroll
    navbar.classList.toggle('scrolled', window.scrollY > 40);

    // Destacar link activo
    const scrollMid = window.scrollY + window.innerHeight * 0.35;
    let current = '';
    sections.forEach(sec => {
      if (scrollMid >= sec.offsetTop) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();


  // ══════════════════════════════════════════
  // HAMBURGER MENU
  // ══════════════════════════════════════════
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navLinks');

  function closeMenu() {
    navMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  navMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

  // Cerrar al presionar Escape
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  // Cerrar al hacer click fuera
  document.addEventListener('click', e => {
    if (!navbar.contains(e.target)) closeMenu();
  });


  // ══════════════════════════════════════════
  // SMOOTH SCROLL
  // ══════════════════════════════════════════
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - 74,
          behavior: 'smooth',
        });
      }
    });
  });


  // ══════════════════════════════════════════
  // SCROLL REVEAL (IntersectionObserver)
  // ══════════════════════════════════════════
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(el => revealObs.observe(el));


  // ══════════════════════════════════════════
  // CONTADORES ANIMADOS
  // ══════════════════════════════════════════
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const dur    = 1500;
      const start  = performance.now();

      function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        const v = Math.round(target * (1 - Math.pow(1 - p, 4)));
        el.textContent = v + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      counterObs.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number[data-target]').forEach(el => counterObs.observe(el));


  // ══════════════════════════════════════════
  // PARALLAX SHAPES EN HERO
  // ══════════════════════════════════════════
  const shapes = document.querySelectorAll('.shape');
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    shapes.forEach((s, i) => { s.style.transform = `translateY(${sy * (0.04 + i * 0.025)}px)`; });
  }, { passive: true });


  // ══════════════════════════════════════════
  // TILT 3D EN TARJETAS DE EQUIPO
  // ══════════════════════════════════════════
  document.querySelectorAll('.miembro-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const x  = (e.clientX - r.left) / r.width  - 0.5;
      const y  = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transition = 'transform .08s ease';
      card.style.transform  = `translateY(-8px) rotateX(${y * -9}deg) rotateY(${x * 9}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform .5s ease';
      card.style.transform  = '';
    });
  });


  // ══════════════════════════════════════════
  // GLOW RADIAL EN CARDS DE PROPUESTAS
  // ══════════════════════════════════════════
  document.querySelectorAll('.propuesta-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(240,192,16,.07) 0%, rgba(26,58,140,.14) 45%, rgba(7,16,30,.7) 100%)`;
    });
    card.addEventListener('mouseleave', () => { card.style.background = ''; });
  });


  // ══════════════════════════════════════════
  // RIPPLE EN BOTONES
  // ══════════════════════════════════════════
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const r      = this.getBoundingClientRect();
      const span   = document.createElement('span');
      span.className = 'ripple';
      span.style.cssText = `left:${e.clientX - r.left}px;top:${e.clientY - r.top}px`;
      this.appendChild(span);
      setTimeout(() => span.remove(), 600);
    });
  });

  // Inyectar keyframe ripple una sola vez
  if (!document.getElementById('rippleStyle')) {
    const s = document.createElement('style');
    s.id = 'rippleStyle';
    s.textContent = `.ripple{position:absolute;border-radius:50%;background:rgba(255,255,255,.22);width:10px;height:10px;margin-left:-5px;margin-top:-5px;transform:scale(0);animation:rippleKF .55s ease-out forwards;pointer-events:none}@keyframes rippleKF{to{transform:scale(22);opacity:0}}`;
    document.head.appendChild(s);
  }


  // ══════════════════════════════════════════
  // BOTÓN VOLVER ARRIBA
  // ══════════════════════════════════════════
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


  // ══════════════════════════════════════════
  // ANIMACIÓN LOGO HERO (glitch sutil)
  // ══════════════════════════════════════════
  const heroImg = document.querySelector('.main-logo-img');
  if (heroImg) {
    setInterval(() => {
      if (Math.random() > 0.93) {
        heroImg.style.filter = 'drop-shadow(0 16px 40px rgba(240,192,16,.65)) hue-rotate(12deg) brightness(1.1)';
        setTimeout(() => {
          heroImg.style.filter = 'drop-shadow(0 16px 40px rgba(240,192,16,.32))';
        }, 90);
      }
    }, 2800);
  }


  // ══════════════════════════════════════════
  // TOAST HELPER
  // ══════════════════════════════════════════
  const toastEl = document.getElementById('toast');
  let toastTimer;

  function showToast(msg, type = 'info', duration = 4000) {
    clearTimeout(toastTimer);
    toastEl.textContent  = msg;
    toastEl.className    = `toast show ${type}`;
    toastTimer = setTimeout(() => { toastEl.classList.remove('show'); }, duration);
  }


  // ══════════════════════════════════════════
  // FORMULARIO DE CONTACTO — VALIDACIÓN + EMAILJS
  // ══════════════════════════════════════════
  const form      = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const btnText   = submitBtn.querySelector('.btn-text');
  const btnLoader = document.getElementById('btnLoader');

  // Campos y sus reglas
  const fields = {
    'cf-nombre':   { required: true,  minLen: 2, label: 'Nombre',          errId: 'err-nombre' },
    'cf-apellido': { required: true,  minLen: 2, label: 'Apellido',         errId: 'err-apellido' },
    'cf-telefono': { required: true,  type: 'tel', label: 'Teléfono',       errId: 'err-telefono' },
    'cf-email':    { required: false, type: 'email', label: 'Gmail',        errId: 'err-email' },
    'cf-mensaje':  { required: true,  minLen: 10, label: 'Mensaje',         errId: 'err-mensaje' },
  };

  // Validar un campo individual
  function validateField(id) {
    const cfg = fields[id];
    if (!cfg) return true;
    const el  = document.getElementById(id);
    const err = document.getElementById(cfg.errId);
    const val = el.value.trim();

    el.classList.remove('invalid', 'valid');
    err.textContent = '';

    // Obligatorio vacío
    if (cfg.required && val === '') {
      el.classList.add('invalid');
      err.textContent = `${cfg.label} es obligatorio.`;
      return false;
    }
    // Opcional vacío → ok
    if (!cfg.required && val === '') { return true; }

    // Longitud mínima
    if (cfg.minLen && val.length < cfg.minLen) {
      el.classList.add('invalid');
      err.textContent = `Ingresá al menos ${cfg.minLen} caracteres.`;
      return false;
    }

    // Teléfono: solo números, espacios, guiones, + ()
    if (cfg.type === 'tel') {
      const telClean = val.replace(/[\s\-\(\)\+]/g, '');
      if (!/^\d{6,15}$/.test(telClean)) {
        el.classList.add('invalid');
        err.textContent = 'Ingresá un número de teléfono válido.';
        return false;
      }
    }

    // Email
    if (cfg.type === 'email') {
      const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRx.test(val)) {
        el.classList.add('invalid');
        err.textContent = 'Ingresá un correo electrónico válido.';
        return false;
      }
    }

    el.classList.add('valid');
    return true;
  }

  // Validar en tiempo real al salir de cada campo
  Object.keys(fields).forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('blur',  () => validateField(id));
    el.addEventListener('input', () => {
      if (el.classList.contains('invalid')) validateField(id);
    });
  });

  // SUBMIT
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validar todos los campos
    let allValid = true;
    Object.keys(fields).forEach(id => { if (!validateField(id)) allValid = false; });
    if (!allValid) {
      showToast('⚠ Revisá los campos marcados en rojo.', 'error');
      // Hacer foco en el primer campo inválido
      const first = form.querySelector('.invalid');
      if (first) first.focus();
      return;
    }

    // Verificar que EmailJS esté configurado
    if (EMAILJS_SERVICE_ID === 'TU_SERVICE_ID') {
      showToast('⚠ Configurá EmailJS en main.js para habilitar el envío.', 'error', 6000);
      return;
    }

    // Estado de carga
    submitBtn.disabled  = true;
    btnText.textContent = 'Enviando…';
    btnLoader.classList.add('show');

    const nombre   = document.getElementById('cf-nombre').value.trim();
    const apellido = document.getElementById('cf-apellido').value.trim();
    const telefono = document.getElementById('cf-telefono').value.trim();
    const email    = document.getElementById('cf-email').value.trim();
    const mensaje  = document.getElementById('cf-mensaje').value.trim();

    const templateParams = {
      nombre,
      apellido,
      nombre_completo: `${nombre} ${apellido}`,
      telefono,
      email:    email || '(no proporcionado)',
      reply_to: email || 'sin-email@legadomurialdino.com',
      mensaje,
      fecha:    new Date().toLocaleDateString('es-AR', { day:'2-digit', month:'long', year:'numeric' }),
    };

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);

      // Éxito
      showToast('✔ ¡Mensaje enviado! Te respondemos pronto.', 'success', 5000);
      form.reset();
      // Limpiar clases de validación
      Object.keys(fields).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('valid', 'invalid');
      });

    } catch (err) {
      console.error('EmailJS error:', err);
      showToast('✖ No se pudo enviar. Intentá de nuevo más tarde.', 'error', 5000);
    } finally {
      submitBtn.disabled  = false;
      btnText.textContent = 'Enviar mensaje';
      btnLoader.classList.remove('show');
    }
  });


  // ══════════════════════════════════════════
  // CONSOLE BRAND
  // ══════════════════════════════════════════
  console.log('%c⚜ LEGADO MURIALDINO ⚜', 'color:#f0c010;font-size:20px;font-weight:bold;font-family:Georgia,serif;text-shadow:0 0 8px #f0c010');
  console.log('%cHaud Mori — Centro de Estudiantes · Instituto Murialdo', 'color:#8899cc;font-size:12px;');
  console.log('%c🏫 bautycortereal@gmail.com', 'color:#aaa;font-size:11px;');

});
