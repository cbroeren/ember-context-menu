import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import $   from 'jquery';

function hasDisabledClass($element) {
  return $element.hasClass('context-menu__item--disabled');
}

moduleForComponent('context-menu/context-menu-item',
                   'Integration | Component | {{context-menu-item}}',
                   { integration: true });

test('renders with custom classNames', function(assert) {
  this.set('item', {
    label: 'foo',
    class: 'my-customized-item'
  });

  this.render(hbs`{{context-menu-item item=item}}`);

  let $options = $('li.context-menu__item');

  assert.ok($options.hasClass('my-customized-item'));
});

test('renders with label', function(assert) {
  this.set('item', {
    label: 'foo'
  });

  this.render(hbs`{{context-menu-item item=item}}`);

  let $options = $('li.context-menu__item');

  assert.equal($options.length, 1, 'shows option');
  assert.equal($options[0].innerText.trim(), 'foo', 'shows option label');
});

test('renders with selection amount', function(assert) {
  this.set('item', {
    label: 'foo'
  });

  this.render(hbs`{{context-menu-item item=item amount=2}}`);

  let $options = $('li.context-menu__item');
  assert.equal($options[0].innerText.trim(), 'foo (2)', 'shows option label');
});

test(`calls "clickAction" with item's action on clicking`, function(assert) {
  assert.expect(1);

  let item = this.set('item', {
    label: 'foo',
    action() {
      // Do something
    }
  });

  this.on('clickAction', (i) => {
    assert.deepEqual(i, item, `calls "clickAction" with item's action`);
  });

  this.render(hbs`{{context-menu-item item=item
                                      clickAction=(action 'clickAction')}}`);

  $('li.context-menu__item').eq(0).click();
});

test('disabled item', function(assert) {
  assert.expect(1);

  this.set('item', {
    label:    'foo',
    disabled: true,
    action() {
      assert.notOk(true, 'calls disabled action');
    }
  });

  this.render(hbs`{{context-menu-item item=item
                                      isDisabled=item.disabled}}`);

  let $option = $('li.context-menu__item').eq(0);
  assert.ok(hasDisabledClass($option), 'has disabled class');
  $option.trigger('click');
});

test('calls itemIsDisabled() with item to get isDisabled', function(assert) {
  assert.expect(1);

  let item = this.set('item', {
    label:    'foo',
    disabled: true
  });

  this.on('itemIsDisabled', (i) => {
    assert.deepEqual(i, item, 'calls itemIsDisabled() with item');
  });

  this.render(hbs`
    {{context-menu-item item=item itemIsDisabled=(action 'itemIsDisabled')}}
  `);
});

test('sub options', function(assert) {
  assert.expect(6);

  let item = this.set('item', {
    label: 'parent',
    action() { assert.notOk(true, 'calls parent action'); },

    subActions: [
      {
        label: 'sub 1',
        action() {
          // Do something
        }
      },
      { label: 'sub 2' }
    ]
  });

  this.on('clickAction', (actionItem) => {
    assert.deepEqual(actionItem, item.subActions[0],
                     'calls "clickAction" with sub item"');
  });

  this.render(hbs`{{context-menu-item item=item
                                      clickAction=(action 'clickAction')}}`);

  let $options = $('li.context-menu__item');
  let $parent  = $options.eq(0);

  assert.equal($parent[0].innerText.trim(), 'parent', 'shows parent label');
  assert.ok($parent.hasClass('context-menu__item--parent'),
            'parent option has parent class');

  let $subMenu    = $parent.find('.context-menu--sub');
  let $subOptions = $subMenu.find('li');

  assert.equal($subMenu.length, 1, 'shows subMenu');
  assert.equal($subOptions.length, 2, 'shows subMenu options');
  assert.equal($subOptions[0].innerText.trim(), 'sub 1',
               'shows subMenu option label with selection amount');

  $subOptions.eq(0).trigger('click');
});

test('if parent disabled, do not show subItems', function(assert) {
  this.set('item', {
    label:      'foo',
    disabled:   true,
    subActions: [ { label: 'bar' } ]
  });

  this.render(hbs`{{context-menu-item item=item
                                      isDisabled=item.disabled}}`);

  let $parent  = $('li.context-menu__item').eq(0);
  let $subMenu = $parent.find('.context-menu--sub');

  assert.equal($subMenu.length, 0, 'shows subMenu');
});

test('selection amount only on leaf options', function(assert) {
  this.set('item', {
    label:      'foo',
    subActions: [ { label: 'bar' }]
  });

  this.render(hbs`{{context-menu-item item=item amount=2}}`);

  let $parent = $('li.context-menu__item').eq(0);
  let $sub    = $parent.find('.context-menu--sub');

  assert.equal($parent[0].innerText.trim(), 'foo', 'parent without amount');
  assert.equal($sub[0].innerText.trim(), 'bar (2)', 'sub with amount');
});

test('renders with icons', function(assert) {
  this.set('item', {
    label: 'foo',
    icon:  'search'
  });

  this.render(hbs`{{context-menu-item item=item}}`);

  let $option = $('li.context-menu__item').eq(0);
  let $icon   = $option.find('.fa');

  assert.equal($icon.length, 1, 'shows icon');
  assert.ok($icon.hasClass('fa-search'), 'shows right font-awesome icon');
  assert.ok($icon.hasClass('context-menu__item__icon'), 'has icon class');
});
