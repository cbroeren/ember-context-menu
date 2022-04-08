// import invokeAction from 'ember-invoke-action';

import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/string';
import { action } from '@ember/object';

export default class ContextMenuComponent extends Component {
  @service('context-menu') contextMenu;

  get isActive() {
    return this.contextMenu.isActive;
  }
  get renderLeft() {
    return this.contextMenu.renderLeft;
  }
  get items() {
    return this.contextMenu.items;
  }
  get clickEvent() {
    return this.contextMenu.event;
  }

  get selection() {
    return [...this.contextMenu.selection];
  }

  get position() {
    let { left = 0, top = 0 } = this.contextMenu.position || {};
    return htmlSafe(`left: ${left}px; top: ${top}px;`);
  }

  get itemIsDisabled() {
    return (item) => {
      if (!item.action && !item.subActions) {
        return true;
      }

      if (typeof item.disabled === 'function') {
        return item.disabled(this.selection, this.contextMenu.details);
      }

      return item.disabled;
    };
  }

  @action
  handleClickAction(item) {
    item.action?.(this.selection, this.details, this.event);
  }
}
