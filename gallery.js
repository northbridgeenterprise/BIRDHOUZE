(() => {
  const photos = window.BIRDHOUSE_GALLERY || [];
  const grid = document.querySelector('#gallery-grid');
  if (!grid) return;

  const filters = [...document.querySelectorAll('.filter-button')];
  const search = document.querySelector('#gallery-search');
  const resultsLabel = document.querySelector('#results-label');
  const noResults = document.querySelector('.no-results');
  const dialog = document.querySelector('.lightbox');
  let activeFilter = 'Todo';
  let visiblePhotos = [];
  let activeIndex = 0;

  document.querySelector('#photo-total').textContent = photos.length;
  document.querySelector('[data-count="Todo"]').textContent = photos.length;
  filters.forEach(button => {
    const count = photos.filter(photo => photo.category === button.dataset.filter).length;
    if (button.dataset.filter !== 'Todo') button.querySelector('[data-count]')?.replaceChildren(document.createTextNode(count));
  });

  photos.forEach((photo, index) => {
    const card = document.createElement('button');
    card.className = 'gallery-card';
    card.type = 'button';
    card.dataset.index = index;
    card.dataset.category = photo.category;
    card.dataset.search = `${photo.title} ${photo.category}`.toLocaleLowerCase('es');
    card.setAttribute('aria-label', `Abrir foto: ${photo.title}, ${photo.category}`);
    const frame = document.createElement('span');
    frame.className = 'gallery-card-frame';
    frame.style.setProperty('--image-ratio', `${photo.width} / ${photo.height}`);
    const image = document.createElement('img');
    image.src = photo.thumb;
    image.alt = photo.alt;
    image.loading = 'lazy';
    image.decoding = 'async';
    const overlay = document.createElement('span');
    overlay.className = 'gallery-card-overlay';
    const caption = document.createElement('span');
    caption.className = 'gallery-card-caption';
    caption.innerHTML = `<span>${photo.category}</span><span class="gallery-open-icon" aria-hidden="true">↗</span>`;
    frame.append(image, overlay, caption);
    card.append(frame);
    card.addEventListener('click', () => openPhoto(index));
    grid.append(card);
  });

  function updateGallery() {
    const term = search.value.trim().toLocaleLowerCase('es');
    visiblePhotos = [];
    document.querySelectorAll('.gallery-card').forEach(card => {
      const photo = photos[Number(card.dataset.index)];
      const matchesFilter = activeFilter === 'Todo' || photo.category === activeFilter;
      const matchesSearch = !term || card.dataset.search.includes(term);
      const visible = matchesFilter && matchesSearch;
      card.hidden = !visible;
      if (visible) visiblePhotos.push(photo);
    });
    resultsLabel.textContent = `${visiblePhotos.length} ${visiblePhotos.length === 1 ? 'FOTOGRAFÍA' : 'FOTOGRAFÍAS'}`;
    noResults.hidden = visiblePhotos.length !== 0;
  }

  filters.forEach(button => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    filters.forEach(item => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    updateGallery();
  }));
  search.addEventListener('input', updateGallery);

  function openPhoto(index) {
    activeIndex = index;
    renderPhoto();
    dialog.showModal();
  }
  function renderPhoto() {
    const photo = photos[activeIndex];
    dialog.querySelector('.lightbox-image').src = photo.src;
    dialog.querySelector('.lightbox-image').alt = photo.alt;
    dialog.querySelector('.lightbox-category').textContent = photo.category;
    dialog.querySelector('.lightbox-title').textContent = photo.title;
    const currentInResults = visiblePhotos.findIndex(item => item === photo) + 1;
    dialog.querySelector('.lightbox-count').textContent = `${String(currentInResults || activeIndex + 1).padStart(2, '0')} / ${String(visiblePhotos.length || photos.length).padStart(2, '0')}`;
  }
  function stepPhoto(direction) {
    const pool = visiblePhotos.length ? visiblePhotos : photos;
    const current = pool.findIndex(photo => photo === photos[activeIndex]);
    const next = (current + direction + pool.length) % pool.length;
    activeIndex = photos.indexOf(pool[next]);
    renderPhoto();
  }
  dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.lightbox-prev').addEventListener('click', () => stepPhoto(-1));
  dialog.querySelector('.lightbox-next').addEventListener('click', () => stepPhoto(1));
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') stepPhoto(-1);
    if (event.key === 'ArrowRight') stepPhoto(1);
  });
  document.addEventListener('keydown', event => {
    if ((event.key === '/' || (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') && !dialog.open) {
      event.preventDefault();
      search.focus();
    }
  });
  updateGallery();
})();
