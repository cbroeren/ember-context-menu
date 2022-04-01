import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class ApplicationController extends Controller {
  get selection() {
    return this.model.filterBy('selected');
  }

  @action
  toggleSelectItem(object) {
    object.toggleProperty('selected');
  }
}
