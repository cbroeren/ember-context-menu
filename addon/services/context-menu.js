import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { assert } from '@ember/debug';
import { get, set } from '@ember/object';

const itemHeight = 32;
const safetyMarginX = 400;
const safetyMarginY = 32;

function renderLeft(xPosition, screenWidth) {
  if (!xPosition || !screenWidth) {
    return false;
  }

  let onRightHalf = xPosition > screenWidth * 0.5;
  let spaceRight = screenWidth - xPosition;

  return onRightHalf && spaceRight < safetyMarginX;
}

function correctedPositionY(yPosition, screenHeight, itemCount) {
  let estimatedHeight = itemCount * itemHeight + safetyMarginY;
  let breakPoint = screenHeight - estimatedHeight;

  return yPosition > breakPoint ? breakPoint : yPosition;
}

export default class ContextMenuService extends Service {
  @tracked isActive = false;
  @tracked event = null;
  @tracked items = null;
  @tracked selection = [{ foo: 'bar' }];
  @tracked details = null;
  @tracked position = null;
  @tracked renderLeft = false;

  activate(event, items, selection, details) {
    let { clientX, clientY } = event;
    let screenWidth = get(event, 'view.window.innerWidth');
    let screenHeight = get(event, 'view.window.innerHeight');

    selection = selection ? [].concat(selection) : [];

    this.cleanup();

    if (clientX == null || clientY == null) {
      assert('You need to pass event to the context-menu activate()');
    }

    if (!(items && items.length)) {
      assert('You need to pass items to the context-menu activate()');
    }

    set(this, 'position', {
      left: clientX,
      top: correctedPositionY(clientY, screenHeight, items.length),
    });

    set(this, 'event', event);
    set(this, 'items', items);
    set(this, 'selection', selection || []);
    set(this, 'details', details);
    set(this, 'renderLeft', renderLeft(clientX, screenWidth));
    set(this, 'isActive', true);

    this.addDeactivateHandler();
  }

  willDestroy() {
    this.cleanup();
  }

  get cleanup() {
    return () => {
      if (this.deactivate) {
        document.body.removeEventListener('click', this.deactivate);
        set(this, 'deactivate', null);
      }
      set(this, 'event', null);
      set(this, 'items', null);
      set(this, 'selection', []);
      set(this, 'details', null);
      set(this, 'position', null);
      set(this, 'renderLeft', false);
      set(this, 'isActive', false);
    }
  }

  addDeactivateHandler() {
    set(this, 'deactivate', this.cleanup);
    document.body.addEventListener('click', this.deactivate, { once: true });
  }
}
