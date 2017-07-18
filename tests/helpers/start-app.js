import Application from '../../app';
import config from '../../config/environment';

import { assign } from 'ember-platform';
import run from 'ember-runloop';

export default function startApp(attrs) {
  let attributes = assign({}, config.APP);
  attributes = assign(attributes, attrs); // use defaults, but you can override;

  return run(() => {
    let application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
    return application;
  });
}
