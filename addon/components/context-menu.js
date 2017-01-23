import layout from '../templates/components/context-menu';

import Ember from 'ember';
import Component from 'ember-component';
import service   from 'ember-service/inject';
import { htmlSafe } from 'ember-string';
import computed, { alias } from 'ember-computed';
import get from 'ember-metal/get';

const { on } = Ember;

export default Component.extend({
  layout,

  contextMenu: service('context-menu'),

  isActive:  alias('contextMenu.isActive'),
  items:     alias('contextMenu.items'),
  selection: alias('contextMenu.selection'),
  details:   alias('contextMenu.details'),

  setWormholeTarget: on('didInsertElement', function() {
    let id = 'wormhole-context-menu';
    let $target = $(`#${id}`);
    if ($target.length === 0) {
      $('body').append(`<div id="${id}"></div>`);
    }
  }),

  position: computed('contextMenu.position.{left,top}', function() {
    let { left, top } = get(this, 'contextMenu.position') || {};
    return htmlSafe(`left: ${left}px; top: ${top}px;`);
  })
});
