import layout from '../templates/components/context-menu-item';

import Component from '@ember/component';
import { computed } from '@ember/object';
import { bool } from '@ember/object/computed';

import invokeAction from 'ember-invoke-action';

export default Component.extend({
  layout,

  tagName: 'li',

  classNames: ['context-menu__item'],
  classNameBindings: [
    'isDisabled:context-menu__item--disabled',
    '_isParent:context-menu__item--parent',
  ],

  _amount: computed('_isParent', 'amount', function () {
    let amount = this.amount;

    return !this._isParent && amount > 1 && amount;
  }),

  _isParent: bool('item.subActions.length'),

  isDisabled: computed('item.{disabled,action}', 'itemIsDisabled', function () {
    let item = this.item;
    return invokeAction(this, 'itemIsDisabled', item);
  }),

  click() {
    if (!this.isDisabled && !this._isParent) {
      invokeAction(this, 'clickAction', this.item);
    }
  },
});
