import { moduleForComponent, test } from 'ember-qunit';

let subject;

moduleForComponent('context-menu', 'Unit | Component | context-menu', {
  unit: true,

  beforeEach() {
    subject = this.subject();
  }
});

test('isDisabled() when no action set', function(assert) {
  let item = { };

  assert.equal(subject.get('itemIsDisabled')(item), true);
});

test('isDisabled() returns item.disabled', function(assert) {
  let item = {
    action() { }
  };

  assert.notOk(subject.get('itemIsDisabled')(item), 'not disabled when no disabled');

  item.disabled = false;
  assert.notOk(subject.get('itemIsDisabled')(item), 'not disabled when disabled=false');

  item.disabled = true;
  assert.ok(subject.get('itemIsDisabled')(item), 'disabled when disabled=true');
});

test(`isDisabled() depending on selection and details`, function(assert) {
  assert.expect(3);

  let contextSelection = subject.set('selection', [1, 2]);
  let contextDetails   = subject.set('details', { foo: 'bar' });

  let item = {
    label: 'foo',
    action() { },
    disabled(selection, details) {
      assert.deepEqual(selection, contextSelection,
                       'calls disabled function with selection');

      assert.deepEqual(details, contextDetails,
                       'calls disabled function with details');

      return true;
    }
  };

  assert.equal(subject.get('itemIsDisabled')(item), true);
});

test(`clickAction() calls item's action with selection and details`,
function(assert) {
  assert.expect(3);

  let contextSelection = subject.set('selection', [1, 2]);
  let contextDetails   = subject.set('details', { foo: 'bar' });
  let contextEvent     = subject.set('clickEvent', { clientX: 45 });

  let item = {
    label: 'foo',
    action(selection, details, event) {
      assert.deepEqual(selection, contextSelection, 'calls action with selection');
      assert.deepEqual(details, contextDetails, 'calls action with details');
      assert.deepEqual(event, contextEvent, 'calls action with click event');
    }
  };

  subject.get('clickAction')(item);
});
