function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

(function() {
  // Opposite-cursor hover movement for the profile image.
  // Float animation runs on the wrapper (.hero-img-appear); the inner image (.floating-img)
  // is translated by JS so the two transforms don't conflict.
  const wrapper = document.querySelector('.hero-img-appear');
  const img = document.querySelector('.floating-img');
  if (!img || !wrapper) return;

  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  const maxOffset = 10; // maximum px movement opposite to cursor
  const ease = 0.1;
  let rafId = null;

  function onPointerMove(e) {
    const rect = img.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2); // -1..1
    const dy = (e.clientY - cy) / (rect.height / 2);
    // Move opposite to cursor: negate dx/dy
    targetX = -dx * maxOffset;
    targetY = -dy * maxOffset;
  }

  function animate() {
    currentX += (targetX - currentX) * ease;
    currentY += (targetY - currentY) * ease;
    img.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    rafId = requestAnimationFrame(animate);
  }

  wrapper.addEventListener('pointerenter', (e) => {
    // start tracking pointer movement
    try { wrapper.setPointerCapture && wrapper.setPointerCapture(e.pointerId); } catch (err) {}
    img.style.transition = 'transform 0.18s cubic-bezier(0.22,0.12,0.12,1)';
    wrapper.addEventListener('pointermove', onPointerMove);
    if (!rafId) rafId = requestAnimationFrame(animate);
  });

  wrapper.addEventListener('pointerleave', (e) => {
    wrapper.removeEventListener('pointermove', onPointerMove);
    targetX = 0; targetY = 0;
    // ease back; then clear RAF and cleanup
    setTimeout(() => {
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      img.style.transform = '';
      img.style.transition = '';
    }, 260);
  });
})();

// Project card parallax zoom effect on hover
(function() {
  const projectCards = document.querySelectorAll('.color-container');
  projectCards.forEach(card => {
    const img = card.querySelector('.project-img');
    if (!img) return;

    let targetScale = 1;
    let currentScale = 1;
    const maxScale = 1.08; // max zoom: 1.08x
    const minScale = 0.92; // min zoom: 0.92x
    const ease = 0.12;
    let rafId = null;

    function onPointerMove(e) {
      const rect = img.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      
      // Calculate distance from center (0 at center, 1 at edges)
      const dx = Math.abs((e.clientX - cx) / (rect.width / 2));
      const dy = Math.abs((e.clientY - cy) / (rect.height / 2));
      const distance = Math.min(Math.sqrt(dx * dx + dy * dy) / Math.sqrt(2), 1);
      
      // Map distance to scale: closer to center = max zoom, at edges = min zoom
      targetScale = maxScale - (distance * (maxScale - minScale));
    }

    function animate() {
      currentScale += (targetScale - currentScale) * ease;
      img.style.transform = `scale(${currentScale})`;
      rafId = requestAnimationFrame(animate);
    }

    card.addEventListener('pointerenter', (e) => {
      try { card.setPointerCapture && card.setPointerCapture(e.pointerId); } catch (err) {}
      img.style.transition = 'transform 0.16s cubic-bezier(0.22,0.12,0.12,1)';
      card.addEventListener('pointermove', onPointerMove);
      if (!rafId) rafId = requestAnimationFrame(animate);
    });

    card.addEventListener('pointerleave', (e) => {
      card.removeEventListener('pointermove', onPointerMove);
      targetScale = 1;
      setTimeout(() => {
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        img.style.transform = '';
        img.style.transition = '';
      }, 240);
    });
  });
})();

// Grayscale laggy aura cursor — applies a desaturation/backdrop-filter inside the circular aura only.
(function() {
  // Disable on touch devices (avoid performance and UX issues)
  const isTouch = (typeof navigator !== 'undefined' && (navigator.maxTouchPoints && navigator.maxTouchPoints > 0)) || ('ontouchstart' in window);
  if (isTouch) return;

  const aura = document.createElement('div');
  aura.className = 'aura-cursor';
  document.body.appendChild(aura);

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let curX = targetX;
  let curY = targetY;
  const ease = 0.02; // much more laggy so the pointer can move out of the circle
  let rafId = null;
  let visibleTimeout = null;

  function raf() {
    curX += (targetX - curX) * ease;
    curY += (targetY - curY) * ease;
    aura.style.transform = `translate3d(${curX}px, ${curY}px, 0) translate(-50%, -50%)`;
    rafId = requestAnimationFrame(raf);
  }

  function showAura() {
    aura.classList.add('visible');
    if (!rafId) rafId = requestAnimationFrame(raf);
  }

  function hideAura() {
    aura.classList.remove('visible');
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  }

  document.addEventListener('pointermove', (e) => {
    if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
    targetX = e.clientX;
    targetY = e.clientY;
    showAura();
    // hide after 1s of inactivity
    if (visibleTimeout) clearTimeout(visibleTimeout);
    visibleTimeout = setTimeout(() => { hideAura(); }, 1000);
  });

  document.addEventListener('pointerleave', () => {
    if (visibleTimeout) clearTimeout(visibleTimeout);
    hideAura();
  });

  // Shrink aura over interactive elements for precision
  document.addEventListener('pointerover', (e) => {
    const btn = e.target.closest && e.target.closest('button, a, .icon');
    if (btn) aura.classList.add('small');
  });
  document.addEventListener('pointerout', (e) => {
    const btn = e.target.closest && e.target.closest('button, a, .icon');
    if (btn) aura.classList.remove('small');
  });

})();
