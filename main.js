/* ==========================================
   ESPACIO MURIALDINO — main.js
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ── CURSOR PERSONALIZADO ──────────────────
  const cursor         = document.getElementById('cursor');
  const cursorFollower = document.getElementById('cursorFollower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Follower suave con RAF
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Escalar cursor en hover de links/buttons
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform         = 'translate(-50%, -50%) scale(2)';
      cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.4)';
      cursorFollower.style.opacity   = '0.3';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform         = 'translate(-50%, -50%) scale(1)';
      cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
      cursorFollower.style.opacity   = '0.6';
    });
  });


  // ── PARTÍCULAS FLOTANTES ─────────────────
  const particlesContainer = document.getElementById('particles');
  const PARTICLE_COUNT = 35;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');

    // Posición y tamaño aleatorios
    const size = Math.random() * 3 + 1;
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      animation-duration: ${Math.random() * 15 + 10}s;
      animation-delay: ${Math.random() * 12}s;
      opacity: ${Math.random() * 0.5 + 0.1};
    `;

    // Algunos son dorados, otros azulados
    if (Math.random() > 0.6) {
      p.style.background = 'rgba(240,192,16,0.8)';
    } else if (Math.random() > 0.5) {
      p.style.background = 'rgba(192,57,43,0.6)';
    } else {
      p.style.background = 'rgba(100,140,255,0.5)';
    }

    particlesContainer.appendChild(p);
  }


  // ── NAVBAR SCROLL ────────────────────────
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    highlightNav();
  }, { passive: true });

  // Active link en scroll
  function highlightNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY  = window.scrollY + 120;

    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      const link   = document.querySelector(`.nav-link[href="#${id}"]`);

      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          link.style.color = 'var(--gold)';
        } else {
          link.style.color = '';
        }
      }
    });
  }


  // ── HAMBURGER MENU ───────────────────────
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (navMenu.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });


  // ── SCROLL REVEAL ────────────────────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(el => {
    revealObserver.observe(el);
  });


  // ── CONTADORES ANIMADOS ──────────────────
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        animateCounter(el, 0, target, 1600);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number[data-target]').forEach(el => {
    counterObserver.observe(el);
  });

  function animateCounter(el, start, end, duration) {
    const startTime = performance.now();
    const suffix    = el.getAttribute('data-suffix') || '';

    function update(currentTime) {
      const elapsed  = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing out quart
      const eased    = 1 - Math.pow(1 - progress, 4);
      const value    = Math.round(start + (end - start) * eased);

      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }


  // ── PARALLAX HERO SHAPES ─────────────────
  const shapes = document.querySelectorAll('.shape');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    shapes.forEach((shape, i) => {
      const speed = 0.05 + i * 0.03;
      shape.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }, { passive: true });


  // ── TILT EN CARDS DE EQUIPO ──────────────
  document.querySelectorAll('.miembro-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = (e.clientX - rect.left) / rect.width  - 0.5;
      const y      = (e.clientY - rect.top)  / rect.height - 0.5;
      const tiltX  = y * -10;
      const tiltY  = x *  10;
      card.style.transform = `translateY(-8px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });


  // ── HOVER GLOW EN PROPUESTAS ─────────────
  document.querySelectorAll('.propuesta-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const x     = e.clientX - rect.left;
      const y     = e.clientY - rect.top;
      card.style.background = `
        radial-gradient(circle at ${x}px ${y}px,
          rgba(240,192,16,0.06) 0%,
          rgba(26,58,140,0.15) 50%,
          rgba(15,37,102,0.3) 100%)
      `;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });


  // ── SMOOTH SCROLL CON EASING ─────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href   = link.getAttribute('href');
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  // ── TEXTO TITLE: EFECTO TYPING SUTIL ─────
  const titleLines = document.querySelectorAll('.title-line');
  titleLines.forEach((line, i) => {
    setTimeout(() => {
      line.style.opacity = '1';
      line.style.transform = 'translateY(0)';
    }, 350 + i * 200);
  });


  // ── EFECTO GLITCH EN LOGO HERO ───────────
  const heroLogo = document.querySelector('.main-logo-svg');
  if (heroLogo) {
    setInterval(() => {
      if (Math.random() > 0.92) {
        heroLogo.style.filter = 'drop-shadow(0 20px 40px rgba(240,192,16,0.6)) hue-rotate(15deg)';
        setTimeout(() => {
          heroLogo.style.filter = 'drop-shadow(0 20px 40px rgba(240,192,16,0.25))';
        }, 80);
      }
    }, 3000);
  }


  // ── RIPPLE EN BOTONES ────────────────────
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect   = this.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;

      ripple.style.cssText = `
        position: absolute;
        left: ${x}px; top: ${y}px;
        width: 0; height: 0;
        border-radius: 50%;
        background: rgba(255,255,255,0.25);
        transform: translate(-50%, -50%);
        animation: rippleAnim 0.6s ease-out forwards;
        pointer-events: none;
      `;
      this.style.position = 'relative';
      this.style.overflow  = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Inyectar keyframe de ripple
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rippleAnim {
      to { width: 200px; height: 200px; opacity: 0; }
    }
  `;
  document.head.appendChild(style);


  // ── NAVBAR LINK HOVER UNDERLINE ANIMADO ──
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
      this.style.letterSpacing = '2.5px';
    });
    link.addEventListener('mouseleave', function() {
      this.style.letterSpacing = '';
    });
  });

  console.log('%c⚜ ESPACIO MURIALDINO ⚜', 'color: #f0c010; font-size: 18px; font-weight: bold; font-family: Georgia, serif;');
  console.log('%cHaud Mori — Centro de Estudiantes', 'color: #8899cc; font-size: 12px;');

});
