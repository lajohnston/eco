import { ComponentCollection } from './ComponentCollection';
import { Ecos } from './Ecos';
import { EntityFactory } from './EntityFactory';
import { Entity } from './Entity';

function createInstanceFactory(Newable) {
  return {
    create(...args) {
      return new Newable(...args);
    },
  };
}

function createComponentCollection() {
  return new ComponentCollection();
}

function createEntityFactory(componentCollection) {
  return new EntityFactory(
    createInstanceFactory(Entity),
    componentCollection || createComponentCollection()
  );
}

function createEcosInstance() {
  return new Ecos(createEntityFactory());
}

export default createEcosInstance;
