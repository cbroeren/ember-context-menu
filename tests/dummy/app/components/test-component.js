import Component from '@ember/component';
import computed from '@ember/computed';
import contextMenuMixin from 'ember-context-menu';

function increment(objects, amount = 1) {
  objects.forEach((object) => {
    object.incrementProperty('count', amount);
  });
}

function setTo(objects, value = 0) {
  objects.forEach((object) => {
    object.set('count', value);
  });
}

export default Component.extend(contextMenuMixin, {
  classNames:        ['test-component'],
  classNameBindings: ['object.selected:test-component--selected'],

  contextSelection: computed(function() { return []; }),

  contextItems: computed('object.selected', function() {
    if (this.get('object.selected')) {
      return [
        { label: 'No action' },
        { label: 'Singe object action',
          disabled(objects) {
            return objects.length > 1;
          },
          action() { } },
        {
          label:      'Multi actions',
          subActions: [
            {
              label: 'Set to 5',
              action(objects) { setTo(objects, 5); }
            },
            {
              label:      'Add',
              subActions: [
                { label: 'Add 1', action(objects) { increment(objects, 1); } },
                { label:    'Add 3',
                  disabled: true,
                  action(objects) { increment(objects, 3); } },
                { label: 'Add 10', action(objects) { increment(objects, 10); } }
              ]
            }
          ]
        },
        {
          label: 'Reset to 0',
          icon:  'undo',
          action(objects) { setTo(objects, 0); }
        }
      ];
    }

    return [];
  })
});
