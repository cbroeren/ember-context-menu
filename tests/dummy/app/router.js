import config from './config/environment';
import Router from '@ember/routing/route';

export default Router.extend({
  location: config.locationType,
  rootURL:  config.rootURL
});
