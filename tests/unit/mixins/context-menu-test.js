import ContextMenuMixin from 'ember-context-menu/mixins/context-menu';
import { module, test } from 'qunit';

import EmberObject from 'ember-object';
import set from 'ember-metal/set';

const ContextMenuObject = EmberObject.extend(ContextMenuMixin);

let subject;
let event = { clientX: 100, clientY: 50, preventDefault() {} };

module('Unit | Mixin | context-menu', {
  beforeEach() {
    subject = ContextMenuObject.create();
  }
});

test('has context-menu service', function(assert) {
  assert.ok(subject.contextMenuService, 'has contextMenu service');
  assert.equal(subject.contextMenuService.type, 'service',
               'contextMenuService is service');
});

test('triggering contextMenu calls contextMenuService activate',
function(assert) {
  assert.expect(2);

  let contextItems = [
    { label: 'item 1', action() {} },
    { label: 'item 2', action() {} }
  ];

  set(subject, 'contextMenuService', {
    activate(e, items) {
      assert.equal(e, event, 'calls activate with click event');
      assert.equal(items, contextItems,
                   'calls activate with contextItems');
    }
  });

  // doesn't call when no items set
  subject.contextMenu(event);

  set(subject, 'contextItems', contextItems);

  // activates context-menu when items set
  subject.contextMenu(event);
});

test('triggering contextMenu calls pre-action _contextMenu before',
function(assert) {
  assert.expect(1);

  set(subject, 'contextItems', []);

  set(subject, '_contextMenu', (e) => {
    assert.equal(e, event, 'calls pre-action with click event');
  });

  set(subject, 'contextMenuService', {
    activate() { }
  });

  subject.contextMenu(event);
});

test('triggering contextMenu with optional selection and details',
function(assert) {
  let contextItems = [
    { label: 'item 1', action() {} },
    { label: 'item 2', action() {} }
  ];

  let contextSelection = [1, 2, 3];
  let contextDetails   = { foo: 'bar' };

  set(subject, 'contextMenuService', {
    activate(e, items, selection, details) {
      assert.equal(selection, contextSelection,
                   'calls activate with selection');
      assert.equal(details, contextDetails,
                   'calls activate with details');
    }
  });

  set(subject, 'contextItems',     contextItems);
  set(subject, 'contextSelection', contextSelection);
  set(subject, 'contextDetails',   contextDetails);

  subject.contextMenu(event);
});
