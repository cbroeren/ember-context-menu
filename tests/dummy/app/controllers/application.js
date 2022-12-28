import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  selection: computed('model.@each.selected', function () {
    return this.model.filterBy('selected');
  }),

  actions: {
    toggleSelectObject(object) {
      object.toggleProperty('selected');
    },
  },
});
