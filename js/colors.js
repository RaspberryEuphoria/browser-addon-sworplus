// Can't seem to run .mjs imports in a content_scripts file atm...
const getDataFromStorage = key => browser.storage.sync.get(key);
const setDataFromStorage = data => browser.storage.sync.set(data);

const storage = {
  get: getDataFromStorage,
  set: setDataFromStorage,
};

main();

function main() {
  const fieldsetEl = document.querySelector('#postingbox fieldset.form-actions');
  const buttonsEls = fieldsetEl.querySelectorAll('button[type="submit"]');

  let isDisabled = true;

  buttonsEls.forEach(button => {
    button.addEventListener('click', function(event) {
      if (isDisabled) {
        event.preventDefault();

        const getting = storage.get('colorsConfig');
        getting.then(({ colorsConfig }) => replaceAliases(colorsConfig, this), onError);

        isDisabled = false;
      }
    });
  });
}

function replaceAliases(colorsConfig, button) {
  const textareaEl = document.querySelector('textarea#message');

  colorsConfig.forEach(({ alias, code }) => {
    textareaEl.value = textareaEl.value.replace(
      new RegExp(`\\[${alias}\\]`, 'g'),
      `[color=${code}]`,
    );

    textareaEl.value = textareaEl.value.replace(new RegExp(`\\[\/${alias}\\]`, 'g'), '[/color]');
  });

  button.disabled = false;
  button.click();
}

function onError(error) {
  // eslint-disable-next-line no-console
  console.error(`Error: ${error}`);
}
