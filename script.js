/* ═══════════════════════════════════════════════════════════
   AntarMann — JavaScript: Premium Animations & Interactions
   Upgraded: Smooth scroll, parallax, split text, progress bar
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Page Load Sequence ───────────────────────────────
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 100);

  // ── Scroll Progress Bar ──────────────────────────────
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 2px;
    width: 0%;
    background: linear-gradient(90deg, var(--sage-400), var(--warm-400), var(--sage-500));
    z-index: 10001;
    transition: none;
    pointer-events: none;
  `;
  document.body.appendChild(progressBar);

  // ── Smooth Scroll Reveal (Intersection Observer) ─────
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-scale, .reveal-blur, .reveal-clip, .reveal-line');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -80px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ── Navbar: Smart Hide/Show + Glassmorphism ──────────
  const navbar = document.getElementById('navbar');
  let lastScrollY = 0;
  let scrollDirection = 'up';

  function updateNavbar() {
    const scrollY = window.scrollY;

    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Update scroll progress bar
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';

    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', () => {
    requestAnimationFrame(updateNavbar);
  }, { passive: true });

  // ── Mobile Nav Toggle ────────────────────────────────
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ── FAQ Accordion ────────────────────────────────────
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(i => {
        i.classList.remove('active');
        const q = i.querySelector('.faq-question');
        if (q) q.setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ── Services Accordion ──────────────────────────────
  const serviceAccordionItems = document.querySelectorAll('.service-accordion-item');

  function collapseAccordion(item) {
    const body = item.querySelector('.service-accordion-body');
    if (!body) return;
    // Set current height explicitly so transition starts from it
    body.style.maxHeight = body.scrollHeight + 'px';
    // Force reflow
    body.offsetHeight;
    body.style.maxHeight = '0px';
    item.classList.remove('active');
    const t = item.querySelector('.service-accordion-trigger');
    if (t) t.setAttribute('aria-expanded', 'false');
  }

  function expandAccordion(item) {
    const body = item.querySelector('.service-accordion-body');
    if (!body) return;
    item.classList.add('active');
    const trigger = item.querySelector('.service-accordion-trigger');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    body.style.maxHeight = body.scrollHeight + 'px';
    // After transition ends, set to none so content can reflow if needed
    const onEnd = () => {
      if (item.classList.contains('active')) {
        body.style.maxHeight = 'none';
      }
      body.removeEventListener('transitionend', onEnd);
    };
    body.addEventListener('transitionend', onEnd);
  }

  serviceAccordionItems.forEach(item => {
    const trigger = item.querySelector('.service-accordion-trigger');

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Collapse all others
      serviceAccordionItems.forEach(i => {
        if (i !== item && i.classList.contains('active')) {
          collapseAccordion(i);
        }
      });

      if (isActive) {
        collapseAccordion(item);
      } else {
        expandAccordion(item);
      }
    });
  });

  // ── Button Cursor Glow ──────────────────────────────
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      btn.style.setProperty('--btn-x', x + '%');
      btn.style.setProperty('--btn-y', y + '%');
    });
  });

  // ── Hero Parallax (Multi-layer) ──────────────────────
  const heroContent = document.querySelector('.hero-content');
  const heroFloats = document.querySelector('.hero-float-elements');
  const heroBg = document.querySelector('.hero-gradient');
  const heroBadge = document.querySelector('.hero-badge');

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function heroParallax() {
    const scrollY = window.scrollY;
    const heroHeight = window.innerHeight;

    if (scrollY < heroHeight * 1.2) {
      const progress = scrollY / heroHeight;
      const smoothProgress = easeOutQuart(Math.min(progress, 1));

      if (heroContent) {
        heroContent.style.transform = 'translateY(' + (scrollY * 0.35) + 'px) scale(' + (1 - smoothProgress * 0.05) + ')';
        heroContent.style.opacity = 1 - progress * 1.4;
      }

      if (heroFloats) {
        heroFloats.style.transform = 'translateY(' + (scrollY * 0.18) + 'px)';
      }

      if (heroBg) {
        heroBg.style.transform = 'scale(' + (1 + progress * 0.1) + ')';
      }

      if (heroBadge) {
        heroBadge.style.transform = 'translateY(' + (scrollY * -0.08) + 'px)';
      }
    }
  }

  window.addEventListener('scroll', () => {
    requestAnimationFrame(heroParallax);
  }, { passive: true });

  // ── Section Parallax Backgrounds ─────────────────────
  const parallaxSections = document.querySelectorAll('.section');

  function sectionParallax() {
    const vh = window.innerHeight;

    parallaxSections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const sectionMid = rect.top + rect.height / 2;
      const viewMid = vh / 2;
      const offset = (sectionMid - viewMid) / vh;

      section.style.setProperty('--parallax-offset', (offset * -15) + 'px');
    });
  }

  window.addEventListener('scroll', () => {
    requestAnimationFrame(sectionParallax);
  }, { passive: true });

  // ── Smooth Scroll for Anchor Links ───────────────────
  function easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function smoothScrollTo(targetY, duration) {
    const startY = window.scrollY;
    const diff = targetY - startY;
    if (Math.abs(diff) < 1) return;
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);

      window.scrollTo(0, startY + diff * eased);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        const navHeight = navbar.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 24;
        smoothScrollTo(targetPosition, 1400);
      }
    });
  });

  // ── Active Nav Link Tracking ─────────────────────────
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollY = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector('.nav-links a[href="#' + id + '"]');

      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  }

  window.addEventListener('scroll', () => {
    requestAnimationFrame(updateActiveNav);
  }, { passive: true });

  // ── Card Hover Glow (follows mouse) ──────────────────
  document.querySelectorAll('.pricing-card, .testimonial-card, .ethics-card, .service-accordion-item').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', x + 'px');
      card.style.setProperty('--mouse-y', y + 'px');
    });
  });

  // ── Counter Animation for Pricing ────────────────────
  const priceElements = document.querySelectorAll('.price');
  let pricesAnimated = false;

  function animateCounter(element, start, end, duration) {
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(start + (end - start) * eased);

      element.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  const priceObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !pricesAnimated) {
        pricesAnimated = true;
        priceElements.forEach((el, i) => {
          const target = parseInt(el.textContent);
          setTimeout(() => {
            animateCounter(el, 0, target, 1600);
          }, i * 150);
        });
      }
    });
  }, { threshold: 0.3 });

  priceElements.forEach(el => priceObserver.observe(el));

  // ── Magnetic Button Effect ───────────────────────────
  const magneticStrength = 0.2;

  document.querySelectorAll('.btn').forEach(btn => {
    let bounds;

    btn.addEventListener('mouseenter', () => {
      bounds = btn.getBoundingClientRect();
    });

    btn.addEventListener('mousemove', (e) => {
      if (!bounds) return;
      const x = e.clientX - bounds.left - bounds.width / 2;
      const y = e.clientY - bounds.top - bounds.height / 2;

      btn.style.transform = 'translate(' + (x * magneticStrength) + 'px, ' + (y * magneticStrength) + 'px)';
      btn.style.transition = 'transform 0.2s ease';
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  });

  // ── 3D Tilt on Service & Pricing Cards ───────────────
  const tiltCards = document.querySelectorAll('.pricing-card:not(.featured), .testimonial-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const tiltX = (y - 0.5) * 6;
      const tiltY = (x - 0.5) * -6;

      card.style.transform = 'perspective(800px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg) translateY(-6px)';
      card.style.transition = 'transform 0.15s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  });

  // ── Step Line Width Animation ────────────────────────
  const sectionDividers = document.querySelectorAll('.step-line');

  const lineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = '40px';
        entry.target.style.transition = 'width 1s cubic-bezier(0.16, 1, 0.3, 1)';
      }
    });
  }, { threshold: 0.5 });

  sectionDividers.forEach(line => {
    line.style.width = '0px';
    lineObserver.observe(line);
  });

  // ── Specialty Tag Stagger Animation ──────────────────
  const specialtyTags = document.querySelectorAll('.specialty-tag');
  const specialtyContainer = document.querySelector('.specialty-tags');

  if (specialtyContainer) {
    specialtyTags.forEach(tag => {
      tag.style.opacity = '0';
      tag.style.transform = 'translateY(20px) scale(0.95)';
      tag.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    const tagObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const tags = entry.target.querySelectorAll('.specialty-tag');
          tags.forEach((tag, i) => {
            setTimeout(() => {
              tag.style.opacity = '1';
              tag.style.transform = 'translateY(0) scale(1)';
            }, i * 70);
          });
        }
      });
    }, { threshold: 0.3 });

    tagObserver.observe(specialtyContainer);
  }

  // ── Hero Accent Glow Animation ───────────────────────
  const heroAccent = document.querySelector('.hero-accent');
  if (heroAccent) {
    let glowPhase = 0;

    function animateGlow() {
      glowPhase += 0.008;
      const intensity = (Math.sin(glowPhase) + 1) / 2;
      const alpha = 0.04 + intensity * 0.12;
      const spread = 35 + intensity * 40;

      heroAccent.style.textShadow = '0 0 ' + spread + 'px rgba(122, 139, 104, ' + alpha + ')';

      requestAnimationFrame(animateGlow);
    }

    animateGlow();
  }

  // ── Ambient Cursor Glow (Desktop only) ───────────────
  if (window.matchMedia('(min-width: 768px) and (hover: hover)').matches) {
    const cursor = document.createElement('div');
    cursor.className = 'ambient-cursor';
    cursor.style.cssText = 'position:fixed;width:320px;height:320px;border-radius:50%;background:radial-gradient(circle,rgba(181,191,166,0.07) 0%,transparent 65%);pointer-events:none;z-index:9999;transform:translate(-50%,-50%);will-change:left,top;mix-blend-mode:normal;';
    document.body.appendChild(cursor);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function updateCursor() {
      cursorX += (mouseX - cursorX) * 0.06;
      cursorY += (mouseY - cursorY) * 0.06;

      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';

      requestAnimationFrame(updateCursor);
    }

    updateCursor();
  }

  // ── Step Number Scale In ─────────────────────────────
  document.querySelectorAll('.step-number').forEach((num, i) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.transform = 'scale(1)';
            entry.target.style.opacity = '1';
          }, i * 120);
        }
      });
    }, { threshold: 0.5 });

    num.style.transform = 'scale(0.7)';
    num.style.opacity = '0';
    num.style.transition = 'transform 1s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease';
    observer.observe(num);
  });

  // ── Service List Item Stagger (accordion) ─────────────
  // Items animate when accordion opens via CSS transitions

  // ── Testimonial Avatar Bounce ────────────────────────
  document.querySelectorAll('.testimonial-avatar').forEach(avatar => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.transform = 'scale(1)';
          entry.target.style.opacity = '1';
        }
      });
    }, { threshold: 0.5 });

    avatar.style.transform = 'scale(0)';
    avatar.style.opacity = '0';
    avatar.style.transition = 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease';
    observer.observe(avatar);
  });

  // ── Ethics Icons Rotate In ───────────────────────────
  document.querySelectorAll('.ethics-icon').forEach((icon, i) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.transform = 'rotate(0deg) scale(1)';
            entry.target.style.opacity = '1';
          }, i * 100);
        }
      });
    }, { threshold: 0.5 });

    icon.style.transform = 'rotate(-15deg) scale(0.7)';
    icon.style.opacity = '0';
    icon.style.transition = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.6s ease';
    observer.observe(icon);
  });

  // ── CTA Card Glow shift on mouse ─────────────────────
  const ctaCard = document.querySelector('.cta-card');
  const ctaGlow = document.querySelector('.cta-glow');

  if (ctaCard && ctaGlow) {
    ctaCard.addEventListener('mousemove', (e) => {
      const rect = ctaCard.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      ctaGlow.style.background = 'radial-gradient(circle at ' + x + '% ' + y + '%, rgba(181, 191, 166, 0.2), transparent 50%)';
    });
  }

  // ── Pricing Featured Card Shimmer ────────────────────
  const featuredCard = document.querySelector('.pricing-card.featured');
  if (featuredCard) {
    const shimmer = document.createElement('div');
    shimmer.style.cssText = 'position:absolute;top:0;left:-100%;width:50%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.04),transparent);transform:skewX(-15deg);pointer-events:none;';
    featuredCard.appendChild(shimmer);

    setInterval(() => {
      shimmer.style.transition = 'left 1.2s ease';
      shimmer.style.left = '200%';
      setTimeout(() => {
        shimmer.style.transition = 'none';
        shimmer.style.left = '-100%';
      }, 1400);
    }, 4000);
  }

  // ── About Image Parallax ─────────────────────────────
  const aboutImage = document.querySelector('.about-image-frame');
  if (aboutImage) {
    window.addEventListener('scroll', () => {
      const rect = aboutImage.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.top < vh && rect.bottom > 0) {
        const progress = (vh - rect.top) / (vh + rect.height);
        const shift = (progress - 0.5) * 20;
        const img = aboutImage.querySelector('img');
        if (img) img.style.transform = 'scale(1.05) translateY(' + shift + 'px)';
      }
    }, { passive: true });
  }

  // ── Footer Links Stagger ─────────────────────────────
  document.querySelectorAll('.footer-links').forEach(col => {
    const links = col.querySelectorAll('a');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach((link, i) => {
            setTimeout(() => {
              link.style.opacity = '1';
              link.style.transform = 'translateX(0)';
            }, i * 80);
          });
        }
      });
    }, { threshold: 0.3 });

    links.forEach(link => {
      link.style.opacity = '0';
      link.style.transform = 'translateX(-10px)';
      link.style.transition = 'opacity 0.5s ease, transform 0.5s ease, color 0.3s ease';
    });
    observer.observe(col);
  });

  // ── Hero Mouse Parallax (float elements react to cursor) ──
  const floatElements = document.querySelectorAll('.float-circle');
  if (floatElements.length > 0) {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      floatElements.forEach((el, i) => {
        const strength = (i + 1) * 12;
        el.style.transform = 'translate(' + (x * strength) + 'px, ' + (y * strength) + 'px)';
      });
    });
  }

  // ── Interactive cards tilt on touch devices ──────────
  document.querySelectorAll('.ethics-card, .step-card, .policy-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      card.style.transform = 'perspective(600px) rotateX(' + (y * -3) + 'deg) rotateY(' + (x * 3) + 'deg) translateY(-4px)';
      card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  });

});
