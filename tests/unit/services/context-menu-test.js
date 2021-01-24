import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

let contextMenu;

module('Unit | Service | context menu', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    contextMenu = this.owner.lookup('service:context-menu');
  });

  test('by default not active', function (assert) {
    assert.equal(contextMenu.isActive, false);
  });

  test('activate() needs event and items', function (assert) {
    assert.throws(
      () => contextMenu.activate({}, null, 1),
      'Throws error when no event passed for cursor position'
    );

    assert.throws(
      () => contextMenu.activate({ clientX: 0, clientY: 0 }, null, 1),
      'Throws error when no items passed'
    );
  });

  test('calling activate() sets position and content and activates', function (assert) {
    let items = [
      { label: 'edit', action() {} },
      { label: 'delete', action() {} },
    ];

    contextMenu.activate({ clientX: 400, clientY: 500 }, items);

    assert.deepEqual(
      contextMenu.position,
      { left: 400, top: 500 },
      'sets position depending on cursor position'
    );
    assert.deepEqual(contextMenu.items, items, 'sets items');
    assert.equal(contextMenu.isActive, true, 'activated');
  });

  test('optional can pass a selection', function (assert) {
    let items = [{ label: 'edit' }];

    contextMenu.activate({ clientX: 400, clientY: 500 }, items, [{}, {}]);

    assert.equal(contextMenu.selection.length, 2, 'sets selection array');
  });

  test('optional can pass details', function (assert) {
    let items = [{ label: 'edit' }];

    let details = { foo: 'bar', locationX: 400 };

    contextMenu.activate({ clientX: 400, clientY: 500 }, items, null, details);

    assert.equal(contextMenu.details, details, 'sets details');
  });
});
