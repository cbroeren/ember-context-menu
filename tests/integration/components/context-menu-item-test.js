import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { click, find, findAll } from '@ember/test-helpers';

function hasDisabledClass($element) {
  return $element.classList.contains('context-menu__item--disabled');
}

module('Integration | Component | {{context-menu-item}}', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.actions = {};
    this.send = (actionName, ...args) =>
      this.actions[actionName].apply(this, args);
  });

  test('renders with label', async function (assert) {
    this.set('item', {
      label: 'foo',
    });

    await render(hbs`{{context-menu-item item=item}}`);

    let $options = await findAll('li.context-menu__item');

    assert.equal($options.length, 1, 'shows option');
    assert.equal($options[0].innerText.trim(), 'foo', 'shows option label');
  });

  test('renders with selection amount', async function (assert) {
    this.set('item', {
      label: 'foo',
    });

    await render(hbs`{{context-menu-item item=item amount=2}}`);

    let $options = await findAll('li.context-menu__item');
    assert.equal($options[0].innerText.trim(), 'foo (2)', 'shows option label');
  });

  test(`calls "clickAction" with item's action on clicking`, async function (assert) {
    assert.expect(1);

    let item = this.set('item', {
      label: 'foo',
      action() {
        // Do something
      },
    });

    this.actions.clickAction = (i) => {
      assert.deepEqual(i, item, `calls "clickAction" with item's action`);
    };

    await render(hbs`{{context-menu-item item=item
                                        clickAction=(action 'clickAction')}}`);

    await click(find('li.context-menu__item'));
  });

  test('disabled item', async function (assert) {
    assert.expect(1);

    this.set('item', {
      label: 'foo',
      disabled: true,
      action() {
        assert.notOk(true, 'calls disabled action');
      },
    });

    await render(hbs`{{context-menu-item item=item
                                        isDisabled=item.disabled}}`);

    let $option = await find('li.context-menu__item');
    assert.ok(hasDisabledClass($option), 'has disabled class');
    await click($option);
  });

  test('calls itemIsDisabled() with item to get isDisabled', async function (assert) {
    assert.expect(1);

    let item = this.set('item', {
      label: 'foo',
      disabled: true,
    });

    this.actions.itemIsDisabled = (i) => {
      assert.deepEqual(i, item, 'calls itemIsDisabled() with item');
    };

    await render(hbs`
      {{context-menu-item item=item itemIsDisabled=(action 'itemIsDisabled')}}
    `);
  });

  test('sub options', async function (assert) {
    assert.expect(6);

    let item = this.set('item', {
      label: 'parent',
      action() {
        assert.notOk(true, 'calls parent action');
      },

      subActions: [
        {
          label: 'sub 1',
          action() {
            // Do something
          },
        },
        { label: 'sub 2' },
      ],
    });

    this.actions.clickAction = (actionItem) => {
      assert.deepEqual(
        actionItem,
        item.subActions[0],
        'calls "clickAction" with sub item"'
      );
    };

    await render(hbs`{{context-menu-item item=item
                                        clickAction=(action 'clickAction')}}`);

    let $options = await findAll('li.context-menu__item');
    let $parent = $options[0];

    assert.equal($parent.innerText.trim(), 'parent', 'shows parent label');
    assert.dom($parent).hasClass('context-menu__item--parent');

    let $subMenu = $parent.querySelectorAll('.context-menu--sub');
    let $subOptions = $subMenu[0].querySelectorAll('li');

    assert.equal($subMenu.length, 1, 'shows subMenu');
    assert.equal($subOptions.length, 2, 'shows subMenu options');
    assert.equal(
      $subOptions[0].innerText.trim(),
      'sub 1',
      'shows subMenu option label with selection amount'
    );

    await click($subOptions[0]);
  });

  test('if parent disabled, do not show subItems', async function (assert) {
    this.set('item', {
      label: 'foo',
      disabled: true,
      subActions: [{ label: 'bar' }],
    });

    await render(hbs`{{context-menu-item item=item
                                        isDisabled=item.disabled}}`);

    let $parent = await find('li.context-menu__item');
    let $subMenu = $parent.querySelectorAll('.context-menu--sub');

    assert.equal($subMenu.length, 0, 'shows subMenu');
  });

  test('selection amount only on leaf options', async function (assert) {
    this.set('item', {
      label: 'foo',
      subActions: [{ label: 'bar' }],
    });

    await render(hbs`{{context-menu-item item=item amount=2}}`);

    let $parent = await find('li.context-menu__item');
    let $sub = $parent.querySelectorAll('.context-menu--sub');

    assert.equal($parent.innerText.trim(), 'foo', 'parent without amount');
    assert.equal($sub[0].innerText.trim(), 'bar (2)', 'sub with amount');
  });

  test('renders with icons', async function (assert) {
    this.set('item', {
      label: 'foo',
      icon: 'search',
    });

    await render(hbs`{{context-menu-item item=item}}`);

    let $option = find('li.context-menu__item');
    let $icon = $option.querySelectorAll('.fa');

    assert.equal($icon.length, 1, 'shows icon');
    assert.ok(
      $icon[0].classList.contains('fa-search'),
      'shows right font-awesome icon'
    );
    assert.ok(
      $icon[0].classList.contains('context-menu__item__icon'),
      'has icon class'
    );
  });
});
