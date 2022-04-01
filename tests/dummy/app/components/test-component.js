import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
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

@contextMenuMixin
export default class TestComponent extends Component {
  @tracked contextSelection = [];

  get contextItems() {
    const { item } = this.args;
    if (item.selected) {
      return [
        { label: 'No action' },
        {
          label: 'Singe object action',
          disabled(items) {
            return items.length > 1;
          },
          action() {},
        },
        {
          label: 'Multi actions',
          subActions: [
            {
              label: 'Set to 5',
              action(items) {
                setTo(items, 5);
              },
            },
            {
              label: 'Add',
              subActions: [
                {
                  label: 'Add 1',
                  action(items) {
                    increment(items, 1);
                  },
                },
                {
                  label: 'Add 3',
                  disabled: true,
                  action(items) {
                    increment(items, 3);
                  },
                },
                {
                  label: 'Add 10',
                  action(items) {
                    increment(items, 10);
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Reset to 0',
          icon: 'undo',
          action(items) {
            setTo(items, 0);
          },
        },
      ];
    }

    return [];
  }
}
