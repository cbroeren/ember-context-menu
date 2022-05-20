import Modifier from 'ember-modifier';
import { registerDestructor } from '@ember/destroyable'
import { tracked } from '@glimmer/tracking';

function cleanup(instance) {
  if (instance.element && instance.onContextMenu) {
    instance.element.removeEventListener('contextmenu', instance.onContextMenu);
  }

  instance.element = null;
  instance.items = null;
  instance.selection = null;
  instance.details = null;
}

import { inject as service } from '@ember/service';
// import invokeAction from 'ember-invoke-action';

export default class ContextMenuModifier extends Modifier {
  @service('context-menu') contextMenuService;

  element = null;
  @tracked items = null;
  @tracked selection = null;
  @tracked details = null;

  constructor(owner, args) {
    super(owner, args);
    registerDestructor(this, cleanup);
  }

  modify(element, [], { items, selection, details }) {
    // Only add listener and set properties once
    if (!this.element) {
      this.items = items;
      this.selection = selection;
      this.details = details;

      element.addEventListener('contextmenu', this.onContextMenu);
    }
  }

  get onContextMenu() {
    return (e) => {
      if (this.items && this.items.length) {
        e.preventDefault();
        this.contextMenuService.activate(e, this.items, this.selection, this.details);
      }
    };
  }
}
