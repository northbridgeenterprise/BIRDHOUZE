(() => {
  const photos = window.BIRDHOUSE_BRANDS || [];
  const grid = document.querySelector('#brand-grid');
  const dialog = document.querySelector('.brand-lightbox');
  if (!grid || !dialog) return;

  let activeIndex = 0;
  document.querySelector('#brand-count').textContent = String(photos.length).padStart(2, '0');
  document.querySelector('#brand-total').textContent = String(photos.length).padStart(2, '0');

  photos.forEach((photo, index) => {
    const button = document.createElement('button');
    button.className = 'brand-photo';
    button.type = 'button';
    button.setAttribute('aria-label', `Ampliar fotografía comercial ${index + 1}`);
    const frame = document.createElement('span');
    frame.className = 'brand-photo-frame';
    frame.style.setProperty('--brand-ratio', `${photo.width} / ${photo.height}`);
    const image = document.createElement('img');
    image.src = photo.thumb;
    image.alt = `Fotografía comercial Birdhouse ${String(index + 1).padStart(2, '0')}`;
    image.loading = 'lazy';
    image.decoding = 'async';
    const label = document.createElement('span');
    label.className = 'brand-photo-label';
    label.innerHTML = `<span>BRANDS & EXPERIENCES</span><span>${String(index + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}</span>`;
    frame.append(image, label);
    button.append(frame);
    button.addEventListener('click', () => openPhoto(index));
    grid.append(button);
  });

  function openPhoto(index) {
    activeIndex = index;
    updatePhoto();
    dialog.showModal();
  }
  function updatePhoto() {
    const photo = photos[activeIndex];
    const image = dialog.querySelector('.brand-full-image');
    image.src = photo.src;
    image.alt = `Fotografía comercial ${activeIndex + 1} de Birdhouse Media MX`;
    dialog.querySelector('.brand-lightbox-index').textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}`;
  }
  function step(direction) {
    activeIndex = (activeIndex + direction + photos.length) % photos.length;
    updatePhoto();
  }
  dialog.querySelector('.brand-lightbox-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.brand-prev').addEventListener('click', () => step(-1));
  dialog.querySelector('.brand-next').addEventListener('click', () => step(1));
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') step(-1);
    if (event.key === 'ArrowRight') step(1);
  });
})();
