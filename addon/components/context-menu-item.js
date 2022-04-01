import Component from '@glimmer/component';
// import invokeAction from 'ember-invoke-action';

export default class ContextMenuItem extends Component {
  get _amount() {
    if (!this.isParent && this.args.amount > 1) {
      return this.args.amount;
    }
    return null;
  }

  get _isParent() {
    return !!this.args.item.subActions?.length;
  }

  isDisabled() {
    // return invokeAction(this, 'itemIsDisabled', this.args.item);
    return this.args.itemIsDisabled(this.args.item);
  }

  click() {
    if (!this.isDisabled && !this._isParent) {
      invokeAction(this, 'clickAction', this.item);
    }
  }
}
