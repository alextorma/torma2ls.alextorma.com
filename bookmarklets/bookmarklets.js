import { bookmarkletsFuncs } from './bookmarklets_lib/library.js';

// document.addEventListener('DOMContentLoaded', () => {
  window.copyCode = async (button) => {
    const code = button.nextElementSibling.firstElementChild.innerText.trim();
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

  const setCodeBlock = elem => {
    const container = elem.closest('.bookmarklet-container');
    const codeBlock = container.querySelector('code');
    const link = container.querySelector('a');
    const { func, bmark } = bookmarkletsFuncs[link.getAttribute('code')];
    const codeTab = container.querySelector('.code-tabs-segmented-option.selected');
    const bmarkActive = codeTab.matches('.bmark');
    codeBlock.parentNode.classList.toggle('has-bmark', bmarkActive);
    codeBlock.parentNode.classList.toggle('has-js', !bmarkActive);
    codeBlock.innerHTML = link.href = bmarkActive ? bmark : func;
    if (container.classList.contains('blank')) container.classList.remove('blank');
  };

  document.querySelectorAll('a.bookmarklet').forEach(a => setCodeBlock(a));

  document.querySelectorAll('.code-tabs button').forEach(button => button.addEventListener('click', () => {
    const bmButton = button.parentElement.querySelector('button[name="minified"]');
    const codeButton = button.parentElement.querySelector('button[name="js"]');
    const showBookmarklet = button === bmButton;
    bmButton.classList.toggle('selected', showBookmarklet);
    codeButton.classList.toggle('selected', !showBookmarklet);
    setCodeBlock(button);
  }));
  document.querySelectorAll('.bookmarklet').forEach(link => {
    link.addEventListener('dragstart', () => {
      link.classList.add('dragging');
    });

    link.addEventListener('dragend', () => {
      link.classList.remove('dragging');
    });
  });
// });
