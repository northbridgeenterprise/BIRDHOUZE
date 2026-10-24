(() => {
  const photos = window.BIRDHOUSE_WEDDINGS || [];
  const grid = document.querySelector('#wedding-grid');
  const dialog = document.querySelector('.wedding-lightbox');
  if (!grid || !dialog) return;

  let activeIndex = 0;
  document.querySelector('#wedding-count').textContent = String(photos.length).padStart(2, '0');
  document.querySelector('#wedding-total').textContent = String(photos.length).padStart(2, '0');

  photos.forEach((photo, index) => {
    const button = document.createElement('button');
    button.className = 'wedding-photo';
    button.type = 'button';
    button.setAttribute('aria-label', `Ampliar fotografía ${index + 1} del portafolio de bodas`);
    const frame = document.createElement('span');
    frame.className = 'wedding-photo-frame';
    frame.style.setProperty('--photo-ratio', `${photo.width} / ${photo.height}`);
    const image = document.createElement('img');
    image.src = photo.thumb;
    image.alt = `Fotografía del portafolio de bodas Birdhouse ${String(index + 1).padStart(2, '0')}`;
    image.loading = 'lazy';
    image.decoding = 'async';
    const label = document.createElement('span');
    label.className = 'wedding-photo-label';
    label.innerHTML = `<span>WEDDING STORY</span><span>${String(index + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}</span>`;
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
    const image = dialog.querySelector('.wedding-full-image');
    image.src = photo.src;
    image.alt = `Fotografía ${activeIndex + 1} del portafolio de bodas Birdhouse Media MX`;
    dialog.querySelector('.wedding-lightbox-index').textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}`;
  }
  function step(direction) {
    activeIndex = (activeIndex + direction + photos.length) % photos.length;
    updatePhoto();
  }

  dialog.querySelector('.wedding-lightbox-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.wedding-prev').addEventListener('click', () => step(-1));
  dialog.querySelector('.wedding-next').addEventListener('click', () => step(1));
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') step(-1);
    if (event.key === 'ArrowRight') step(1);
  });
})();
