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
    '_disabled:context-menu__item--disabled',
    '_isParent:context-menu__item--parent'
  ],

  _isParent: bool('item.subActions.length'),

  _selection: computed('selection.[]', function() {
    return [].concat(get(this, 'selection'));
  }),

  amount: computed('_selection.length', '_isParent', function() {
    let amount   = get(this, '_selection.length');
    let isParent = get(this, '_isParent');

    return amount > 1 && !isParent ? amount : null;
  }),

  _disabled: computed('item.{disabled,action,subActions.length}', '_selection',
  function() {
    let item       = get(this, 'item');
    let disabled   = get(item, 'disabled');
    let action     = get(item, 'action');
    let subActions = get(item, 'subActions.length');
    let selection  = get(this, '_selection');

    if (!action && !subActions) {
      return true;
    }

    if (typeof disabled === 'function') {
      return disabled(selection);
    }

    return disabled;
  }),

  click() {
    if (!get(this, '_disabled') && !get(this, '_isParent')) {
      let item      = get(this, 'item');
      let selection = get(this, '_selection');
      let details   = get(this, 'details');

      invokeAction(item, 'action', selection, details);
    }
  }
});
