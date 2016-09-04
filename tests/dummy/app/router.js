import config from './config/environment';
import Router from 'ember-router';

export default Router.extend({
  location: config.locationType
});
