export const upsellUpdate = () => {
  (() => {
    const contentTitle = () => document.querySelector(`input[id*='attribute-alt-value']`)?.value || '';
    const updTitl = (t, m = contentTitle()) => document.querySelectorAll('input[type=text]').forEach(i => t != null && i.value.includes(m) && i.setAttribute('value', i.value.replace(m, t)));
    const refPlats = (n = document.querySelector(`div[class*='device-apps'] div.ss-main`), c = n && n.cloneNode(true)) =>
      c && (Object.assign(c.style, {
        position: 'fixed', top: '10px', left: '10px', zIndex: '9999', pointerEvents: 'none', width: 'auto'
      }),
        document.body.appendChild(c),
        ['div.ss-content', 'div.ss-multi-selected div.ss-add', 'div.ss-multi-selected div.ss-value span.ss-value-delete'].forEach(sel => c.querySelectorAll(sel).forEach(elem => elem.remove()))
      );
    const putImgs = (f = document.querySelectorAll(`input[id*='fieldset-image-fid'][type='file']`)) => f.length && f.forEach((inp, i) => {
      if (i === 0) inp.focus();
      const submit = document.querySelector('button#edit-actions-submit');
      inp.addEventListener('change', () => {
        (i + 1 === f.length ? submit : f[i + 1]).focus();
      }, { once: true });
      inp.addEventListener('keydown', e => {
        if (e.code === 'KeyN') {
          e.preventDefault();
          (e.shiftKey && i > 0
            ? f[i - 1]
            : e.shiftKey && i === 0
              ? submit
              : i + 1 < f.length
                ? f[i + 1]
                : submit).focus();
        }
      });
      submit.addEventListener('keydown', e => {
        if (e.code === 'KeyN') {
          e.preventDefault();
          (e.shiftKey ? f[f.length - 1] : f[0]).focus();
        }
      });
    });
    switch (jQuery('input#edit-tags').val()) {
      case 'carousel_originals': case 'carousel_favorites': updTitl(prompt('Title:'));
        putImgs();
        break;
      case 'slides': refPlats();
        putImgs();
        break;
      default: putImgs();
        break;
    }
  })();
};
