import Mixin from 'ember-metal/mixin';

import invokeAction from 'ember-invoke-action';
import service      from 'ember-service/inject';
import get          from 'ember-metal/get';

export default Mixin.create({
  contextMenuService: service('context-menu'),

  contextMenu(e) {
    invokeAction(this, '_contextMenu', e);

    let contextMenu = get(this, 'contextMenuService');
    let items       = get(this, 'contextItems') || this.computeContextItems();
    let selection   = get(this, 'contextSelection');
    let details     = get(this, 'contextDetails');

    if (items && get(items, 'length')) {
      e.preventDefault();
      contextMenu.activate(e, items, selection, details);
    }
  }
});
