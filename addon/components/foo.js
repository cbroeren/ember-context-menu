// import invokeAction from 'ember-invoke-action';

import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/string';

export default class ContextMenuComponent extends Component {
  /*
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
  get details() {
    return this.contextMenu.details;
  }
  get clickEvent() {
    return this.contextMenu.event;
  }

  get selection() {
    return [].concat(this.contextMenu.selection);
  }

  setWormholeTarget() {
    // let id = 'wormhole-context-menu';
    // let target = document.querySelectorAll(`#${id}`);
    // if (target.length === 0) {
    //   document.body.insertAdjacentHTML('beforeend', `<div id="${id}"></div>`);
    // }
  }

  get position() {
    let { left, top } = this.contextMenu.position || {};
    return htmlSafe(`left: ${left}px; top: ${top}px;`);
  }

  get itemIsDisabled() {
    let { details, selection } = this;

    return function (item) {
      let disabled = item.disabled;

      if (!item.action && !item.subActions) {
        return true;
      }

      if (typeof disabled === 'function') {
        return disabled(selection, details);
      }

      return disabled;
    };
  }

  clickAction(item) {
    // invokeAction(item, 'action', this.selection, this.details, this.event);
    item.action(this.selection, this.details, this.event);
  }
  */
}
