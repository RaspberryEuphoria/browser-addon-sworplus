const getElement = (selector, parent = document) => parent.querySelector(selector);
const getAllElements = (selector, parent = document) => parent.querySelectorAll(selector);
const getElementValue = selector => getElement(selector).value;

export default {
  getElement,
  getAllElements,
  getElementValue,
};
