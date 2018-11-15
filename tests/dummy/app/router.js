import EmberRouter from '@ember/routing/route';
import config      from './config/environment';

export default EmberRouter.extend({
  location: config.locationType,
  rootURL:  config.rootURL
});
