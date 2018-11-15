import Mixin from '@ember/object/mixin';

import { inject as service } from '@ember/service';
import { get  }              from '@ember/object';
import invokeAction          from 'ember-invoke-action';

export default Mixin.create({
  contextMenuService: service('context-menu'),

  contextMenu(e) {
    invokeAction(this, '_contextMenu', e);

    let contextMenu = get(this, 'contextMenuService');
    let items       = get(this, 'contextItems');
    let selection   = get(this, 'contextSelection');
    let details     = get(this, 'contextDetails');

    if (items && get(items, 'length')) {
      e.preventDefault();
      contextMenu.activate(e, items, selection, details);
    }
  }
});
