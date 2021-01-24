import Mixin from '@ember/object/mixin';

import { inject as service } from '@ember/service';
import invokeAction from 'ember-invoke-action';

export default Mixin.create({
  contextMenuService: service('context-menu'),

  contextMenu(e) {
    invokeAction(this, '_contextMenu', e);

    let contextMenu = this.contextMenuService;
    let items = this.contextItems;
    let selection = this.contextSelection;
    let details = this.contextDetails;

    if (items && items.length) {
      e.preventDefault();
      contextMenu.activate(e, items, selection, details);
    }
  },
});
