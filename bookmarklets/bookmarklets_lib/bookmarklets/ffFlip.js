export const ffFlip = () => {
  (() => {
    const ff = document.querySelector('input#edit-value');
    const button = document.querySelector('div#edit-actions%20button#edit-submit');
    ff.value = ff.value === 'false' ? 'true' : 'false';
    button.click();
  })();
};
