import storage from '../js/helpers/storage/index.mjs';
import dom from '../js/helpers/dom/index.mjs';

document.addEventListener('DOMContentLoaded', main);

function main() {
  loadUserConfig();
}

function loadUserConfig() {
  const getting = storage.get('colorsConfig');
  getting.then(generateDom, onError);
}

function generateDom({ colorsConfig }) {
  const colorBlockTemplate = dom.getElement('[data-block-name=color-block]');
  const defaultColor = { alias: null, code: null };

  if (!colorsConfig) {
    colorsConfig = [{ ...defaultColor }];
  }

  let aliasCount = colorsConfig.length;

  colorsConfig.forEach((color, index) => {
    const newBlock = createColorBlock({ baseElement: colorBlockTemplate, color, index });
    colorBlockTemplate.parentNode.appendChild(newBlock);
  });

  dom
    .getAllElements('.remove-button')
    .forEach(removeButton => removeButton.addEventListener('click', removeBlock));

  dom.getElement('button[name="add-alias"]').addEventListener('click', () => {
    const newBlock = createColorBlock({
      baseElement: colorBlockTemplate,
      color: { ...defaultColor },
      index: aliasCount,
    });

    colorBlockTemplate.parentNode.appendChild(newBlock);

    dom.getElement('.remove-button', newBlock).addEventListener('click', removeBlock);

    aliasCount++;
  });

  dom.getElement('button[name="save"]').addEventListener('click', saveForm);
}

function createColorBlock({ baseElement, color, index }) {
  const newBlock = createBlock({ baseElement });

  const labels = dom.getAllElements('label', newBlock);
  const inputs = dom.getAllElements('input', newBlock);

  labels.forEach(label => {
    label.changeColor = function(color) {
      this.style.color = color;
    };

    const labelFor = label.getAttribute('for');

    label.setAttribute('for', `${labelFor}${index}`);
    label.innerText += index + 1;

    label.changeColor(color.code);
  });

  inputs.forEach(input => {
    const inputId = input.getAttribute('id');

    input.setAttribute('id', `${inputId}${index}`);
    input.value = color[input.name];

    if (input.name === 'code') {
      input.addEventListener('change', () => {
        labels.forEach(label => {
          label.changeColor(input.value);
        });
      });
    }
  });

  return newBlock;
}

function createBlock({ baseElement }) {
  const newBlock = baseElement.cloneNode(true);
  newBlock.classList.remove('template');

  return newBlock;
}

function onError(error) {
  // eslint-disable-next-line no-console
  console.error(`Error: ${error}`);
}

function saveForm(event) {
  event.preventDefault();

  const defaultText = this.innerText;

  this.disabled = true;

  try {
    saveConfig();

    this.innerText = 'Configuration sauvegardée ! 🥳';

    setTimeout(() => {
      this.disabled = false;
      this.innerText = defaultText;
    }, 1500);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

function saveConfig() {
  const colorBlock = dom.getAllElements('[data-block-name=color-block]');
  const colorsConfig = [];

  colorBlock.forEach(block => {
    const alias = dom.getElement('input[name="alias"]', block).value;
    const code = dom.getElement('input[name="code"]', block).value;

    if (alias && code) {
      colorsConfig.push({ alias, code: code.toLowerCase() });
    }
  });

  storage.set({ colorsConfig });
}

function removeBlock() {
  this.parentNode.parentNode.removeChild(this.parentNode);

  saveConfig();
}
