import { bookmarkletsFuncs } from './bookmarklets_lib/library.js';

document.addEventListener('DOMContentLoaded', () => {
  window.copyCode = async (button) => {
    const container = button.closest('.bookmarklet-container');
    const funcName = container.querySelector('a').getAttribute('code');
    const codeActive = container.querySelector('code.hidden').classList.contains('bmark') ? 'func' : 'bmark';
    const code = bookmarkletsFuncs[funcName][codeActive];
    button.disabled = true;
    button.innerHTML = 'Copying...';
    try {
      await navigator.clipboard.writeText(code);
      button.innerHTML = '✓ Copied!';
      setTimeout(() => {
        button.disabled = false;
        button.innerHTML = 'Copy';
      }, 2000);
    } catch (err) {
      button.innerHTML = 'Copy Failed';
      console.error('Copy failed:', err);
    }
  };

  document.querySelectorAll('button>span.label').forEach(label => label.parentNode.insertBefore((() => {
    const ghost = document.createElement('span');
    ghost.classList.add('ghost');
    ghost.textContent = label.textContent;
    return ghost;
  })(), label));

  [
    `button span.ghost { font-weight: 600; visibility: hidden; }`,
    `button span.label:hover { position: absolute; top: 5px; }`,
    `button span.label { position: absolute; top: 1; left: 1rem; }`,
  ].forEach((css, i) => {
    const sheetInd = [...document.styleSheets].findIndex(sheet => sheet.href.endsWith('torma2ls.css'));
    const ruleInd = [...document.styleSheets[sheetInd].rules].findIndex(rule => rule.selectorText === ".code-tabs-segmented-option:hover");
    document.styleSheets[sheetInd].insertRule(css, i % 2 !== 0 ? ruleInd + 1 : ruleInd - 1);
  });

  document.querySelectorAll('a.bookmarklet').forEach(a => {
    const container = a.closest('.bookmarklet-container');
    const codeBlocks = container.querySelectorAll('code');
    const link = container.querySelector('a');
    const { func, bmark } = bookmarkletsFuncs[link.getAttribute('code')];
    codeBlocks.forEach(codeBlock => {
      const bmarkBlock = codeBlock.matches('.bmark');
      codeBlock.innerHTML = link.href = bmarkBlock ? bmark : func;
    });
    Prism.highlightAll();
    if (container.classList.contains('blank')) container.classList.remove('blank');
  });

  document.querySelectorAll('.code-tabs button').forEach(button => button.addEventListener('click', () => {
    const bmButton = button.parentElement.querySelector('button[name="minified"]');
    const codeButton = button.parentElement.querySelector('button[name="js"]');
    const bmarkActive = button === bmButton;
    bmButton.classList.toggle('selected', bmarkActive);
    codeButton.classList.toggle('selected', !bmarkActive);
    button.closest('.bookmarklet-container').querySelectorAll('code').forEach((codeBlock, i) => {
      codeBlock.classList.toggle('hidden', codeBlock.matches('.bmark') ? !bmarkActive : bmarkActive);
    });
  }));
  document.querySelectorAll('.bookmarklet').forEach(link => {
    link.addEventListener('dragstart', () => {
      link.classList.add('dragging');
    });

    link.addEventListener('dragend', () => {
      link.classList.remove('dragging');
    });
  });
});
