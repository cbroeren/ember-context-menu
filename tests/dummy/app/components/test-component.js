import Component from 'ember-component';
import contextMenuMixin from 'ember-context-menu';

export default Component.extend(contextMenuMixin, {
  classNames: ['test-component'],

  contextItems: [
    { label: 'lang context label' },
    {
      label: 'parent',
      subActions: [
        { label: 'sub 1' },
        {
          label: 'sub 2',
          subActions: [
            { label: 'sub 2.1' },
            {
              label: 'sub 2.2',
              subActions: [
                {
                  label: 'sub 2.2.1',
                  action() { console.log('sub 2.2.1'); }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
});
