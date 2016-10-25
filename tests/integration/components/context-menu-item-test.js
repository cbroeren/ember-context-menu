import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

function hasDisabledClass($element) {
  return $element.hasClass('context-menu__item--disabled');
}

moduleForComponent('context-menu/context-menu-item',
                   'Integration | Component | {{context-menu-item}}', {
  integration: true
});

test('renders with label', function(assert) {
  this.set('item', {
    label: 'foo'
  });

  this.render(hbs`{{context-menu-item item=item}}`);

  let $options = $('li.context-menu__item');

  assert.equal($options.length, 1, 'shows option');
  assert.equal($options[0].innerText, 'foo', 'shows option label');
});

test('renders with selection amount', function(assert) {
  this.set('item', {
    label: 'foo'
  });

  this.set('selection', [1, 2]);

  this.render(hbs`{{context-menu-item item=item selection=selection}}`);

  let $options = $('li.context-menu__item');
  assert.equal($options[0].innerText, 'foo (2)', 'shows option label');
});

test('calls action on clicking', function(assert) {
  assert.expect(2);

  let contextSelection = [1, 2];
  let contextDetails   = { content: 'DEF' };

  this.set('selection', contextSelection);
  this.set('details', contextDetails);

  this.set('item', {
    label: 'foo',
    action(selection, details) {
      assert.deepEqual(selection, contextSelection, 'calls action with selection');
      assert.deepEqual(details, contextDetails, 'calls action with details');
    }
  });

  this.render(hbs`{{context-menu-item item=item
                                      selection=selection
                                      details=details}}`);

  let $option = $('li.context-menu__item').eq(0);
  $option.trigger('click');
});

test('disabled when no action set', function(assert) {
  this.set('item', {
    label: 'foo'
  });

  this.render(hbs`{{context-menu-item item=item}}`);

  let $option = $('li.context-menu__item').eq(0);
  assert.ok(hasDisabledClass($option), 'has disabled class');
});

test('disabled boolean property', function(assert) {
  assert.expect(1);

  this.set('item', {
    label: 'foo',
    disabled: true,
    action() {
      assert.notOk(true, 'calls disabled action');
    }
  });

  this.render(hbs`{{context-menu-item item=item}}`);

  let $option = $('li.context-menu__item').eq(0);
  assert.ok(hasDisabledClass($option), 'has disabled class');
  $option.trigger('click');
});

test('disabled function property depending on selection', function(assert) {
  assert.expect(2);

  let contextSelection = [1, 2];
  this.set('selection', contextSelection);

  this.set('item', {
    label: 'foo',
    disabled(selection) {
      assert.deepEqual(selection, contextSelection,
                       'calls disabled function with selection');
      return true;
    },
    action() {
      assert.notOk(true, 'calls disabled action');
    }
  });

  this.render(hbs`{{context-menu-item item=item
                                      selection=selection}}`);

  let $option = $('li.context-menu__item').eq(0);
  assert.ok(hasDisabledClass($option), 'has disabled class');
  $option.trigger('click');
});

test('sub options', function(assert) {
  assert.expect(7);

  let contextSelection = [{ name: 'ABC' }];
  let contextDetails   = { foo: 'bar' };

  this.set('selection', contextSelection);
  this.set('details', contextDetails);

  this.set('item', {
    label: 'parent',
    action() { assert.notOk(true, 'calls parent action'); },
    subActions: [
      {
        label: 'sub 1',
        action(selection, details) {
          assert.deepEqual(selection, contextSelection,
                           'calls sub action with selection');
          assert.equal(details, contextDetails,
                       'calls sub action with details');
        }
      },
      { label: 'sub 2' }
    ]
  });

  this.render(hbs`{{context-menu-item item=item
                                      selection=selection
                                      details=details}}`);

  let $options = $('li.context-menu__item');
  let $parent  = $options.eq(0);

  assert.equal($parent[0].innerText, 'parent', 'shows parent label');
  assert.ok($parent.hasClass('context-menu__item--parent'),
            'parent option has parent class');

  let $subMenu = $parent.find('.context-menu--sub');
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

  this.render(hbs`{{context-menu-item item=item}}`);

  let $parent  = $('li.context-menu__item').eq(0);
  let $subMenu = $parent.find('.context-menu--sub');

  assert.equal($subMenu.length, 0, 'shows subMenu');
});

test('selection amount only on parent', function(assert) {
  this.set('item', {
    label: 'foo',
    subActions: [ { label: 'bar' }]
  });

  this.set('selection', [1, 2]);

  this.render(hbs`{{context-menu-item item=item selection=selection}}`);

  let $options = $('li.context-menu__item');
  let $parent  = $options.eq(0);
  let $sub     = $parent.find('.context-menu--sub');

  assert.equal($options[0].innerText, 'foo', 'shows parent without amount');
  assert.equal($sub[0].innerText.trim(), 'bar (2)', 'shows sub with amount');
});
