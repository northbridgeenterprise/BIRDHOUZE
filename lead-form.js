document.querySelectorAll('input.lead-date').forEach(input => {
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  input.min = today.toISOString().slice(0, 10);
});

document.querySelectorAll('[data-whatsapp-form]').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const value = name => (data.get(name) || '').toString().trim();
    const dateValue = value('timing');
    const timingInput = form.elements.namedItem('timing');
    const timing = timingInput?.type === 'date' && dateValue
      ? new Intl.DateTimeFormat('es-MX', { dateStyle: 'long' }).format(new Date(`${dateValue}T12:00:00`))
      : dateValue;

    const parts = [
      `Hola Birdhouse, quiero consultar sobre ${form.dataset.area}.`,
      `Nombre: ${value('name')}`,
      `Mi WhatsApp: ${value('phone')}`,
      `Servicio: ${value('service')}`,
      ...(value('coverage') ? [`Cobertura: ${value('coverage')}`] : []),
      `Fecha o tiempo: ${timing}`,
      `Ciudad / ubicación: ${value('location')}`,
      `Inversión aproximada: ${value('budget')}`
    ];
    if (value('brief')) parts.push(`Detalles: ${value('brief')}`);

    const url = `https://wa.me/528121980008?text=${encodeURIComponent(parts.join('\n'))}`;
    const waWindow = window.open(url, '_blank');
    const note = form.querySelector('.lead-note');
    if (waWindow) {
      waWindow.opener = null;
      if (note) note.textContent = 'WhatsApp se abrió en otra pestaña con tu mensaje listo. Revísalo y envíalo para iniciar la conversación.';
    } else {
      window.location.assign(url);
    }
  });
});
