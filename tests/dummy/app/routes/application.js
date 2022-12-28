import Route from '@ember/routing/route';
import { A } from '@ember/array';
import EmberObject from '@ember/object';

export default Route.extend({
  model() {
    return A([
      EmberObject.create({ count: 0 }),
      EmberObject.create({ count: 0 }),
      EmberObject.create({ count: 0 }),
      EmberObject.create({ count: 0 }),
      EmberObject.create({ count: 0 }),
    ]);
  },
});
