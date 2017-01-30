import layout from '../templates/components/context-menu-item';

import invokeAction from 'ember-invoke-action';

import Component from 'ember-component';
import computed, { bool } from 'ember-computed';
import get from 'ember-metal/get';

export default Component.extend({
  layout,

  tagName: 'li',

  classNames: ['context-menu__item'],
  classNameBindings: [
    'isDisabled:context-menu__item--disabled',
    '_isParent:context-menu__item--parent'
  ],

  _amount: computed('_isParent', 'amount', function() {
    let amount = get(this, 'amount');

    return !get(this, '_isParent') && amount > 1 && amount;
  }),

  _isParent: bool('item.subActions.length'),

  isDisabled: computed('item.{disabled,action}', 'itemIsDisabled', function() {
    let item = get(this, 'item');
    return invokeAction(this, 'itemIsDisabled', item);
  }),

  click() {
    if (!get(this, 'isDisabled') && !get(this, '_isParent')) {
      invokeAction(this, 'clickAction', get(this, 'item'));
    }
  }
});
