import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ContextMenuItem extends Component {
  get amount() {
    if (!this.isParent && this.args.amount > 1) {
      return this.args.amount;
    }
    return null;
  }

  get isParent() {
    return !!this.args.item.subActions?.length;
  }

  get isDisabled() {
    return this.args.checkItemIsDisabled(this.args.item);
  }

  @action
  onClick() {
    if (!this.isDisabled && !this.isParent) {
      this.args.handleClickAction(this.args.item);
    }
  }
}
