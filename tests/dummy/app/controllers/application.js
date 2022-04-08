import Controller from '@ember/controller';
import { set, action } from '@ember/object';

export default class ApplicationController extends Controller {
  get selection() {
    return this.model.filterBy('selected');
  }

  @action
  toggleSelectItem(object) {
    set(object, 'selected', !object.selected);
  }

  @action
  selectOnContext(object) {
    // keep selection when the right clicked item is selected
    // select only the right clicked item when it's not selected
    if ((this.selection.length && !object.selected) || !object.selected) {
      this.clearSelection();
      set(object, 'selected', true);
    }
  }

  @action
  clearSelection() {
    this.model.forEach((item) => {
      set(item, 'selected', false);
    });
  }
}
