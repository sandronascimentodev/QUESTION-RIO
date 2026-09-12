/* ==========================================================================
   SANDRO GRAPHIC DESIGN - FEEDBACK & NPS QUESTIONNAIRE
   Direct FormSubmit Integration, Rating Pills & Form Validation
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('nps-form');
  const submitBtn = document.getElementById('submit-btn');

  // Rating Pills Elements
  const ratingPills = document.querySelectorAll('.rating-pill');

  /* --------------------------------------------------------------------------
     1. Rating Scale Pill Selection Logic
     -------------------------------------------------------------------------- */
  ratingPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const radio = pill.querySelector('input[type="radio"]');
      if (!radio) return;

      const ratingScaleContainer = pill.closest('.rating-scale');

      // Unselect all sibling pills in the same rating scale
      if (ratingScaleContainer) {
        ratingScaleContainer.querySelectorAll('.rating-pill').forEach(p => {
          p.classList.remove('selected');
        });
      }

      // Select clicked pill
      radio.checked = true;
      pill.classList.add('selected');

      // Clear error state on parent group if active
      const formGroup = pill.closest('.form-group');
      if (formGroup) {
        formGroup.classList.remove('has-error');
      }
    });

    // Keyboard accessibility support (Enter / Space)
    pill.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        pill.click();
      }
    });
  });

  /* --------------------------------------------------------------------------
     2. Input Real-time Error Clearance
     -------------------------------------------------------------------------- */
  const clienteInput = document.getElementById('cliente_nome');
  if (clienteInput) {
    clienteInput.addEventListener('input', () => {
      if (clienteInput.value.trim() !== '') {
        const group = clienteInput.closest('.form-group');
        if (group) group.classList.remove('has-error');
      }
    });
  }

  /* --------------------------------------------------------------------------
     3. Form Validation Function
     -------------------------------------------------------------------------- */
  function validateForm() {
    let isValid = true;
    let firstErrorElement = null;

    // A. Validate Client Name (empresa)
    const clienteValue = clienteInput ? clienteInput.value.trim() : '';
    const groupCliente = document.getElementById('group-cliente');
    if (!clienteValue) {
      isValid = false;
      if (groupCliente) groupCliente.classList.add('has-error');
      if (!firstErrorElement) firstErrorElement = clienteInput;
    } else {
      if (groupCliente) groupCliente.classList.remove('has-error');
    }

    // B. Validate Rating Scales (nota_geral, nota_resolucao, nota_nps, nota_recorrencia)
    const requiredScales = [
      { name: 'nota_geral', groupId: 'group-q1' },
      { name: 'nota_resolucao', groupId: 'group-q2' },
      { name: 'nota_nps', groupId: 'group-q3' },
      { name: 'nota_recorrencia', groupId: 'group-q4' }
    ];

    requiredScales.forEach(scale => {
      const selectedOption = form.querySelector(`input[name="${scale.name}"]:checked`);
      const groupEl = document.getElementById(scale.groupId);

      if (!selectedOption) {
        isValid = false;
        if (groupEl) groupEl.classList.add('has-error');
        if (!firstErrorElement && groupEl) firstErrorElement = groupEl;
      } else {
        if (groupEl) groupEl.classList.remove('has-error');
      }
    });

    // Scroll smoothly to first invalid field if any
    if (!isValid && firstErrorElement) {
      firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return isValid;
  }

  /* --------------------------------------------------------------------------
     4. Form Submission Handler (FormSubmit Direct POST)
     -------------------------------------------------------------------------- */
  if (form) {
    form.addEventListener('submit', (e) => {
      // Validate form fields first
      if (!validateForm()) {
        e.preventDefault();
        return;
      }

      // Enter Loading State on Button
      if (submitBtn) {
        submitBtn.classList.add('loading');
        const btnText = submitBtn.querySelector('.btn-text');
        if (btnText) btnText.textContent = 'Enviando...';
      }

      // Allow default HTML form POST submit to FormSubmit directly
    });
  }
});
