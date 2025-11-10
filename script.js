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
  const ease = 0.12;
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