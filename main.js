(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.site-header');
  const progressBar = document.querySelector('#progressBar');
  const backTop = document.querySelector('.back-top');
  const navLinks = [...document.querySelectorAll('.nav-links a')];
  const sections = [...document.querySelectorAll('main section[id]')];

  requestAnimationFrame(() => document.body.classList.add('loaded'));

  const updateScrollUI = () => {
    const scrollTop = window.scrollY;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = `${scrollable > 0 ? (scrollTop / scrollable) * 100 : 0}%`;
    header.classList.toggle('scrolled', scrollTop > 10);
    backTop.classList.toggle('visible', scrollTop > 600);

    let current = sections[0]?.id;
    sections.forEach((section) => {
      if (scrollTop >= section.offsetTop - 180) current = section.id;
    });
    navLinks.forEach((link) => link.classList.toggle('active', link.hash === `#${current}`));
  };

  window.addEventListener('scroll', updateScrollUI, { passive: true });
  window.addEventListener('resize', updateScrollUI);
  updateScrollUI();
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.observe').forEach((item) => observer.observe(item));

  const tabs = [...document.querySelectorAll('.skill-tabs button')];
  const skillCards = [...document.querySelectorAll('.skill-grid article')];
  tabs.forEach((tab) => tab.addEventListener('click', () => {
    tabs.forEach((item) => item.setAttribute('aria-selected', String(item === tab)));
    const filter = tab.dataset.filter;
    skillCards.forEach((card) => card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter));
  }));

  const copyButton = document.querySelector('.copy-email');
  copyButton.addEventListener('click', async () => {
    const label = copyButton.querySelector('span');
    try {
      await navigator.clipboard.writeText(copyButton.dataset.email);
      label.textContent = '已复制';
    } catch {
      const input = document.createElement('textarea');
      input.value = copyButton.dataset.email;
      input.style.position = 'fixed';
      input.style.opacity = '0';
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      input.remove();
      label.textContent = '已复制';
    }
    setTimeout(() => { label.textContent = '复制邮箱'; }, 1800);
  });

  if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    const parallaxItems = [...document.querySelectorAll('.parallax')];
    window.addEventListener('mousemove', (event) => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      parallaxItems.forEach((item) => {
        const speed = Number(item.dataset.speed || 0);
        item.style.transform = `translate3d(${x * speed * 1000}px, ${y * speed * 1000}px, 0)`;
      });
    }, { passive: true });

    document.querySelectorAll('.tilt').forEach((card) => {
      card.addEventListener('mousemove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `rotateX(${-y * 3}deg) rotateY(${x * 3}deg) translateY(-2px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }
})();
