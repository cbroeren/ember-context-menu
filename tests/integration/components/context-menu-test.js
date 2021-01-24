import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

let $target, contextMenu;
let e = { clientX: 0, clientY: 0 };

module('Integration | Component | {{context-menu}}', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(async function () {
    await render(hbs`{{context-menu}}`);

    $target = document.querySelector('#wormhole-context-menu');
    contextMenu = this.owner.lookup('service:context-menu');
  });

  test('appends wormhole target to body', function (assert) {
    assert.ok($target);
  });

  test('hidden by default', function (assert) {
    assert.dom('.context-menu', $target).doesNotExist();
  });

  test('visible on activating context-menu', async function (assert) {
    contextMenu.activate(e, [1]);

    await settled();

    assert.dom('.context-menu', $target).exists();
  });

  test('renders on cursor position', async function (assert) {
    contextMenu.activate({ clientX: 400, clientY: 500 }, [1]);

    await settled();

    let $contextMenu = $target.querySelector('.context-menu-container');
    assert.equal($contextMenu.offsetLeft, 400, 'left position');
    assert.equal($contextMenu.offsetTop, 500, 'top position');

    contextMenu.activate({ clientX: 222, clientY: 888 }, [1]);

    await settled();

    $contextMenu = $target.querySelector('.context-menu-container');
    assert.equal($contextMenu.offsetLeft, 222, 'rerender left position');
    assert.equal($contextMenu.offsetTop, 888, 'rerender top position');
  });

  test('renders left when at the right and less than 400 from right side', async function (assert) {
    let view = { window: { innerWidth: 1200 } };

    contextMenu.activate({ clientX: 700, clientY: 500, view }, [1]);

    await settled();

    let $contextMenu = $target.querySelector('.context-menu');
    assert.notOk(
      $contextMenu.classList.contains('context-menu--left'),
      'renders right by default'
    );

    contextMenu.activate({ clientX: 850, clientY: 500, view }, [1]);

    await settled();

    $contextMenu = $target.querySelector('.context-menu');
    assert.ok(
      $contextMenu.classList.contains('context-menu--left'),
      'renders with left class when on the right of the screen'
    );
  });

  test('renders on vertical breakpoint when the estimated height is too big', async function (assert) {
    let view = { window: { innerHeight: 800 } };
    let brakePoint = 800 - (2 * 32 + 32); // (itemCount * itemHeight + safetyMarginY)

    contextMenu.activate({ clientX: 400, clientY: 500, view }, [{}, {}]);

    await settled();

    let $contextMenu = $target.querySelector('.context-menu-container');
    assert.equal(
      $contextMenu.offsetTop,
      500,
      'top position (smaller than break point)'
    );

    contextMenu.activate({ clientX: 400, clientY: 780, view }, [{}, {}]);

    await settled();

    $contextMenu = $target.querySelector('.context-menu-container');
    assert.equal(
      $contextMenu.offsetTop,
      brakePoint,
      'top position (bigger than break point)'
    );
  });

  test('closes on click anywhere', async function (assert) {
    contextMenu.activate(e, [1]);

    await settled();

    assert.dom('.context-menu', $target).exists('visible on active');

    await click(document.body);

    await settled();

    assert.equal(contextMenu.isActive, false, 'isActive is set false on click');
    assert
      .dom('.context-menu', $target)
      .doesNotExist('closed on click anywhere');
  });

  test('renders with given items', async function (assert) {
    contextMenu.activate(e, [{ label: 'edit' }, { label: 'del' }]);

    await settled();

    let $items = $target.querySelectorAll('.context-menu__item');
    assert.equal($items.length, 2, 'renders given items');

    assert.equal(
      $items[0].innerText.trim(),
      'edit',
      'renders item 1 with label'
    );
    assert.equal(
      $items[1].innerText.trim(),
      'del',
      'renders item 2 with label'
    );

    contextMenu.activate(e, [{ label: 'edit' }], [1, 2]);

    await settled();

    $items = $target.querySelectorAll('.context-menu__item');
    assert.equal(
      $items[0].innerText.trim(),
      'edit (2)',
      'renders item with selection amount'
    );
  });
});
