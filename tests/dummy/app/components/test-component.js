import Component from 'ember-component';
import contextMenuMixin from 'ember-context-menu';

export default Component.extend(contextMenuMixin, {
  classNames: ['test-component'],

  contextSelection: [1, 2],

  contextItems: [
    { label: 'Disabled item' },
    {
      label: 'Multi actions',
      subActions: [
        { label: 'Sub action', action() { } },
        {
          label: 'Multiple sub',
          subActions: [
            { label: 'Sub A', action() { } },
            { label: 'Sub B', action() { } }
          ]
        }
      ]
    },
    {
      label: 'Do something',
      icon: 'search',
      action() { }
    }
  ]
});
