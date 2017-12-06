import Service from 'ember-service';
import { assert } from 'ember-metal/utils';

import get from 'ember-metal/get';
import set from 'ember-metal/set';

export default Service.extend({
  isActive: false,

  init(...args) {
    this._super(...args);
    this.deactivate = this.deactivate.bind(this);
  },

  activate(event, items, selection, details) {
    let { clientX, clientY } = event;
    let screenWidth = get(event, 'view.window.innerWidth');
    let screenHeight = get(event, 'view.window.innerHeight');

    selection = selection ? [].concat(selection) : [];

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

    set(this, 'event',      event);
    set(this, 'items',      items);
    set(this, 'selection',  selection);
    set(this, 'details',    details);
    set(this, 'renderLeft', renderLeft(clientX, screenWidth));
    set(this, 'renderUp',   renderUp(clientY, screenHeight));
    set(this, 'isActive',   true);
  },

  deactivate() {
    set(this, 'isActive', false);
  }
});

function renderLeft(xPosition, screenWidth) {
  let onRightHalf = clickOnRightOrBottom(xPosition, screenWidth);
  let spaceRight  = screenWidth - xPosition;

  return onRightHalf && spaceRight < 400;
}

function renderUp(yPosition, screenHeight) {
  return clickOnRightOrBottom(yPosition, screenHeight);
}

function clickOnRightOrBottom(xOrYPosition, screenWidthOrHeight) {
  if (!xOrYPosition || !screenWidthOrHeight) { return false; }

  return xOrYPosition > screenWidthOrHeight / 2;
}
