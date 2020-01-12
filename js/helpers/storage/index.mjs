const getDataFromStorage = key => browser.storage.sync.get(key);
const setDataFromStorage = data => browser.storage.sync.set(data);

export default {
  get: getDataFromStorage,
  set: setDataFromStorage,
};
