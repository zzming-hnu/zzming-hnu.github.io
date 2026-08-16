(() => {
  'use strict';

  const copyButton = document.querySelector('.copy-email');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const backTop = document.querySelector('.back-top');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const fallbackCopy = (text) => {
    const input = document.createElement('textarea');
    input.value = text;
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    input.remove();
  };

  copyButton?.addEventListener('click', async () => {
    const originalLabel = copyButton.textContent;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(copyButton.dataset.email);
      } else {
        fallbackCopy(copyButton.dataset.email);
      }
      copyButton.textContent = '已复制';
    } catch {
      fallbackCopy(copyButton.dataset.email);
      copyButton.textContent = '已复制';
    }
    window.setTimeout(() => {
      copyButton.textContent = originalLabel;
    }, 1600);
  });

  navToggle?.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks?.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      navLinks.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
    }
  });

  const updateBackTop = () => {
    backTop?.classList.toggle('visible', window.scrollY > 600);
  };

  window.addEventListener('scroll', updateBackTop, { passive: true });
  updateBackTop();

  backTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
})();
