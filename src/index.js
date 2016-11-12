import { Ecos } from './Ecos';
import { EntityFactory } from './EntityFactory';
import { Entity } from './Entity';

function createInstanceFactory(Newable) {
  return {
    create(...args) {
      return new (Function.prototype.bind.apply(Newable, args)); // eslint-disable-line new-parens
    },
  };
}

function createEntityFactory() {
  return new EntityFactory(createInstanceFactory(Entity));
}

function createEcosInstance() {
  return new Ecos(createEntityFactory());
}

export default createEcosInstance;
