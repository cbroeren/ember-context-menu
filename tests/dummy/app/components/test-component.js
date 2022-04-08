import Component from '@glimmer/component';
import { set } from '@ember/object';

const increment = (amount = 1) => ((objects) => {
  objects.forEach((object) => {
    set(object, 'count', object.count + amount)
  });
});

const setTo = (value = 0) => ((objects) => {
  objects.forEach((object) => {
    set(object, 'count', value);
  })
});

export default class TestComponent extends Component {
  get contextItems() {
    const { item } = this.args;
    if (item.selected || true) {
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
              action: setTo(5),
            },
            {
              label: 'Add',
              subActions: [
                {
                  label: 'Add 1',
                  action: increment(1),
                },
                {
                  label: 'Add 3',
                  disabled: true,
                  action: increment(3),
                },
                {
                  label: 'Add 10',
                  action: increment(10),
                },
              ],
            },
          ],
        },
        {
          label: 'Reset to 0',
          icon: 'undo',
          action: setTo(0),
        },
      ];
    }

    return [];
  }
}
