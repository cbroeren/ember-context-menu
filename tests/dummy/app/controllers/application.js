import Controller from '@ember/controller';
import computed from '@ember/computed';

export default Controller.extend({
  selection: computed('model.@each.selected', function () {
    return this.model.filterBy('selected');
  }),

  actions: {
    toggleSelectItem(object) {
      object.toggleProperty('selected');
    },
  },
});
