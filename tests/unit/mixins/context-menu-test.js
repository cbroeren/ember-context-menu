import ContextMenuMixin     from 'ember-context-menu/mixins/context-menu';
import { module, test }     from 'qunit';
import { setupTest }        from 'ember-qunit';
import EmberObject, { set } from '@ember/object';

const ContextMenuObject = EmberObject.extend(ContextMenuMixin);

let event = { clientX: 100, clientY: 50, preventDefault() {} };

module('Unit | Mixin | context-menu', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('test:subject', ContextMenuObject);
    this.subject = this.owner.lookup('test:subject');
  });

  test('has context-menu service', function(assert) {
    assert.ok(this.subject.contextMenuService, 'has contextMenu service');
  });

  test('triggering contextMenu calls contextMenuService activate',
  function(assert) {
    assert.expect(2);

    let contextItems = [
      { label: 'item 1', action() {} },
      { label: 'item 2', action() {} }
    ];

    set(this.subject, 'contextMenuService', {
      activate(e, items) {
        assert.equal(e, event, 'calls activate with click event');
        assert.equal(items, contextItems,
                     'calls activate with contextItems');
      }
    });

    // doesn't call when no items set
    this.subject.contextMenu(event);

    set(this.subject, 'contextItems', contextItems);

    // activates context-menu when items set
    this.subject.contextMenu(event);
  });

  test('triggering contextMenu calls pre-action _contextMenu before',
  function(assert) {
    assert.expect(1);
    set(this.subject, 'contextItems', []);

    set(this.subject, '_contextMenu', (e) => {
      assert.equal(e, event, 'calls pre-action with click event');
    });

    set(this.subject, 'contextMenuService', {
      activate() { }
    });

    this.subject.contextMenu(event);
  });

  test('triggering contextMenu with optional selection and details',
  function(assert) {
    let contextItems = [
      { label: 'item 1', action() {} },
      { label: 'item 2', action() {} }
    ];

    let contextSelection = [1, 2, 3];
    let contextDetails   = { foo: 'bar' };

    set(this.subject, 'contextMenuService', {
      activate(e, items, selection, details) {
        assert.equal(selection, contextSelection,
                     'calls activate with selection');
        assert.equal(details, contextDetails,
                     'calls activate with details');
      }
    });

    set(this.subject, 'contextItems',     contextItems);
    set(this.subject, 'contextSelection', contextSelection);
    set(this.subject, 'contextDetails',   contextDetails);

    this.subject.contextMenu(event);
  });
});
