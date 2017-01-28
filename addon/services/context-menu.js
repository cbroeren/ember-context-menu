import Service from 'ember-service';
import { assert } from 'ember-metal/utils';

import get from 'ember-metal/get';
import set from 'ember-metal/set';

function renderLeft(xPosition, screenWidth) {
  if (!xPosition || !screenWidth) { return false; }

  let onRightHalf = xPosition > screenWidth * 0.5;
  let spaceRight  = screenWidth - xPosition;

  return onRightHalf && spaceRight < 400;
}

export default Service.extend({
  isActive: false,

  activate(event, items, selection, details) {
    let { clientX, clientY } = event;
    let screenWidth = get(event, 'view.window.innerWidth');

    selection = selection ? [].concat(selection) : [];

    this.removeDeactivateHandler();

    if (clientX == null || clientY == null) {
      assert('You need to pass event to the context-menu activate()');
    }

    if (!(items && items.length)) {
      assert('You need to pass items to the context-menu activate()');
    }

    set(this, 'position', {
      left: clientX,
      top:  clientY
    });

    set(this, 'items',      items);
    set(this, 'selection',  selection);
    set(this, 'details',    details);
    set(this, 'renderLeft', renderLeft(clientX, screenWidth));
    set(this, 'isActive',   true);

    this.addDeactivateHandler();
  },

  willDestroy() {
    this.removeDeactivateHandler();
  },

  removeDeactivateHandler() {
    let deactivate = get(this, 'deactivate');

    if (deactivate != null) {
      $(document.body).off('click', deactivate);
      set(this, 'deactivate', null);
    }
  },

  addDeactivateHandler() {
    let deactivate = () => set(this, 'isActive', false);
    set(this, 'deactivate', deactivate);

    $(document.body).one('click', deactivate);
  }
});
