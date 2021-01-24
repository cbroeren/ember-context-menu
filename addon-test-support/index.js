/**
 * Allows for easily triggering the context menu to open for testing
 * @param {*} selector
 */
export function triggerContextMenu(selector) {
  const element = document.querySelector(selector).parentElement;

  const contextMenuEvent = new MouseEvent('contextmenu', {
    bubbles: true,
    cancelable: false,
    view: window,
    button: 2,
    buttons: 0,
    clientX: element.getBoundingClientRect().x,
    clientY: element.getBoundingClientRect().y,
  });

  element.dispatchEvent(contextMenuEvent);
}
