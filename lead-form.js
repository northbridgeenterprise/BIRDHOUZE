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
    const services = data.getAll('service').map(service => service.toString().trim()).filter(Boolean);
    const serviceGroup = form.querySelector('input[type="checkbox"][name="service"]');
    const note = form.querySelector('.lead-note');
    if (serviceGroup && !services.length) {
      if (note) note.textContent = 'Elige al menos un servicio para que podamos orientar mejor la conversación.';
      serviceGroup.focus();
      return;
    }
    const dateValue = value('timing');
    const timingInput = form.elements.namedItem('timing');
    const timing = timingInput?.type === 'date' && dateValue
      ? new Intl.DateTimeFormat('es-MX', { dateStyle: 'long' }).format(new Date(`${dateValue}T12:00:00`))
      : dateValue;

    const parts = [
      `Hola Birdhouse, quiero consultar sobre ${form.dataset.area}.`,
      `Nombre: ${value('name')}`,
      `Mi WhatsApp: ${value('phone')}`,
      ...(value('company') ? [`Empresa o proyecto: ${value('company')}`] : []),
      `Servicios de interés: ${services.join(', ') || value('service')}`,
      ...(value('coverage') ? [`Cobertura: ${value('coverage')}`] : []),
      ...(timing ? [`Fecha o tiempo: ${timing}`] : []),
      ...(value('location') ? [`Ciudad / ubicación: ${value('location')}`] : []),
      ...(value('budget') ? [`Inversión aproximada: ${value('budget')}`] : [])
    ];
    if (value('brief')) parts.push(`Detalles: ${value('brief')}`);

    const url = `https://wa.me/528121980008?text=${encodeURIComponent(parts.join('\n'))}`;
    const waWindow = window.open(url, '_blank');
    if (waWindow) {
      waWindow.opener = null;
      if (note) note.textContent = 'WhatsApp se abrió en otra pestaña con tu mensaje listo. Revísalo y envíalo para iniciar la conversación.';
    } else {
      window.location.assign(url);
    }
  });
});
