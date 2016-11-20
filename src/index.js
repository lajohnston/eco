import { ComponentCollection } from './ComponentCollection';
import { Component } from './Component';
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
  return new ComponentCollection(
    createInstanceFactory(Component)
  );
}

function createEntityFactory(componentCollection) {
  return new EntityFactory(
    createInstanceFactory(Entity),
    componentCollection || createComponentCollection()
  );
}

function createEcosInstance() {
  const componentCollection = createComponentCollection();

  return new Ecos(
    createEntityFactory(componentCollection),
    componentCollection
  );
}

export default createEcosInstance;
