import Controller from '@ember/controller';
import computed   from '@ember/computed';

export default Controller.extend({
  selection: computed('model.@each.selected', function() {
    return this.get('model').filterBy('selected');
  }),

  actions: {
    toggleSelectObject(object) {
      object.toggleProperty('selected');
    }
  }
});
