import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

import run from 'ember-runloop';

let $target, contextMenu;
let e = { clientX: 0, clientY: 0 };

moduleForComponent('context-menu', 'Integration | Component | {{context-menu}}', {
  integration: true,

  beforeEach() {
    this.render(hbs`{{context-menu}}`);

    $target = $('#wormhole-context-menu');
    contextMenu = this.container.lookup('service:context-menu');
  }
});

test('appends wormhole target to body', function(assert) {
  assert.equal($target.length, 1);
});

test('hidden by default', function(assert) {
  let $contextMenu = $target.find('.context-menu');
  assert.equal($contextMenu.length, 0);
});

test('visible on activating context-menu', function(assert) {
  run(() => contextMenu.activate(e, [1]));

  let $contextMenu = $target.find('.context-menu');
  assert.equal($contextMenu.length, 1);
});

test('renders on cursor position', function(assert) {
  run(() => contextMenu.activate({ clientX: 400, clientY: 500 }, [1]));

  let $contextMenu = $target.find('.context-menu-container');
  assert.equal($contextMenu.position().left, 400, 'left position');
  assert.equal($contextMenu.position().top, 500, 'top position');

  run(() => contextMenu.activate({ clientX: 222, clientY: 888 }, [1]));

  $contextMenu = $target.find('.context-menu-container');
  assert.equal($contextMenu.position().left, 222, 'rerender left position');
  assert.equal($contextMenu.position().top, 888, 'rerender top position');
});

test('renders with given items', function(assert) {
  run(() => contextMenu.activate(e, [{ label: 'edit' }, { label: 'delete' }]));

  let $items = $target.find('.context-menu__item');
  assert.equal($items.length, 2, 'renders given items');

  assert.equal($items[0].innerText, 'edit', 'renders item 1 with label');
  assert.equal($items[1].innerText, 'delete', 'renders item 2 with label');

  run(() => contextMenu.activate(e, [{ label: 'edit' }], [1, 2]));

  $items = $target.find('.context-menu__item');
  assert.equal($items[0].innerText, 'edit (2)',
               'renders item with selection amount');
});

test('closes on click anywhere', function(assert) {
  run(() => contextMenu.activate(e, [1]));

  let $contextMenu = $target.find('.context-menu');
  assert.equal($contextMenu.length, 1, 'visible on active');

  run(() => $(document.body).click());

  $contextMenu = $target.find('.context-menu');
  assert.equal(contextMenu.isActive, false, 'isActive is set false on click');
  assert.equal($contextMenu.length, 0, 'closed on click anywhere');
});
